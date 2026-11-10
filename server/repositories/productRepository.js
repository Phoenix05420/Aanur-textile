import mongoose from 'mongoose';
import { connectMongoDB, isMongoConfigured } from '../db.js';
import { Product } from '../models/Product.js';
import { products as fallbackProducts } from '../../shared/catalog.js';

function mapProductDoc(doc) {
  if (!doc) return null;
  return {
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
    inStock: doc.inStock !== false,
  };
}

export const productRepository = {
  async getAll() {
    if (!isMongoConfigured()) {
      return { products: fallbackProducts, source: 'local' };
    }

    try {
      await connectMongoDB();
      const docs = await Product.find().sort({ id: 1 }).lean();
      if (docs && docs.length > 0) {
        return { products: docs.map(mapProductDoc), source: 'mongodb' };
      }
      return { products: fallbackProducts, source: 'local' };
    } catch (err) {
      console.error('MongoDB products fetch error:', err.message);
      return { products: fallbackProducts, source: 'local' };
    }
  },

  async getById(id) {
    if (!isMongoConfigured()) {
      const found = fallbackProducts.find((p) => p.id === id);
      return found ? { product: found, source: 'local' } : null;
    }

    try {
      await connectMongoDB();
      const doc = await Product.findOne({ id }).lean();
      if (doc) {
        return { product: mapProductDoc(doc), source: 'mongodb' };
      }
      const fallback = fallbackProducts.find((p) => p.id === id);
      return fallback ? { product: fallback, source: 'local' } : null;
    } catch (err) {
      console.error(`MongoDB product lookup failed for ${id}:`, err.message);
      const fallback = fallbackProducts.find((p) => p.id === id);
      return fallback ? { product: fallback, source: 'local' } : null;
    }
  },

  async findByIds(ids) {
    const cleanIds = Array.isArray(ids) ? ids.map(String).map((s) => s.trim()).filter(Boolean) : [];
    let dbProducts = [];

    if (isMongoConfigured() && mongoose.connection.readyState === 1) {
      try {
        dbProducts = await Product.find({ id: { $in: cleanIds } }).lean();
      } catch (err) {
        console.warn('MongoDB products lookup failed, falling back to local catalog:', err.message);
      }
    }

    return cleanIds.map((id) => {
      const canonical = dbProducts.find((p) => p.id === id) || fallbackProducts.find((p) => p.id === id);
      return canonical ? mapProductDoc(canonical) : null;
    }).filter(Boolean);
  },

  async update(id, updateData) {
    let updatedProduct = null;

    if (isMongoConfigured() && mongoose.connection.readyState === 1) {
      await connectMongoDB();
      const doc = await Product.findOneAndUpdate(
        { id },
        { $set: updateData },
        { new: true }
      ).lean();
      if (doc) {
        updatedProduct = mapProductDoc(doc);
      }
    }

    const fallbackIndex = fallbackProducts.findIndex((p) => p.id === id);
    if (fallbackIndex !== -1) {
      Object.assign(fallbackProducts[fallbackIndex], updateData);
      if (!updatedProduct) {
        updatedProduct = fallbackProducts[fallbackIndex];
      }
    }

    return updatedProduct;
  },

  async create(newProduct) {
    if (isMongoConfigured()) {
      await connectMongoDB();
      const doc = new Product(newProduct);
      await doc.save();
    }
    fallbackProducts.push(newProduct);
    return newProduct;
  },
};

export default productRepository;
