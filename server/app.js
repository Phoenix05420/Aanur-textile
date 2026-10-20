import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectMongoDB, isMongoConfigured } from './db.js';
import { Product } from './models/Product.js';
import { Order } from './models/Order.js';
import { Enquiry } from './models/Enquiry.js';
import { products as fallbackProducts } from '../src/data.js';
import { sendOrderEmail, isResendConfigured } from './email.js';

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

// 1. Health & status check
app.get('/api/status', async (req, res) => {
  const configured = isMongoConfigured();
  if (!configured) {
    return res.json({
      configured: false,
      stack: 'MERN',
      message: 'MONGODB_URI not configured in .env. Using local catalog fallback.',
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

// 2. Products Catalog (MongoDB -> Express -> React)
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

// 3. Create Order (Store in MongoDB + Send Resend confirmation email)
app.post('/api/orders', async (req, res) => {
  const body = req.body || {};
  const orderRef = body.orderRef || `AT-${Math.floor(100000 + Math.random() * 900000)}`;

  let savedToMongo = false;
  let orderDocId = null;

  if (isMongoConfigured()) {
    try {
      await connectMongoDB();
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

      const newOrder = new Order({
        orderRef,
        customer: {
          firstName: body.firstName || '',
          lastName: body.lastName || '',
          email: body.email || '',
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
      });

      const saved = await newOrder.save();
      savedToMongo = true;
      orderDocId = saved._id;
    } catch (err) {
      console.error('MongoDB Order save error:', err);
    }
  }

  // Send order detail confirmation email (Customer + Admin Gmail)
  const emailResult = await sendOrderEmail({
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
    items: body.items,
    paymentMethod: body.paymentMethod || 'Cash on Delivery',
  });

  return res.status(201).json({
    success: true,
    orderRef,
    id: orderDocId,
    savedToMongo,
    deliveryTime: '7 to 14 days',
    emailSent: Boolean(emailResult?.success),
  });
});

// 4. Create Wholesale / Contact Enquiry
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
