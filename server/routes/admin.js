import express from 'express';
import { orderRepository } from '../repositories/orderRepository.js';
import { productRepository } from '../repositories/productRepository.js';

export const adminRouter = express.Router();

/**
 * Fetch all orders for Admin Dashboard (GET /api/admin/orders)
 */
adminRouter.get('/orders', async (req, res) => {
  try {
    const ordersList = await orderRepository.getAll();
    return res.json({
      success: true,
      orders: ordersList,
      total: ordersList.length,
    });
  } catch (err) {
    console.error('Error fetching admin orders:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Update Order Status (PATCH /api/admin/orders/:orderRef/status)
 */
adminRouter.patch('/orders/:orderRef/status', async (req, res) => {
  const { orderRef } = req.params;
  const { deliveryStatus, isVerified, notes } = req.body || {};

  try {
    const updatedOrder = await orderRepository.updateStatus(orderRef, { deliveryStatus, isVerified, notes });
    if (!updatedOrder) {
      return res.status(404).json({ success: false, error: `Order #${orderRef} not found.` });
    }

    return res.json({
      success: true,
      message: `Order #${orderRef} status updated to "${deliveryStatus || updatedOrder.deliveryStatus}".`,
      order: updatedOrder,
    });
  } catch (err) {
    console.error('Error updating order status:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Get Admin Overview Statistics (GET /api/admin/stats)
 */
adminRouter.get('/stats', async (req, res) => {
  try {
    const stats = await orderRepository.getStats();
    return res.json({
      success: true,
      stats,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Update Product Details in Catalog (PATCH /api/admin/products/:id)
 */
adminRouter.patch('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { price, originalPrice, badge, inStock, name, description } = req.body || {};

  try {
    const updateData = {};
    if (price !== undefined && !Number.isNaN(Number(price))) updateData.price = Number(price);
    if (originalPrice !== undefined) updateData.originalPrice = originalPrice ? Number(originalPrice) : null;
    if (badge !== undefined) updateData.badge = String(badge).trim();
    if (typeof inStock === 'boolean') updateData.inStock = inStock;
    if (name) updateData.name = String(name).trim();
    if (description !== undefined) updateData.description = String(description).trim();

    const updatedProduct = await productRepository.update(id, updateData);
    if (!updatedProduct) {
      return res.status(404).json({ success: false, error: `Product with ID "${id}" not found.` });
    }

    return res.json({
      success: true,
      message: `Product "${updatedProduct.name || id}" successfully updated in catalog.`,
      product: updatedProduct,
    });
  } catch (err) {
    console.error('Error updating product:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Create New Product in Catalog (POST /api/admin/products)
 */
adminRouter.post('/products', async (req, res) => {
  const { name, price, originalPrice, category, badge, image, material, sizes, description } = req.body || {};

  if (!name || price === undefined || Number.isNaN(Number(price))) {
    return res.status(400).json({ success: false, error: 'Product name and valid price are required.' });
  }

  const generatedId = `p${Date.now().toString().slice(-6)}`;
  const newProduct = {
    id: generatedId,
    name: String(name).trim(),
    price: Number(price),
    originalPrice: originalPrice ? Number(originalPrice) : null,
    category: category ? String(category).trim() : 'Bedsheets',
    badge: badge ? String(badge).trim() : 'Artisan Weave',
    image: image ? String(image).trim() : '/products/p01/variant-1.jpeg',
    images: [image ? String(image).trim() : '/products/p01/variant-1.jpeg'],
    material: material ? String(material).trim() : '100% Pure Long-Staple Combed Cotton',
    sizes: Array.isArray(sizes) && sizes.length > 0 ? sizes : ['Single (60" x 90")', 'Double (90" x 100")', 'Queen (90" x 108")', 'King (108" x 108")'],
    colors: ['#233240', '#4a3b32', '#782323', '#2d3b2d'],
    colorNames: ['Indigo Night', 'Bark Earth', 'Madder Rust', 'Olive Fern'],
    description: description ? String(description).trim() : 'Handcrafted pure cotton bedsheet woven on traditional looms in Nathakadaiyur, Tamil Nadu.',
    inStock: true,
  };

  try {
    const created = await productRepository.create(newProduct);
    return res.status(201).json({
      success: true,
      message: `Product "${created.name}" created successfully.`,
      product: created,
    });
  } catch (err) {
    console.error('Error creating product:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default adminRouter;
