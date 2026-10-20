import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { products } from '../src/data.js';
import { Product } from '../server/models/Product.js';
import { connectMongoDB } from '../server/db.js';

dotenv.config();

async function seedMongo() {
  console.log('--- Seeding Aanur Textile Catalog into MongoDB Atlas ---');
  await connectMongoDB();

  for (const item of products) {
    const formattedVariants = (item.variants || []).map((v, idx) => ({
      id: `${item.id}-v${idx + 1}`,
      name: v.name,
      color: v.color,
      colorName: v.name,
      image: v.image,
      inStock: true,
    }));

    const updateData = {
      id: item.id,
      name: item.name,
      category: item.category || 'Bedsheets',
      price: item.price,
      originalPrice: item.originalPrice,
      badge: item.badge,
      material: item.material,
      sizes: item.sizes || ['Single', 'Double', 'Queen', 'King'],
      colors: item.colors || [],
      colorNames: item.colorNames || [],
      image: item.image,
      images: item.images || [item.image],
      variants: formattedVariants,
      description: item.description,
      rating: 4.8,
      reviews: 32 + (item.id.charCodeAt(item.id.length - 1) % 25),
      inStock: true,
    };

    await Product.findOneAndUpdate(
      { id: item.id },
      { $set: updateData },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );
    console.log(`✓ Product [${item.id}] ${item.name} seeded with ${item.images.length} images & ${item.colors.length} color variants.`);
  }

  const count = await Product.countDocuments();
  console.log(`\n✓ MongoDB Seeding Complete! Total products in collection: ${count}`);
  await mongoose.disconnect();
}

seedMongo().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
