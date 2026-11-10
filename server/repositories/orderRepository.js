import mongoose from 'mongoose';
import { connectMongoDB, isMongoConfigured } from '../db.js';
import { Order } from '../models/Order.js';

const localOrdersStore = new Map(); // orderRef -> orderObject (capped at 500)

function saveLocalOrder(ref, data) {
  if (localOrdersStore.size >= 500) {
    const oldest = localOrdersStore.keys().next().value;
    if (oldest) localOrdersStore.delete(oldest);
  }
  localOrdersStore.set(ref, data);
}

export const orderRepository = {
  async save(orderData) {
    saveLocalOrder(orderData.orderRef, { ...orderData });

    let savedToMongo = false;
    let orderDocId = null;

    if (isMongoConfigured()) {
      try {
        await connectMongoDB();
        const newOrder = new Order({ ...orderData });
        const saved = await newOrder.save();
        savedToMongo = true;
        orderDocId = saved._id;
      } catch (err) {
        console.error('MongoDB Order save error:', err.message);
      }
    }

    return { savedToMongo, orderDocId };
  },

  async getByRef(orderRef) {
    let order = localOrdersStore.get(orderRef) || null;

    if (isMongoConfigured()) {
      try {
        await connectMongoDB();
        const doc = await Order.findOne({ orderRef });
        if (doc) {
          order = doc.toObject();
        }
      } catch (err) {
        console.warn('MongoDB order query error:', err.message);
      }
    }

    return order;
  },

  async getAll() {
    let ordersList = [];
    if (isMongoConfigured() && mongoose.connection.readyState === 1) {
      try {
        await connectMongoDB();
        ordersList = await Order.find({}).sort({ createdAt: -1 }).lean();
      } catch (e) {
        console.warn('MongoDB orders fetch failed, falling back to local memory:', e.message);
      }
    }

    const inMemoryOrders = Array.from(localOrdersStore.values());
    const existingRefs = new Set(ordersList.map((o) => o.orderRef));
    for (const memOrder of inMemoryOrders) {
      if (!existingRefs.has(memOrder.orderRef)) {
        ordersList.push(memOrder);
      }
    }

    ordersList.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return ordersList;
  },

  async updateStatus(orderRef, { deliveryStatus, isVerified, notes }) {
    let updatedOrder = null;

    if (localOrdersStore.has(orderRef)) {
      const order = localOrdersStore.get(orderRef);
      if (deliveryStatus) order.deliveryStatus = deliveryStatus;
      if (typeof isVerified === 'boolean') order.isVerified = isVerified;
      if (notes) order.notes = notes;
      saveLocalOrder(orderRef, order);
      updatedOrder = order;
    }

    if (isMongoConfigured() && mongoose.connection.readyState === 1) {
      try {
        await connectMongoDB();
        const doc = await Order.findOne({ orderRef });
        if (doc) {
          if (deliveryStatus) doc.deliveryStatus = deliveryStatus;
          if (typeof isVerified === 'boolean') doc.isVerified = isVerified;
          if (notes) doc.notes = notes;
          await doc.save();
          updatedOrder = doc.toObject();
        }
      } catch (err) {
        console.error('MongoDB update status error:', err.message);
      }
    }

    return updatedOrder;
  },

  async verify(orderRef, verificationType = 'customer_confirmed') {
    let order = localOrdersStore.get(orderRef);
    const now = new Date();

    if (order) {
      order.isVerified = true;
      order.verifiedAt = now;
      order.verificationType = verificationType;
      saveLocalOrder(orderRef, order);
    }

    if (isMongoConfigured()) {
      try {
        await connectMongoDB();
        const doc = await Order.findOne({ orderRef });
        if (doc) {
          doc.isVerified = true;
          doc.verifiedAt = now;
          doc.verificationType = verificationType;
          await doc.save();
          order = doc.toObject();
        }
      } catch (err) {
        console.warn('MongoDB verify save error:', err.message);
      }
    }

    return order;
  },

  async getPendingAutoVerify(now = new Date()) {
    const pendingOrders = [];

    // Local in-memory
    for (const [ref, order] of localOrdersStore.entries()) {
      if (!order.isVerified && order.autoVerifyAt && now >= new Date(order.autoVerifyAt)) {
        pendingOrders.push({ order, source: 'memory', ref });
      }
    }

    // MongoDB
    if (isMongoConfigured() && mongoose.connection.readyState === 1) {
      try {
        const docs = await Order.find({
          isVerified: false,
          autoVerifyAt: { $lte: now },
        });
        for (const doc of docs) {
          if (!pendingOrders.some((p) => p.ref === doc.orderRef)) {
            pendingOrders.push({ order: doc.toObject(), source: 'mongo', doc, ref: doc.orderRef });
          }
        }
      } catch (err) {
        console.warn('[Automation MongoDB check failed]:', err.message);
      }
    }

    return pendingOrders;
  },

  async getStats() {
    const ordersList = await this.getAll();
    const totalOrders = ordersList.length;
    const totalRevenue = ordersList.reduce((acc, o) => acc + (Number(o.total) || 0), 0);
    const verifiedOrders = ordersList.filter((o) => o.isVerified).length;
    const pendingOrders = ordersList.filter((o) => !o.isVerified).length;
    const processingOrders = ordersList.filter((o) =>
      (o.deliveryStatus || '').toLowerCase().includes('process') ||
      (o.deliveryStatus || '').toLowerCase().includes('loom')
    ).length;
    const shippedOrders = ordersList.filter((o) =>
      (o.deliveryStatus || '').toLowerCase().includes('ship')
    ).length;
    const deliveredOrders = ordersList.filter((o) =>
      (o.deliveryStatus || '').toLowerCase().includes('deliver')
    ).length;

    return {
      totalOrders,
      totalRevenue,
      verifiedOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
    };
  },
};

export default orderRepository;
