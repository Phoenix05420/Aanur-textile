import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { app } from './app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const publicDir = path.join(rootDir, 'public');

const PORT = process.env.PORT || 5000;

// Serve public static assets (images, products, fonts)
app.use(express.static(publicDir));

// Serve production built assets from dist if available
app.use(express.static(distDir));

// SPA fallback for non-API client routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }
  const indexPath = path.join(distDir, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send('Aanur Textile API Server running. Start Vite dev server for frontend development (npm run dev).');
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('\n============================================');
  console.log('🚀 Aanur Textile MERN Express Server Running');
  console.log('============================================');
  console.log(`• Express API:   http://localhost:${PORT}/api/status`);
  console.log(`• Products API:  http://localhost:${PORT}/api/products`);
  console.log(`• Port:          ${PORT}`);
  console.log('============================================\n');
});
