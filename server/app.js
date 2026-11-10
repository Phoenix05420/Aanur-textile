import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectMongoDB, isMongoConfigured } from './db.js';
import { healthRouter } from './routes/health.js';
import { authRouter } from './routes/auth.js';
import { productsRouter } from './routes/products.js';
import { ordersRouter } from './routes/orders.js';
import { adminRouter } from './routes/admin.js';
import { enquiriesRouter } from './routes/enquiries.js';
import { requireAdmin } from './middleware/auth.js';
import { startOrderAutomation } from './services/automation.js';

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

// Domain Routers
app.use(healthRouter);
app.use(authRouter);
app.use(productsRouter);
app.use(ordersRouter);
app.use('/api/admin', requireAdmin, adminRouter);
app.use(enquiriesRouter);

// Start background order auto-verification timer (30-minute window check)
startOrderAutomation();

export default app;
