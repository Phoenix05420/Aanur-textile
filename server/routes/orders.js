import express from 'express';
import crypto from 'crypto';
import { orderRepository } from '../repositories/orderRepository.js';
import { productRepository } from '../repositories/productRepository.js';
import { sendOrderCustomerEmail, sendOrderOwnerEmail } from '../email.js';
import { calculateDiscount } from '../../shared/coupons.js';

export const ordersRouter = express.Router();

function resolveSafeBaseUrl(req) {
  const configuredAppUrl = (process.env.APP_URL || process.env.PUBLIC_URL || '').trim().replace(/\/$/, '');
  if (configuredAppUrl) return configuredAppUrl;

  const rawHost = req.get('host') || 'localhost:5173';
  const isValidHost = /^([a-zA-Z0-9-]+\.)*(localhost(:\d+)?|127\.0\.0\.1(:\d+)?|railway\.app|vercel\.app|render\.com|aanurtextile\.com)$/i.test(rawHost);
  const safeHost = isValidHost ? rawHost : 'localhost:5173';
  const proto = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
  return `${proto}://${safeHost}`;
}

/**
 * Create Order with Server-Side Price Verification, Token & 30-Minute Auto-Verify Window
 */
ordersRouter.post('/api/orders', async (req, res) => {
  const body = req.body || {};
  const orderRef = (typeof body.orderRef === 'string' && body.orderRef.trim()) || `AT-${crypto.randomInt(100000, 1000000)}`;
  const verificationToken = crypto.randomBytes(24).toString('hex');
  const autoVerifyAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now

  const rawItems = Array.isArray(body.items) ? body.items : [];
  if (rawItems.length === 0) {
    return res.status(400).json({ success: false, error: 'Order must contain at least one product.' });
  }

  const productIds = rawItems.map((item) => String(item.productId || item.product?.id || item.id || '').trim()).filter(Boolean);
  const dbProducts = await productRepository.findByIds(productIds);

  const formattedItems = [];
  let computedSubtotal = 0;

  for (const item of rawItems) {
    const pid = String(item.productId || item.product?.id || item.id || '').trim();
    const canonical = dbProducts.find((p) => p.id === pid);

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

  const rawCode = typeof body.couponCode === 'string' ? body.couponCode.trim().toUpperCase() : '';
  const computedDiscount = calculateDiscount(computedSubtotal, rawCode);
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

  const { savedToMongo, orderDocId } = await orderRepository.save(orderData);

  const baseUrl = resolveSafeBaseUrl(req);
  const confirmUrl = `${baseUrl}/verify-order?orderRef=${encodeURIComponent(orderRef)}&token=${encodeURIComponent(verificationToken)}`;

  // 1. Send Customer Email
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

  // 2. Send Workshop / Owner Notification
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
ordersRouter.all('/api/orders/verify', async (req, res) => {
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

  const order = await orderRepository.getByRef(orderRef);
  if (!order) {
    return res.status(404).json({ success: false, error: `Order #${orderRef} not found.` });
  }

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

  const wasAlreadyVerified = Boolean(order.isVerified);
  const updatedOrder = await orderRepository.verify(orderRef, 'customer_confirmed');

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
ordersRouter.get('/api/orders/status/:orderRef', async (req, res) => {
  const { orderRef } = req.params;
  const order = await orderRepository.getByRef(orderRef);

  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }

  // Dynamic 30-minute check
  if (!order.isVerified && order.autoVerifyAt && new Date() >= new Date(order.autoVerifyAt)) {
    await orderRepository.verify(orderRef, 'auto_verified_30m');
    order.isVerified = true;
    order.verificationType = 'auto_verified_30m';
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

export default ordersRouter;
