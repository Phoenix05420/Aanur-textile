import express from 'express';
import { productRepository } from '../repositories/productRepository.js';

export const productsRouter = express.Router();

productsRouter.get('/api/products', async (req, res) => {
  try {
    const result = await productRepository.getAll();
    return res.json(result);
  } catch (err) {
    console.error('Products route error:', err);
    return res.status(500).json({ error: err.message });
  }
});

productsRouter.get('/api/products/:id', async (req, res) => {
  try {
    const result = await productRepository.getById(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.json(result);
  } catch (err) {
    console.error(`Product route error for ${req.params.id}:`, err);
    return res.status(500).json({ error: err.message });
  }
});

export default productsRouter;
