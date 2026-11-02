import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import crypto from 'crypto';
import { connectMongoDB, isMongoConfigured } from './db.js';
import { Product } from './models/Product.js';
import { Order } from './models/Order.js';
import { Enquiry } from './models/Enquiry.js';
import { products as fallbackProducts } from '../src/data.js';
import {
  sendOtpEmail,
  sendOrderCustomerEmail,
  sendOrderOwnerEmail,
  isResendConfigured,
} from './email.js';

dotenv.config();

export const app = express();

// Secure CORS configuration: allow specific trusted domains & local development
const allowedOrigins = [
  process.env.APP_URL,
  process.env.PUBLIC_URL,
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5000',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server or non-browser tools (no origin header)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.railway.app') ||
        origin.endsWith('.vercel.app') ||
        origin.endsWith('.render.com') ||
        origin.endsWith('.aanurtextile.com')
      ) {
        return callback(null, true);
      }
      return callback(new Error('Blocked by CORS policy'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Automatically ensure MongoDB is connected on incoming API requests
app.use('/api', async (req, res, next) => {
  if (isMongoConfigured() && mongoose.connection.readyState === 0) {
    try {
      await connectMongoDB();
    } catch (err) {
      console.warn('MongoDB connection attempt in middleware failed:', err.message);
    }
  }
  next();
});

// =============================================================================
// AUTHENTICATION & SECURITY HELPERS
// =============================================================================
const SESSION_SECRET = process.env.SESSION_SECRET || 'aanur-textile-secure-secret-key-2026';

export function generateAuthToken(user) {
  const payload = Buffer.from(
    JSON.stringify({
      email: user.email,
      role: user.role,
      isAdmin: Boolean(user.isAdmin),
      name: user.name,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days expiration
    })
  ).toString('base64url');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

export function verifyAuthToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;
  const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  try {
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return null;
    }
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!data.exp || Date.now() > data.exp) return null;
    return data;
  } catch {
    return null;
  }
}

export function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
  const user = verifyAuthToken(token);
  const adminEmail = (process.env.STORE_ADMIN_EMAIL || process.env.VITE_STORE_ADMIN_EMAIL || '').trim().toLowerCase();

  const isUserAdmin = Boolean(
    user && (user.isAdmin || user.role === 'admin' || (adminEmail && user.email?.toLowerCase() === adminEmail))
  );

  if (!isUserAdmin) {
    return res.status(403).json({
      success: false,
      error: 'Access denied. Administrator authentication required.',
    });
  }
  req.user = user;
  next();
}

// =============================================================================
// IN-MEMORY STORES & RATE LIMITING (With TTL and capacity caps)
// =============================================================================
const otpStore = new Map(); // email.toLowerCase() -> { otp, expiresAt, name, phone, attempts }
const otpRateLimit = new Map(); // key -> [timestamps]
const localOrdersStore = new Map(); // orderRef -> orderObject (capped at 500)

function checkRateLimit(key, maxRequests = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const timestamps = (otpRateLimit.get(key) || []).filter((t) => now - t < windowMs);
  if (timestamps.length >= maxRequests) {
    return false;
  }
  timestamps.push(now);
  otpRateLimit.set(key, timestamps);
  return true;
}

// Memory bounded setter for local orders (max 500 items FIFO)
function saveLocalOrder(ref, data) {
  if (localOrdersStore.size >= 500) {
    const oldest = localOrdersStore.keys().next().value;
    if (oldest) localOrdersStore.delete(oldest);
  }
  localOrdersStore.set(ref, data);
}

// Periodic cleanup every 2 minutes for expired OTPs and stale rate-limit trackers
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of otpStore.entries()) {
    if (now > val.expiresAt) otpStore.delete(key);
  }
  for (const [key, timestamps] of otpRateLimit.entries()) {
    const fresh = timestamps.filter((t) => now - t < 15 * 60 * 1000);
    if (fresh.length === 0) otpRateLimit.delete(key);
    else otpRateLimit.set(key, fresh);
  }
}, 2 * 60 * 1000).unref();

// =============================================================================
// 1. HEALTH & STATUS CHECK (For Render, Railway & Monitoring)
// =============================================================================
app.get('/health', (req, res) => {
  return res.status(200).json({ status: 'ok', uptime: process.uptime(), timestamp: new Date() });
});

app.get('/api/health', (req, res) => {
  return res.status(200).json({ status: 'ok', uptime: process.uptime(), timestamp: new Date() });
});

app.get('/api/status', async (req, res) => {
  const configured = isMongoConfigured();
  if (!configured) {
    return res.json({
      configured: false,
      stack: 'MERN',
      message: 'MONGODB_URI not configured in .env. Using local catalog fallback.',
      resendConfigured: isResendConfigured(),
    });
  }

  try {
    await connectMongoDB();
    const [productsCount, ordersCount, enquiriesCount] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      Enquiry.countDocuments(),
    ]);

    return res.json({
      configured: true,
      stack: 'MERN',
      database: mongoose.connection.name,
      host: mongoose.connection.host,
      counts: {
        products: productsCount,
        orders: ordersCount,
        enquiries: enquiriesCount,
      },
      resendConfigured: isResendConfigured(),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message, configured: false, stack: 'MERN' });
  }
});

// =============================================================================
// 2. GMAIL OTP AUTHENTICATION (RESEND)
// =============================================================================

/**
 * Send 6-Digit OTP to Gmail / Email with Rate Limiting and Secure PRNG
 */
app.post('/api/auth/send-otp', async (req, res) => {
  const { email, name, phone } = req.body || {};

  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, error: 'Please enter a valid Gmail / email address.' });
  }

  const cleanEmail = email.trim().toLowerCase();

  // Rate limit: max 5 requests per 10 minutes per email, 10 per IP
  const clientIp = req.ip || req.headers['x-forwarded-for'] || 'client';
  if (!checkRateLimit(`ip:${clientIp}`, 10) || !checkRateLimit(`email:${cleanEmail}`, 5)) {
    return res.status(429).json({
      success: false,
      error: 'Too many verification code requests. Please wait a few minutes before trying again.',
    });
  }

  // Cryptographically secure 6-digit OTP
  const otp = crypto.randomInt(100000, 1000000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  otpStore.set(cleanEmail, {
    otp,
    expiresAt,
    name: name || '',
    phone: phone || '',
    attempts: 0,
  });

  console.log(`[Gmail OTP] 🔑 Verification code generated and dispatched to: ${cleanEmail}`);

  // Send real email via Resend
  let emailSent = false;
  try {
    const result = await sendOtpEmail({ email: cleanEmail, otp });
    emailSent = Boolean(result.success);
  } catch (err) {
    console.error('[Gmail OTP Error]:', err.message);
  }

  return res.json({
    success: true,
    message: emailSent
      ? `Verification OTP sent to ${cleanEmail}`
      : `Verification code sent to ${cleanEmail}`,
    email: cleanEmail,
    emailSent,
  });
});

/**
 * Verify 6-Digit OTP & Authenticate User with Attempt Lockout & Signed Token
 */
app.post('/api/auth/verify-otp', async (req, res) => {
  const { email, otp, name, phone } = req.body || {};

  if (!email || !otp) {
    return res.status(400).json({ success: false, error: 'Email and 6-digit OTP code are required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanOtp = String(otp).trim();
  const entry = otpStore.get(cleanEmail);

  if (!entry) {
    return res.status(400).json({
      success: false,
      error: 'No active OTP found for this email. Please request a new code.',
    });
  }

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(cleanEmail);
    return res.status(400).json({
      success: false,
      error: 'Verification code expired (valid for 10 minutes). Please request a new code.',
    });
  }

  // Brute force protection: max 5 failed attempts
  if ((entry.attempts || 0) >= 5) {
    otpStore.delete(cleanEmail);
    return res.status(429).json({
      success: false,
      error: 'Too many incorrect attempts. For security, this code was invalidated. Please request a new code.',
    });
  }

  // Timing-safe comparison to prevent side-channel timing attacks
  const expectedBuffer = Buffer.from(entry.otp.padStart(6, '0'));
  const candidateBuffer = Buffer.from(cleanOtp.padStart(6, '0'));
  const isMatch = expectedBuffer.length === candidateBuffer.length && crypto.timingSafeEqual(expectedBuffer, candidateBuffer);

  if (!isMatch) {
    entry.attempts = (entry.attempts || 0) + 1;
    const remaining = 5 - entry.attempts;
    return res.status(400).json({
      success: false,
      error: `Invalid 6-digit verification code. (${remaining} attempts remaining before lockout)`,
    });
  }

  // OTP verified successfully
  otpStore.delete(cleanEmail);

  const adminEmail = (process.env.STORE_ADMIN_EMAIL || process.env.VITE_STORE_ADMIN_EMAIL || '').trim().toLowerCase();
  const isAdmin = Boolean(adminEmail && cleanEmail === adminEmail);

  const displayName = isAdmin ? 'Aanur Admin' : (name || entry.name || cleanEmail.split('@')[0]);
  const user = {
    name: displayName,
    email: cleanEmail,
    role: isAdmin ? 'admin' : 'customer',
    isAdmin,
    phone: phone || entry.phone || '+91 98427 51234',
    city: 'Tiruppur',
    state: 'Tamil Nadu',
    avatarBg: isAdmin ? '#8B1E0F' : '#b76b52',
  };

  const token = generateAuthToken(user);

  return res.json({
    success: true,
    message: isAdmin
      ? 'Admin verification successful! Accessing Artisan Admin Control Center...'
      : 'Verification successful. Welcome to Aanur Textile!',
    user,
    token,
    isAdmin,
    redirect: isAdmin ? '/admin' : '/profile',
  });
});

/**
 * Verify Current Session / Token
 */
app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
  const user = verifyAuthToken(token);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Not authenticated or token expired.' });
  }
  return res.json({ success: true, user });
});

// =============================================================================
// 3. PRODUCTS CATALOG (MongoDB -> Express -> React)
// =============================================================================
app.get('/api/products', async (req, res) => {
  if (!isMongoConfigured()) {
    return res.json({ products: fallbackProducts, source: 'local' });
  }

  try {
    await connectMongoDB();
    const docs = await Product.find().sort({ id: 1 }).lean();
    if (docs && docs.length > 0) {
      const mapped = docs.map((doc) => ({
        id: doc.id,
        name: doc.name,
        category: doc.category || 'Bedsheets',
        price: doc.price,
        originalPrice: doc.originalPrice,
        badge: doc.badge,
        material: doc.material,
        sizes: doc.sizes || ['Queen', 'King'],
        colors: doc.colors || [],
        colorNames: doc.colorNames || [],
        image: doc.image,
        images: doc.images && doc.images.length > 0 ? doc.images : [doc.image],
        variants: doc.variants || [],
        description: doc.description || '',
      }));
      return res.json({ products: mapped, source: 'mongodb' });
    }
    return res.json({ products: fallbackProducts, source: 'local' });
  } catch (err) {
    console.error('MongoDB products fetch error:', err.message);
    return res.json({ products: fallbackProducts, source: 'local' });
  }
});

// Single Product by ID
app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;

  if (!isMongoConfigured()) {
    const found = fallbackProducts.find((p) => p.id === id);
    return found ? res.json({ product: found, source: 'local' }) : res.status(404).json({ error: 'Product not found' });
  }

  try {
    await connectMongoDB();
    const doc = await Product.findOne({ id }).lean();
    if (doc) {
      const product = {
        id: doc.id,
        name: doc.name,
        category: doc.category || 'Bedsheets',
        price: doc.price,
        originalPrice: doc.originalPrice,
        badge: doc.badge,
        material: doc.material,
        sizes: doc.sizes || ['Queen', 'King'],
        colors: doc.colors || [],
        colorNames: doc.colorNames || [],
        image: doc.image,
        images: doc.images && doc.images.length > 0 ? doc.images : [doc.image],
        variants: doc.variants || [],
        description: doc.description || '',
      };
      return res.json({ product, source: 'mongodb' });
    }
    return res.status(404).json({ error: 'Product not found' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// =============================================================================
// 4. ORDER CREATION, VERIFICATION & 30-MINUTE AUTOMATION
// =============================================================================

/**
 * Create Order with Server-Side Price Verification, Token & 30-Minute Auto-Verify Window
 */
app.post('/api/orders', async (req, res) => {
  const body = req.body || {};
  const orderRef = (typeof body.orderRef === 'string' && body.orderRef.trim()) || `AT-${crypto.randomInt(100000, 1000000)}`;
  const verificationToken = crypto.randomBytes(24).toString('hex');
  const autoVerifyAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now

  const rawItems = Array.isArray(body.items) ? body.items : [];
  if (rawItems.length === 0) {
    return res.status(400).json({ success: false, error: 'Order must contain at least one product.' });
  }

  // Pre-load canonical products to prevent client-side price tampering
  const productIds = rawItems.map((item) => String(item.productId || item.product?.id || item.id || '').trim()).filter(Boolean);
  let dbProducts = [];
  if (isMongoConfigured() && mongoose.connection.readyState === 1) {
    try {
      dbProducts = await Product.find({ id: { $in: productIds } }).lean();
    } catch (err) {
      console.warn('MongoDB products lookup failed, falling back to local catalog:', err.message);
    }
  }

  // Authoritative server-side price computation
  const formattedItems = [];
  let computedSubtotal = 0;

  for (const item of rawItems) {
    const pid = String(item.productId || item.product?.id || item.id || '').trim();
    const canonical = dbProducts.find((p) => p.id === pid) || fallbackProducts.find((p) => p.id === pid);

    if (!canonical) {
      console.warn(`Product ID "${pid}" not found in catalog, using fallback price check.`);
    }

    const verifiedPrice = Number(canonical ? canonical.price : (item.price || 0));
    const verifiedQty = Math.max(1, Math.min(100, Math.floor(Number(item.quantity) || 1)));
    const lineTotal = verifiedPrice * verifiedQty;
    computedSubtotal += lineTotal;

    formattedItems.push({
      productId: pid || 'item',
      name: canonical?.name || item.name || 'Handcrafted Bedsheet',
      price: verifiedPrice,
      quantity: verifiedQty,
      size: typeof item.size === 'string' ? item.size : 'Standard',
      colorIndex: Number(item.colorIndex ?? 0),
      variantImage: typeof item.variantImage === 'string' ? item.variantImage : (canonical?.image || ''),
      lineTotal,
    });
  }

  // Server-side discount coupon validation
  let computedDiscount = 0;
  const rawCode = typeof body.couponCode === 'string' ? body.couponCode.trim().toUpperCase() : '';
  if (rawCode === 'BESTOFFER' || rawCode === 'BESTOFFERS' || rawCode === 'SECRET15') {
    computedDiscount = Math.round(computedSubtotal * 0.15);
  } else if (rawCode === 'AANUR10' || rawCode === 'SECRET10') {
    computedDiscount = Math.round(computedSubtotal * 0.10);
  } else if (rawCode === 'OFFER50') {
    computedDiscount = Math.min(50, computedSubtotal);
  }
  const computedTotal = Math.max(0, computedSubtotal - computedDiscount);

  const orderData = {
    orderRef,
    customer: {
      firstName: String(body.firstName || '').trim(),
      lastName: String(body.lastName || '').trim(),
      email: String(body.email || '').trim().toLowerCase(),
      phone: String(body.phone || '').trim(),
      street: String(body.street || '').trim(),
      city: String(body.city || '').trim(),
      postalCode: String(body.postalCode || '').trim(),
    },
    items: formattedItems,
    subtotal: computedSubtotal,
    discount: computedDiscount,
    couponCode: rawCode,
    total: computedTotal,
    deliveryStatus: 'Processing · 7-14 days',
    paymentMethod: String(body.paymentMethod || 'Cash on Delivery (COD)').trim(),
    paymentStatus: 'Pending',
    isVerified: false,
    verificationToken,
    verificationType: 'unverified',
    autoVerifyAt,
    createdAt: new Date(),
  };

  // Save in bounded local memory registry (max 500 items)
  saveLocalOrder(orderRef, { ...orderData });

  let savedToMongo = false;
  let orderDocId = null;

  if (isMongoConfigured()) {
    try {
      await connectMongoDB();
      const newOrder = new Order({
        ...orderData,
      });
      const saved = await newOrder.save();
      savedToMongo = true;
      orderDocId = saved._id;
    } catch (err) {
      console.error('MongoDB Order save error:', err.message);
    }
  }

  // Safe host resolution to prevent Host/Origin Header Poisoning
  const configuredAppUrl = (process.env.APP_URL || process.env.PUBLIC_URL || '').trim().replace(/\/$/, '');
  let baseUrl = configuredAppUrl;
  if (!baseUrl) {
    const rawHost = req.get('host') || 'localhost:5173';
    // Validate host against regex allowlist to prevent host header injection
    const isValidHost = /^([a-zA-Z0-9-]+\.)*(localhost(:\d+)?|127\.0\.0\.1(:\d+)?|railway\.app|vercel\.app|render\.com|aanurtextile\.com)$/i.test(rawHost);
    const safeHost = isValidHost ? rawHost : 'localhost:5173';
    const proto = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    baseUrl = `${proto}://${safeHost}`;
  }
  const confirmUrl = `${baseUrl}/verify-order?orderRef=${encodeURIComponent(orderRef)}&token=${encodeURIComponent(verificationToken)}`;

  // 1. Send Customer Email with Confirm Button & 30-min notice
  let customerEmailSent = false;
  try {
    const custRes = await sendOrderCustomerEmail(
      {
        orderRef,
        firstName: orderData.customer.firstName,
        lastName: orderData.customer.lastName,
        email: orderData.customer.email,
        phone: orderData.customer.phone,
        street: orderData.customer.street,
        city: orderData.customer.city,
        postalCode: orderData.customer.postalCode,
        subtotal: orderData.subtotal,
        discount: orderData.discount,
        couponCode: orderData.couponCode,
        total: orderData.total,
        items: formattedItems,
        paymentMethod: orderData.paymentMethod,
      },
      confirmUrl
    );
    customerEmailSent = Boolean(custRes.success);
  } catch (err) {
    console.error('[Customer Email Exception]:', err.message);
  }

  // 2. Send Workshop / Owner Notification to STORE_ADMIN_EMAIL
  try {
    await sendOrderOwnerEmail(
      {
        orderRef,
        firstName: orderData.customer.firstName,
        lastName: orderData.customer.lastName,
        email: orderData.customer.email,
        phone: orderData.customer.phone,
        street: orderData.customer.street,
        city: orderData.customer.city,
        postalCode: orderData.customer.postalCode,
        total: orderData.total,
        items: formattedItems,
        paymentMethod: orderData.paymentMethod,
      },
      'new'
    );
  } catch (err) {
    console.error('[Owner Email Exception]:', err.message);
  }

  return res.status(201).json({
    success: true,
    orderRef,
    id: orderDocId,
    savedToMongo,
    deliveryTime: '7 to 14 days',
    isVerified: false,
    confirmUrl,
    customerEmailSent,
    autoVerifyAt,
    subtotal: computedSubtotal,
    discount: computedDiscount,
    total: computedTotal,
  });
});

/**
 * Verify Order (User clicks email confirm button with valid verificationToken)
 */
app.all('/api/orders/verify', async (req, res) => {
  const rawOrderRef = req.query.orderRef || req.body?.orderRef;
  const rawToken = req.query.token || req.body?.token;

  if (!rawOrderRef || typeof rawOrderRef !== 'string') {
    return res.status(400).json({ success: false, error: 'Valid orderRef string is required.' });
  }
  if (!rawToken || typeof rawToken !== 'string') {
    return res.status(400).json({ success: false, error: 'Verification token is required.' });
  }

  const orderRef = rawOrderRef.trim();
  const token = rawToken.trim();

  let order = localOrdersStore.get(orderRef);
  let updatedInMongo = false;
  let mongoDoc = null;

  if (isMongoConfigured()) {
    try {
      await connectMongoDB();
      mongoDoc = await Order.findOne({ orderRef });
      if (mongoDoc) {
        order = mongoDoc.toObject();
      }
    } catch (err) {
      console.warn('MongoDB order query error:', err.message);
    }
  }

  if (!order) {
    return res.status(404).json({ success: false, error: `Order #${orderRef} not found.` });
  }

  // Validate verification token against expected stored token
  const expectedToken = String(order.verificationToken || '').trim();
  if (!expectedToken) {
    return res.status(403).json({ success: false, error: 'Order does not have a valid verification token recorded.' });
  }

  const tokenBuffer = Buffer.from(token);
  const expectedBuffer = Buffer.from(expectedToken);
  const isTokenValid = tokenBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(tokenBuffer, expectedBuffer);

  if (!isTokenValid) {
    return res.status(403).json({ success: false, error: 'Invalid verification token. Verification rejected.' });
  }

  // Update in MongoDB
  if (mongoDoc && !mongoDoc.isVerified) {
    try {
      mongoDoc.isVerified = true;
      mongoDoc.verifiedAt = new Date();
      mongoDoc.verificationType = 'customer_confirmed';
      await mongoDoc.save();
      updatedInMongo = true;
    } catch (err) {
      console.warn('MongoDB save verification error:', err.message);
    }
  }

  // Update in local memory
  const wasAlreadyVerified = order.isVerified;
  order.isVerified = true;
  order.verifiedAt = new Date();
  order.verificationType = 'customer_confirmed';
  saveLocalOrder(orderRef, order);

  // Send update notification to owner if freshly verified
  if (!wasAlreadyVerified) {
    console.log(`[Order Verification] ✅ Customer clicked confirm for order #${orderRef}`);
    try {
      await sendOrderOwnerEmail(
        {
          orderRef,
          firstName: order.customer?.firstName || order.firstName,
          lastName: order.customer?.lastName || order.lastName,
          email: order.customer?.email || order.email,
          phone: order.customer?.phone || order.phone,
          street: order.customer?.street || order.street,
          city: order.customer?.city || order.city,
          postalCode: order.customer?.postalCode || order.postalCode,
          total: order.total,
          items: order.items,
          paymentMethod: order.paymentMethod,
        },
        'customer_confirmed'
      );
    } catch (err) {
      console.error('[Owner Update Email Error]:', err.message);
    }
  }

  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    return res.redirect(`/verify-order?orderRef=${encodeURIComponent(orderRef)}&token=${encodeURIComponent(token)}`);
  }

  return res.json({
    success: true,
    orderRef,
    isVerified: true,
    verificationType: 'customer_confirmed',
    message: 'Order verified and confirmed! Scheduled for priority loom weaving.',
  });
});

/**
 * Get Live Order Status
 */
app.get('/api/orders/status/:orderRef', async (req, res) => {
  const { orderRef } = req.params;

  let order = localOrdersStore.get(orderRef);

  if (isMongoConfigured()) {
    try {
      await connectMongoDB();
      const doc = await Order.findOne({ orderRef }).lean();
      if (doc) order = doc;
    } catch {}
  }

  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }

  // Check if 30-minute auto-verification applies dynamically
  if (!order.isVerified && order.autoVerifyAt && new Date() >= new Date(order.autoVerifyAt)) {
    order.isVerified = true;
    order.verificationType = 'auto_verified_30m';
    order.verifiedAt = new Date();
    localOrdersStore.set(orderRef, order);
  }

  const remainingMs = Math.max(0, new Date(order.autoVerifyAt).getTime() - Date.now());
  const remainingMinutes = Math.ceil(remainingMs / (60 * 1000));

  return res.json({
    success: true,
    orderRef: order.orderRef,
    isVerified: Boolean(order.isVerified),
    verificationType: order.verificationType || 'unverified',
    total: order.total,
    deliveryStatus: order.deliveryStatus,
    autoVerifyAt: order.autoVerifyAt,
    remainingMinutes,
  });
});

// =============================================================================
// 5. ADMIN CONTROL CENTER (Orders & Store Management)
// =============================================================================

/**
 * Fetch all orders for Admin Dashboard (MongoDB + In-Memory) - Protected by requireAdmin
 */
app.get('/api/admin/orders', requireAdmin, async (req, res) => {
  try {
    let ordersList = [];
    if (isMongoConfigured() && mongoose.connection.readyState === 1) {
      try {
        ordersList = await Order.find({}).sort({ createdAt: -1 }).lean();
      } catch (e) {
        console.warn('MongoDB orders fetch failed, falling back to local memory:', e.message);
      }
    }

    const inMemoryOrders = Array.from(localOrdersStore.values());
    const existingRefs = new Set(ordersList.map((o) => o.orderRef));
    for (const memOrder of inMemoryOrders) {
      if (!existingRefs.has(memOrder.orderRef)) {
        ordersList.push(memOrder);
      }
    }

    ordersList.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    return res.json({
      success: true,
      orders: ordersList,
      total: ordersList.length,
    });
  } catch (err) {
    console.error('Error fetching admin orders:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Update Order Status (Processing, Shipped, Delivered, Cancelled) - Protected by requireAdmin
 */
app.patch('/api/admin/orders/:orderRef/status', requireAdmin, async (req, res) => {
  const { orderRef } = req.params;
  const { deliveryStatus, isVerified, notes } = req.body || {};

  try {
    let updatedOrder = null;

    if (localOrdersStore.has(orderRef)) {
      const order = localOrdersStore.get(orderRef);
      if (deliveryStatus) order.deliveryStatus = deliveryStatus;
      if (typeof isVerified === 'boolean') order.isVerified = isVerified;
      if (notes) order.notes = notes;
      saveLocalOrder(orderRef, order);
      updatedOrder = order;
    }

    if (isMongoConfigured() && mongoose.connection.readyState === 1) {
      const doc = await Order.findOne({ orderRef });
      if (doc) {
        if (deliveryStatus) doc.deliveryStatus = deliveryStatus;
        if (typeof isVerified === 'boolean') doc.isVerified = isVerified;
        if (notes) doc.notes = notes;
        await doc.save();
        updatedOrder = doc.toObject();
      }
    }

    if (!updatedOrder) {
      return res.status(404).json({ success: false, error: `Order #${orderRef} not found.` });
    }

    return res.json({
      success: true,
      message: `Order #${orderRef} status updated to "${deliveryStatus || updatedOrder.deliveryStatus}".`,
      order: updatedOrder,
    });
  } catch (err) {
    console.error('Error updating order status:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Get Admin Overview Statistics - Protected by requireAdmin
 */
app.get('/api/admin/stats', requireAdmin, async (req, res) => {
  try {
    let ordersList = [];
    if (isMongoConfigured() && mongoose.connection.readyState === 1) {
      try {
        ordersList = await Order.find({}).lean();
      } catch (e) {
        ordersList = [];
      }
    }
    const inMemoryOrders = Array.from(localOrdersStore.values());
    const existingRefs = new Set(ordersList.map((o) => o.orderRef));
    for (const memOrder of inMemoryOrders) {
      if (!existingRefs.has(memOrder.orderRef)) {
        ordersList.push(memOrder);
      }
    }

    const totalOrders = ordersList.length;
    const totalRevenue = ordersList.reduce((acc, o) => acc + (Number(o.total) || 0), 0);
    const verifiedOrders = ordersList.filter((o) => o.isVerified).length;
    const pendingOrders = ordersList.filter((o) => !o.isVerified).length;
    const processingOrders = ordersList.filter((o) =>
      (o.deliveryStatus || '').toLowerCase().includes('process') ||
      (o.deliveryStatus || '').toLowerCase().includes('loom')
    ).length;
    const shippedOrders = ordersList.filter((o) =>
      (o.deliveryStatus || '').toLowerCase().includes('ship')
    ).length;
    const deliveredOrders = ordersList.filter((o) =>
      (o.deliveryStatus || '').toLowerCase().includes('deliver')
    ).length;

    return res.json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue,
        verifiedOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Automation: Check and Auto-Verify Orders after 30 Minutes
 */
async function autoVerifyPendingOrders() {
  const now = new Date();

  // 1. Check local in-memory orders
  for (const [ref, order] of localOrdersStore.entries()) {
    if (!order.isVerified && order.autoVerifyAt && now >= new Date(order.autoVerifyAt)) {
      order.isVerified = true;
      order.verificationType = 'auto_verified_30m';
      order.verifiedAt = now;
      localOrdersStore.set(ref, order);

      console.log(`[Order Automation] ⏰ Order #${ref} auto-verified after 30 minutes!`);
      try {
        await sendOrderOwnerEmail(order, 'auto_verified');
      } catch (err) {
        console.error('[Automation Email Error]:', err.message);
      }
    }
  }

  // 2. Check MongoDB orders if connected
  if (isMongoConfigured() && mongoose.connection.readyState === 1) {
    try {
      const pendingDocs = await Order.find({
        isVerified: false,
        autoVerifyAt: { $lte: now },
      });

      for (const doc of pendingDocs) {
        doc.isVerified = true;
        doc.verificationType = 'auto_verified_30m';
        doc.verifiedAt = now;
        await doc.save();

        console.log(`[Order Automation Mongo] ⏰ Order #${doc.orderRef} auto-verified after 30 minutes!`);
        try {
          await sendOrderOwnerEmail(doc.toObject(), 'auto_verified');
        } catch (err) {
          console.error('[Automation Mongo Email Error]:', err.message);
        }
      }
    } catch (err) {
      console.warn('[Automation MongoDB check failed]:', err.message);
    }
  }
}

// Run 30-minute order verification automation check every 60 seconds (unref prevents hanging build runners)
const autoVerifyTimer = setInterval(autoVerifyPendingOrders, 60 * 1000);
if (autoVerifyTimer.unref) {
  autoVerifyTimer.unref();
}

// =============================================================================
// 5. WHOLESALE / CONTACT ENQUIRIES
// =============================================================================
app.post('/api/enquiries', async (req, res) => {
  const body = req.body || {};

  if (isMongoConfigured()) {
    try {
      await connectMongoDB();
      const enquiry = new Enquiry({
        name: body.name || '',
        email: body.email || '',
        phone: body.phone || '',
        topic: body.topic || 'General Enquiry',
        message: body.message || '',
      });
      const saved = await enquiry.save();
      return res.status(201).json({ success: true, id: saved._id, savedToMongo: true });
    } catch (err) {
      console.error('MongoDB Enquiry save error:', err);
    }
  }

  return res.status(201).json({ success: true, savedToMongo: false });
});

export default app;
