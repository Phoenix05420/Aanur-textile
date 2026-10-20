import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;

let cachedPromise = null;

export function isMongoConfigured() {
  return Boolean(
    uri &&
    uri.trim().startsWith('mongodb') &&
    !uri.includes('<') &&
    !uri.includes('>')
  );
}

export async function connectMongoDB() {
  if (!isMongoConfigured()) {
    console.warn('⚠️ MONGODB_URI not configured or contains placeholder brackets.');
    return null;
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (cachedPromise) {
    return cachedPromise;
  }

  cachedPromise = mongoose.connect(uri, {
    serverSelectionTimeoutMS: 8000,
  }).then((m) => {
    console.log(`✓ Connected to MongoDB Atlas: [db: ${m.connection.name}, host: ${m.connection.host}]`);
    return m.connection;
  }).catch((err) => {
    cachedPromise = null;
    console.error('✗ MongoDB connection error:', err.message);
    throw err;
  });

  return cachedPromise;
}

export default connectMongoDB;
