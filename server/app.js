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

// Core Express middleware
app.use(cors());
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
// IN-MEMORY STORES (For instant OTP & local development fallback)
// =============================================================================
const otpStore = new Map(); // email.toLowerCase() -> { otp, expiresAt, name, phone }
const localOrdersStore = new Map(); // orderRef -> orderObject

// =============================================================================
// 1. HEALTH & STATUS CHECK
// =============================================================================
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
 * Send 6-Digit OTP to Gmail / Email
 */
app.post('/api/auth/send-otp', async (req, res) => {
  const { email, name, phone } = req.body || {};

  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, error: 'Please enter a valid Gmail / email address.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  otpStore.set(cleanEmail, {
    otp,
    expiresAt,
    name: name || '',
    phone: phone || '',
  });

  console.log(`[Gmail OTP] 🔑 Verification code generated for ${cleanEmail}: ${otp}`);

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
 * Verify 6-Digit OTP & Authenticate User
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

  if (entry.otp !== cleanOtp) {
    return res.status(400).json({
      success: false,
      error: 'Invalid 6-digit verification code. Please check and try again.',
    });
  }

  // OTP verified successfully
  otpStore.delete(cleanEmail);

  const displayName = name || entry.name || cleanEmail.split('@')[0];
  const user = {
    name: displayName,
    email: cleanEmail,
    phone: phone || entry.phone || '+91 98427 51234',
    city: 'Tiruppur',
    state: 'Tamil Nadu',
    avatarBg: '#b76b52',
  };

  return res.json({
    success: true,
    message: 'Verification successful. Welcome to Aanur Textile!',
    user,
  });
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
 * Create Order with Verification Token & 30-Minute Auto-Verify Window
 */
app.post('/api/orders', async (req, res) => {
  const body = req.body || {};
  const orderRef = body.orderRef || `AT-${Math.floor(100000 + Math.random() * 900000)}`;
  const verificationToken = crypto.randomBytes(16).toString('hex');
  const autoVerifyAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now

  const rawItems = Array.isArray(body.items) ? body.items : [];
  const formattedItems = rawItems.map((item) => ({
    productId: item.productId || item.product?.id || item.id || 'item',
    name: item.name || item.product?.name || 'Handcrafted Bedsheet',
    price: Number(item.price || item.product?.price || 0),
    quantity: Number(item.quantity || 1),
    size: item.size || 'Standard',
    colorIndex: Number(item.colorIndex ?? 0),
    variantImage: item.variantImage || item.product?.image || item.image || '',
    lineTotal: Number((item.price || item.product?.price || 0) * (item.quantity || 1)),
  }));

  const orderData = {
    orderRef,
    customer: {
      firstName: body.firstName || '',
      lastName: body.lastName || '',
      email: (body.email || '').trim().toLowerCase(),
      phone: body.phone || '',
      street: body.street || '',
      city: body.city || '',
      postalCode: body.postalCode || '',
    },
    items: formattedItems,
    subtotal: Number(body.subtotal || body.total || 0),
    discount: Number(body.discount || 0),
    couponCode: body.couponCode || '',
    total: Number(body.total || 0),
    deliveryStatus: 'Processing · 7-14 days',
    paymentMethod: body.paymentMethod || 'Cash on Delivery (COD)',
    paymentStatus: 'Pending',
    isVerified: false,
    verificationToken,
    verificationType: 'unverified',
    autoVerifyAt,
    createdAt: new Date(),
  };

  // Save in local memory registry
  localOrdersStore.set(orderRef, { ...orderData });

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

  // Determine base URL for email confirm button
  const reqHost = req.get('host') || 'localhost:5173';
  const reqProtocol = req.protocol || 'http';
  const baseUrl = req.get('origin') || `${reqProtocol}://${reqHost}`;
  const confirmUrl = `${baseUrl}/verify-order?orderRef=${encodeURIComponent(orderRef)}&token=${encodeURIComponent(verificationToken)}`;

  // 1. Send Customer Email with Confirm Button & 30-min notice
  let customerEmailSent = false;
  try {
    const custRes = await sendOrderCustomerEmail(
      {
        orderRef,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        street: body.street,
        city: body.city,
        postalCode: body.postalCode,
        subtotal: body.subtotal,
        discount: body.discount,
        couponCode: body.couponCode,
        total: body.total,
        items: formattedItems,
        paymentMethod: body.paymentMethod,
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
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        street: body.street,
        city: body.city,
        postalCode: body.postalCode,
        total: body.total,
        items: formattedItems,
        paymentMethod: body.paymentMethod,
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
  });
});

/**
 * Verify Order (User clicks email confirm button)
 */
app.all('/api/orders/verify', async (req, res) => {
  const orderRef = req.query.orderRef || req.body?.orderRef;
  const token = req.query.token || req.body?.token;

  if (!orderRef) {
    return res.status(400).json({ success: false, error: 'orderRef is required.' });
  }

  let order = localOrdersStore.get(orderRef);
  let updatedInMongo = false;

  if (isMongoConfigured()) {
    try {
      await connectMongoDB();
      const doc = await Order.findOne({ orderRef });
      if (doc) {
        order = doc.toObject();
        if (!doc.isVerified) {
          doc.isVerified = true;
          doc.verifiedAt = new Date();
          doc.verificationType = 'customer_confirmed';
          await doc.save();
          updatedInMongo = true;
        }
      }
    } catch (err) {
      console.warn('MongoDB order query error:', err.message);
    }
  }

  if (!order) {
    return res.status(404).json({ success: false, error: `Order #${orderRef} not found.` });
  }

  // Update in local memory
  const wasAlreadyVerified = order.isVerified;
  order.isVerified = true;
  order.verifiedAt = new Date();
  order.verificationType = 'customer_confirmed';
  localOrdersStore.set(orderRef, order);

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
    return res.redirect(`/verify-order?orderRef=${encodeURIComponent(orderRef)}&token=${encodeURIComponent(token || '')}`);
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

// Run 30-minute order verification automation check every 60 seconds
setInterval(autoVerifyPendingOrders, 60 * 1000);

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
