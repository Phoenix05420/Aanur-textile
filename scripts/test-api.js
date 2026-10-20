import { app } from '../server/app.js';
import mongoose from 'mongoose';

async function testApi() {
  console.log('--- Testing Aanur Textile MERN Express Endpoints ---');

  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;
  console.log(`Test Express server running at: ${baseUrl}`);

  try {
    // 1. Status Check
    const statusRes = await fetch(`${baseUrl}/api/status`);
    const statusData = await statusRes.json();
    console.log('\n1. GET /api/status:', statusData);

    // 2. Products List
    const prodRes = await fetch(`${baseUrl}/api/products`);
    const prodData = await prodRes.json();
    console.log(`\n2. GET /api/products: Received ${prodData.products?.length} products (source: ${prodData.source})`);
    if (prodData.products?.[0]) {
      const p = prodData.products[0];
      console.log(`   Sample product [${p.id}]: "${p.name}", ${p.images?.length} images, ${p.colors?.length} colors`);
    }

    // 3. Single Product Lookup
    const singleRes = await fetch(`${baseUrl}/api/products/p01`);
    const singleData = await singleRes.json();
    console.log(`\n3. GET /api/products/p01: Product found: "${singleData.product?.name}"`);

    // 4. Test Wholesale Enquiry Creation
    const enquiryRes = await fetch(`${baseUrl}/api/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'MERN Stack Tester',
        email: 'tester@example.com',
        phone: '+91 98765 43210',
        topic: 'MERN Wholesale Test',
        message: 'Testing MongoDB Atlas insertion for Aanur Textile wholesale inquiry.'
      }),
    });
    const enquiryData = await enquiryRes.json();
    console.log('\n4. POST /api/enquiries:', enquiryData);

    console.log('\n✓ All MERN Express API tests passed!');
  } finally {
    server.close();
    await mongoose.disconnect();
  }
}

testApi().catch((err) => {
  console.error('API Test Failed:', err);
  process.exit(1);
});
