import { sendOrderEmail, isResendConfigured } from '../server/email.js';
import dotenv from 'dotenv';

dotenv.config();

console.log('\n📧 Testing Resend Email Service for Aanur Textile...\n');

if (!isResendConfigured()) {
  console.log('⚠️  RESEND_API_KEY is not configured in .env');
  console.log('Please get your free API key at https://resend.com/api-keys');
  console.log('Then add to .env:');
  console.log('RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx\n');
  process.exit(1);
}

const sampleOrder = {
  orderRef: `AT-${Math.floor(100000 + Math.random() * 900000)}`,
  firstName: 'Aanur',
  lastName: 'Customer',
  email: process.env.STORE_ADMIN_EMAIL || 'customer@example.com',
  phone: '+91 4257 245000',
  street: '1/367 Merkuthottam, Palayakottai',
  city: 'Nathakadaiyur',
  postalCode: '638108',
  total: 1248,
  paymentMethod: 'Cash on Delivery',
  items: [
    { name: 'Geometric Check Bedsheet', size: 'Queen', quantity: 1, price: 599 },
    { name: 'Red Check Bedsheet', size: 'King', quantity: 1, price: 649 },
  ],
};

async function run() {
  const result = await sendOrderEmail(sampleOrder);
  if (result.success) {
    console.log('\n🎉 Test email sent successfully to your Gmail!');
    console.log(`• Order Reference: #${sampleOrder.orderRef}`);
    console.log(`• Email ID:        ${result.id}`);
    console.log(`• Delivery Window: 7 to 14 days\n`);
  } else {
    console.log('\n❌ Failed to send email:', result.error || result.reason);
  }
}

run();
