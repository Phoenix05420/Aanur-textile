import express from 'express';
import mongoose from 'mongoose';
import { isMongoConfigured, connectMongoDB } from '../db.js';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';
import { Enquiry } from '../models/Enquiry.js';
import { isResendConfigured, isGmailConfigured } from '../email.js';

export const healthRouter = express.Router();

healthRouter.get('/health', (req, res) => {
  return res.status(200).json({ status: 'ok', uptime: process.uptime(), timestamp: new Date() });
});

healthRouter.get('/api/health', (req, res) => {
  return res.status(200).json({ status: 'ok', uptime: process.uptime(), timestamp: new Date() });
});

healthRouter.get('/api/status', async (req, res) => {
  const configured = isMongoConfigured();
  if (!configured) {
    return res.json({
      configured: false,
      stack: 'MERN',
      message: 'MONGODB_URI not configured in .env. Using local catalog fallback.',
      resendConfigured: isResendConfigured(),
      gmailConfigured: isGmailConfigured(),
      emailProvider: isGmailConfigured() ? 'gmail' : (isResendConfigured() ? 'resend' : 'none'),
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
      gmailConfigured: isGmailConfigured(),
      emailProvider: isGmailConfigured() ? 'gmail' : (isResendConfigured() ? 'resend' : 'none'),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message, configured: false, stack: 'MERN' });
  }
});

export default healthRouter;
