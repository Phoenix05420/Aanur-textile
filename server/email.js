import { Resend } from 'resend';
import dotenv from 'dotenv';
import { store } from '../src/data.js';

dotenv.config();

const apiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL || 'Aanur Textile <onboarding@resend.dev>';
const adminEmail = process.env.STORE_ADMIN_EMAIL || store.email || 'prvsamy@gmail.com';

export function isResendConfigured() {
  return Boolean(
    apiKey &&
    apiKey.trim().startsWith('re_') &&
    !apiKey.includes('YOUR_API_KEY')
  );
}

export async function sendOrderEmail(order) {
  if (!isResendConfigured()) {
    console.log('\n[Resend] ⚠️ RESEND_API_KEY is not configured in .env.');
    console.log('[Resend] To enable automatic Gmail notifications, add RESEND_API_KEY=re_xxx in .env\n');
    return { success: false, reason: 'RESEND_API_KEY not configured' };
  }

  const resend = new Resend(apiKey);

  const itemsHtml = (order.items || []).map((item) => `
    <tr style="border-bottom: 1px solid #eaeaea;">
      <td style="padding: 12px 8px; font-weight: 500; color: #222;">
        ${item.name}
        <div style="font-size: 12px; color: #777;">Size: ${item.size || 'Standard'} · Qty: ${item.quantity}</div>
      </td>
      <td style="padding: 12px 8px; text-align: center; color: #555;">${item.quantity}</td>
      <td style="padding: 12px 8px; text-align: right; font-weight: 600; color: #222;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation #${order.orderRef}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f5ef; margin: 0; padding: 24px; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
        
        <!-- Header -->
        <div style="background-color: #1a1a1a; padding: 32px 24px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 26px; font-weight: 600; letter-spacing: 0.5px;">Aanur Textile</h1>
          <p style="margin: 6px 0 0; font-size: 13px; color: #ccc; letter-spacing: 1px; text-transform: uppercase;">Comfort, Considered · Nathakadaiyur</p>
        </div>

        <!-- Body -->
        <div style="padding: 32px 28px;">
          <h2 style="margin: 0 0 12px; font-size: 22px; color: #1a1a1a;">Thank you for your order!</h2>
          <p style="margin: 0 0 20px; font-size: 15px; color: #555; line-height: 1.5;">
            We've received your order and are preparing your bedsheets for dispatch from our factory in Nathakadaiyur, Tamil Nadu.
          </p>

          <!-- Delivery Highlight Card -->
          <div style="background-color: #f4f6f1; border-left: 4px solid #4a6741; padding: 16px; border-radius: 6px; margin-bottom: 24px;">
            <div style="font-weight: 700; font-size: 15px; color: #2c4226;">Estimated Doorstep Delivery: 7 to 14 days</div>
            <div style="font-size: 13px; color: #555; margin-top: 4px;">Free factory-direct delivery across India. Carefully inspected before dispatch.</div>
          </div>

          <!-- Order Summary Details -->
          <div style="background-color: #fafafa; border: 1px solid #eaeaea; border-radius: 8px; padding: 18px; margin-bottom: 24px;">
            <div style="font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Order Details</div>
            <div style="font-size: 16px; font-weight: 600; color: #111; margin-bottom: 12px;">Reference: #${order.orderRef}</div>
            
            <div style="font-size: 14px; color: #444; line-height: 1.6;">
              <strong>Customer:</strong> ${order.firstName} ${order.lastName}<br>
              <strong>Email:</strong> ${order.email}<br>
              <strong>Phone:</strong> ${order.phone}<br>
              <strong>Shipping Address:</strong> ${order.street}, ${order.city} - ${order.postalCode}<br>
              <strong>Payment:</strong> ${order.paymentMethod || 'Cash on Delivery'}
            </div>
          </div>

          <!-- Items Table -->
          <h3 style="margin: 0 0 12px; font-size: 16px; color: #222;">Items Ordered</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="border-bottom: 2px solid #eaeaea; text-align: left; font-size: 12px; color: #888; text-transform: uppercase;">
                <th style="padding: 8px;">Product</th>
                <th style="padding: 8px; text-align: center;">Qty</th>
                <th style="padding: 8px; text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              ${order.discount ? `
              <tr>
                <td colspan="2" style="padding: 8px; text-align: right; color: #666;">Subtotal:</td>
                <td style="padding: 8px; text-align: right; color: #333; font-weight: 600;">₹${Number(order.subtotal || (Number(order.total) + Number(order.discount))).toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td colspan="2" style="padding: 8px; text-align: right; color: #b76b52; font-weight: 600;">Secret Coupon (${order.couponCode || 'BESTOFFER'}):</td>
                <td style="padding: 8px; text-align: right; color: #b76b52; font-weight: 600;">-₹${Number(order.discount).toLocaleString('en-IN')}</td>
              </tr>
              ` : ''}
              <tr>
                <td colspan="2" style="padding: 12px 8px; text-align: right; font-weight: 600; color: #555;">Delivery:</td>
                <td style="padding: 12px 8px; text-align: right; color: #2c4226; font-weight: 600;">Free (7-14 days)</td>
              </tr>
              <tr style="border-top: 2px solid #222;">
                <td colspan="2" style="padding: 12px 8px; text-align: right; font-size: 16px; font-weight: 700; color: #111;">Total:</td>
                <td style="padding: 12px 8px; text-align: right; font-size: 18px; font-weight: 700; color: #111;">₹${Number(order.total || 0).toLocaleString('en-IN')}</td>
              </tr>
            </tfoot>
          </table>

          <!-- Support Notice -->
          <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #eaeaea; font-size: 13px; color: #666; line-height: 1.6;">
            <strong>Need help with your order?</strong><br>
            Call us directly at <a href="${store.phone}" style="color: #111; font-weight: 600; text-decoration: none;">${store.phoneDisplay}</a> or reply to <a href="mailto:${store.email}" style="color: #111; font-weight: 600; text-decoration: none;">${store.email}</a>.<br>
            Aanur Textile · ${store.address}
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f7f5ef; padding: 16px; text-align: center; font-size: 12px; color: #999;">
          © 2026 Aanur Textile, Nathakadaiyur · Doorstep delivery in 7 to 14 days
        </div>
      </div>
    </body>
    </html>
  `;

  // Recipients: send to customer email if provided, and always notify admin email
  const recipients = [];
  if (order.email && order.email.includes('@')) {
    recipients.push(order.email);
  }
  if (adminEmail && !recipients.includes(adminEmail)) {
    recipients.push(adminEmail);
  }

  try {
    console.log(`\n[Resend] 📨 Sending order confirmation email for #${order.orderRef} to:`, recipients.join(', '));
    const result = await resend.emails.send({
      from: fromEmail,
      to: recipients,
      subject: `Order Confirmation #${order.orderRef} — Aanur Textile (Delivery in 7-14 days)`,
      html: htmlContent,
    });

    if (result.error) {
      console.warn('[Resend Warning]:', result.error.message);
      // If testing sandbox restriction (send only to verified account email)
      const match = result.error.message?.match(/\(([^)]+@[^)]+)\)/);
      const targetEmail = match ? match[1] : adminEmail;

      if (targetEmail) {
        console.log(`[Resend] ℹ️ Delivering order confirmation to your registered Gmail (${targetEmail})...`);
        const fallback = await resend.emails.send({
          from: fromEmail,
          to: [targetEmail],
          subject: `Order Confirmation #${order.orderRef} — Aanur Textile (Delivery in 7-14 days)`,
          html: htmlContent,
        });
        if (fallback.data?.id) {
          console.log('[Resend] ✅ Order details delivered to Gmail! ID:', fallback.data.id);
          return { success: true, id: fallback.data.id, deliveredTo: targetEmail };
        }
        if (fallback.error) {
          console.error('[Resend Error]:', fallback.error.message);
          return { success: false, error: fallback.error.message };
        }
      }
      return { success: false, error: result.error.message };
    }

    console.log('[Resend] ✅ Email sent successfully! ID:', result.data?.id);
    return { success: true, id: result.data?.id };
  } catch (err) {
    console.error('[Resend] ❌ Exception sending email:', err.message);
    return { success: false, error: err.message };
  }
}
