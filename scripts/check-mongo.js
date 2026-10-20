import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectMongoDB } from '../server/db.js';
import { Product } from '../server/models/Product.js';
import { Order } from '../server/models/Order.js';
import { Enquiry } from '../server/models/Enquiry.js';

dotenv.config();

async function checkMongo() {
  console.log('--- MongoDB Diagnostic Check (MERN Stack) ---');
  await connectMongoDB();

  const productCount = await Product.countDocuments();
  const orderCount = await Order.countDocuments();
  const enquiryCount = await Enquiry.countDocuments();

  console.log(`Database: ${mongoose.connection.name}`);
  console.log(`Host:     ${mongoose.connection.host}`);
  console.log(`Products: ${productCount}`);
  console.log(`Orders:   ${orderCount}`);
  console.log(`Enquiries: ${enquiryCount}`);

  if (productCount > 0) {
    const sample = await Product.findOne().lean();
    console.log(`\nSample Product: [${sample.id}] "${sample.name}"`);
    console.log(`  Price: ₹${sample.price}`);
    console.log(`  Variants: ${sample.variants?.length || 0}`);
    console.log(`  Images: ${sample.images?.join(', ')}`);
    console.log(`  Colors: ${sample.colors?.join(', ')}`);
  }

  await mongoose.disconnect();
}

checkMongo().catch((err) => {
  console.error('Check failed:', err);
  process.exit(1);
});
