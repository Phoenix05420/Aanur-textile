import mongoose from 'mongoose';

const VariantSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  color: { type: String, required: true },
  colorName: { type: String, required: true },
  image: { type: String, required: true },
  inStock: { type: Boolean, default: true },
}, { _id: false });

const ProductSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, trim: true },
  category: { type: String, default: 'Bedsheets' },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  badge: { type: String },
  material: { type: String, default: '100% Pure Long-Staple Combed Cotton' },
  sizes: { type: [String], default: ['Single (60" x 90")', 'Double (90" x 100")', 'Queen (90" x 108")', 'King (108" x 108")'] },
  colors: { type: [String], default: [] },
  colorNames: { type: [String], default: [] },
  image: { type: String, required: true },
  images: { type: [String], default: [] },
  variants: [VariantSchema],
  rating: { type: Number, default: 4.8 },
  reviews: { type: Number, default: 48 },
  description: { type: String, default: '' },
  details: { type: [String], default: [] },
  features: { type: [String], default: [] },
  inStock: { type: Boolean, default: true },
}, { timestamps: true });

export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export default Product;
