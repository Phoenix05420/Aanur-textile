import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  size: { type: String },
  colorIndex: { type: Number, default: 0 },
  variantImage: { type: String },
  lineTotal: { type: Number },
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  orderRef: { type: String, required: true, unique: true, index: true },
  customer: {
    firstName: { type: String, required: true },
    lastName: { type: String, default: '' },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
  },
  items: [OrderItemSchema],
  subtotal: { type: Number },
  discount: { type: Number, default: 0 },
  couponCode: { type: String, default: '' },
  total: { type: Number, required: true },
  deliveryStatus: { type: String, default: 'Processing · 7-14 days' },
  paymentMethod: { type: String, default: 'Cash on Delivery (COD)' },
  paymentStatus: { type: String, default: 'Pending' },
  notes: { type: String, default: 'Factory-direct dispatch from Nathakadaiyur, Tamil Nadu' },
}, { timestamps: true });

export const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
export default Order;
