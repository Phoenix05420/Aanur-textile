import { Resend } from 'resend';
import dotenv from 'dotenv';
import { store } from '../src/data.js';

dotenv.config();

const apiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL || 'Aanur Textile <onboarding@resend.dev>';
const adminEmail = process.env.STORE_ADMIN_EMAIL;

export function isResendConfigured() {
  return Boolean(
    apiKey &&
    apiKey.trim().startsWith('re_') &&
    !apiKey.includes('YOUR_API_KEY')
  );
}

function getResendClient() {
  if (!isResendConfigured()) return null;
  return new Resend(apiKey);
}

/**
 * Helper to safely send email with Resend, falling back to registered testing email
 * if running under Resend Free tier restrictions.
 */
async function sendSafeEmail({ to, subject, html }) {
  const resend = getResendClient();
  if (!resend) {
    console.log('[Resend] ⚠️ RESEND_API_KEY is not configured in .env.');
    return { success: false, reason: 'RESEND_API_KEY not configured' };
  }

  const recipients = Array.isArray(to) ? to.filter(Boolean) : [to].filter(Boolean);
  if (recipients.length === 0) {
    return { success: false, reason: 'No recipients provided' };
  }

  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: recipients,
      subject,
      html,
    });

    if (result.error) {
      console.warn('[Resend API Warning]:', result.error.message);
      // Under Resend sandbox restrictions, you can only deliver to the account holder
      const match = result.error.message?.match(/\(([^)]+@[^)]+)\)/);
      const targetEmail = match ? match[1] : adminEmail;

      if (targetEmail && !recipients.includes(targetEmail)) {
        console.log(`[Resend Sandbox] Delivering to registered account email (${targetEmail})...`);
        const fallback = await resend.emails.send({
          from: fromEmail,
          to: [targetEmail],
          subject: `[For: ${recipients.join(', ')}] ${subject}`,
          html,
        });

        if (fallback.data?.id) {
          console.log('[Resend] ✅ Delivered via fallback! ID:', fallback.data.id);
          return { success: true, id: fallback.data.id, deliveredTo: targetEmail };
        }
      }
      return { success: false, error: result.error.message };
    }

    console.log('[Resend] ✅ Email sent! ID:', result.data?.id);
    return { success: true, id: result.data?.id };
  } catch (err) {
    console.error('[Resend Exception]:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * 1. Send Login / Registration 6-Digit OTP Email
 */
export async function sendOtpEmail({ email, otp }) {
  console.log(`\n[Resend] 📨 Sending 6-digit login OTP (${otp}) to: ${email}`);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Your Aanur Textile Login OTP</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f5ef; margin: 0; padding: 24px; color: #292721;">
      <div style="max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #eee5da;">
        
        <!-- Header -->
        <div style="background-color: #292721; padding: 28px 24px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px;">Aanur Textile</h1>
          <p style="margin: 4px 0 0; font-size: 12px; color: #c4baa9; letter-spacing: 1px; text-transform: uppercase;">Factory Direct · Nathakadaiyur</p>
        </div>

        <!-- Body -->
        <div style="padding: 32px 28px; text-align: center;">
          <h2 style="margin: 0 0 8px; font-size: 20px; color: #292721;">Your Sign-In Verification Code</h2>
          <p style="margin: 0 0 24px; font-size: 14.5px; color: #666; line-height: 1.5;">
            Use the 6-digit verification code below to access your Aanur Textile account:
          </p>

          <!-- OTP Code Box -->
          <div style="background-color: #fbf9f5; border: 2px dashed #b76b52; border-radius: 10px; padding: 18px 24px; margin: 0 auto 24px; display: inline-block;">
            <span style="font-family: monospace; font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #b76b52;">${otp}</span>
          </div>

          <p style="margin: 0 0 16px; font-size: 13px; color: #888;">
            ⏰ <strong>Valid for 10 minutes.</strong> Do not share this code with anyone.
          </p>

          <div style="margin-top: 24px; padding-top: 18px; border-top: 1px solid #eee5da; font-size: 12px; color: #999; line-height: 1.5; text-align: left;">
            If you did not request this verification code, you can safely ignore this email. No changes will be made to your account.
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #faf7f2; padding: 14px; text-align: center; font-size: 11.5px; color: #aaa;">
          © 2026 Aanur Textile, Nathakadaiyur, Tamil Nadu · Pure Cotton & Handcrafted Weaves
        </div>
      </div>
    </body>
    </html>
  `;

  return sendSafeEmail({
    to: email,
    subject: `Your Aanur Textile Login OTP: ${otp}`,
    html: htmlContent,
  });
}

/**
 * 2. Send Customer Order Confirmation Email with "Confirm Order" Button
 */
export async function sendOrderCustomerEmail(order, confirmUrl) {
  if (!order.email) return { success: false, reason: 'No customer email' };

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
      <title>Thank you for your order #${order.orderRef}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f5ef; margin: 0; padding: 24px; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); border: 1px solid #eee5da;">
        
        <!-- Header -->
        <div style="background-color: #292721; padding: 32px 24px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 26px; font-weight: 600; letter-spacing: 0.5px;">Aanur Textile</h1>
          <p style="margin: 6px 0 0; font-size: 13px; color: #c4baa9; letter-spacing: 1px; text-transform: uppercase;">Comfort, Considered · Nathakadaiyur</p>
        </div>

        <!-- Body -->
        <div style="padding: 32px 28px;">
          <h2 style="margin: 0 0 12px; font-size: 22px; color: #1a1a1a;">Thank you for your order, ${order.firstName || 'Artisan Customer'}!</h2>
          <p style="margin: 0 0 20px; font-size: 15px; color: #555; line-height: 1.5;">
            We've received your order and are preparing your pure cotton bedsheets for factory-direct dispatch from our workshop in Nathakadaiyur, Tamil Nadu.
          </p>

          <!-- Primary Call-to-Action: Confirm Order Button -->
          ${confirmUrl ? `
          <div style="background: linear-gradient(135deg, #fbf7f4 0%, #f4ede4 100%); border: 1.5px solid #d4c5b3; border-radius: 10px; padding: 22px; text-align: center; margin-bottom: 26px;">
            <div style="font-size: 15px; font-weight: 600; color: #292721; margin-bottom: 12px;">Final Step: Please Confirm Your Order</div>
            <a href="${confirmUrl}" style="background-color: #2c4226; color: #ffffff; padding: 13px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block; box-shadow: 0 3px 10px rgba(44,66,38,0.25);">
              ✓ Confirm Order Now
            </a>
            <div style="font-size: 12.5px; color: #777; margin-top: 12px; line-height: 1.4;">
              ⚡ <strong>Automatic Verification:</strong> In case you don’t see this email, our workshop automation will automatically verify and schedule your order for weaving after <strong>30 minutes</strong>.
            </div>
          </div>
          ` : ''}

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
              <strong>Customer:</strong> ${order.firstName} ${order.lastName || ''}<br>
              <strong>Email:</strong> ${order.email}<br>
              <strong>Phone:</strong> ${order.phone || 'Provided at checkout'}<br>
              <strong>Shipping Address:</strong> ${order.street}, ${order.city} - ${order.postalCode}<br>
              <strong>Payment Method:</strong> ${order.paymentMethod || 'Cash on Delivery (COD)'}
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
                <td colspan="2" style="padding: 8px; text-align: right; color: #b76b52; font-weight: 600;">Coupon (${order.couponCode || 'BESTOFFER'}):</td>
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
            <strong>Need assistance with your order?</strong><br>
            Aanur Textile Workshop · ${store.address}
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f7f5ef; padding: 16px; text-align: center; font-size: 12px; color: #999;">
          © 2026 Aanur Textile, Nathakadaiyur · Handcrafted doorstep delivery in 7 to 14 days
        </div>
      </div>
    </body>
    </html>
  `;

  return sendSafeEmail({
    to: order.email,
    subject: `Thank you for your order #${order.orderRef} — Aanur Textile`,
    html: htmlContent,
  });
}

/**
 * 3. Send Server-Side Order Notification & Status Updates to Owner (STORE_ADMIN_EMAIL)
 */
export async function sendOrderOwnerEmail(order, updateType = 'new') {
  if (!adminEmail) return { success: false, reason: 'No admin email configured' };

  let subject = `🔔 New Order Received: #${order.orderRef} - ₹${order.total}`;
  let statusBanner = 'Awaiting Customer Confirmation (or 30m Auto-Verification)';
  let bannerColor = '#b76b52';

  if (updateType === 'customer_confirmed') {
    subject = `✅ Order Confirmed by Customer: #${order.orderRef} (Priority Weaving)`;
    statusBanner = '✓ Verified by Customer (Click Confirmed)';
    bannerColor = '#2c4226';
  } else if (updateType === 'auto_verified') {
    subject = `⏰ Order Auto-Verified (30m): #${order.orderRef} (Scheduled for Dispatch)`;
    statusBanner = '✓ Auto-Verified after 30 minutes (Scheduled for Loom Dispatch)';
    bannerColor = '#2c4226';
  }

  const itemsList = (order.items || []).map((i) => `
    <li><strong>${i.name}</strong> (Size: ${i.size || 'Standard'}, Qty: ${i.quantity}) — ₹${(i.price * i.quantity).toLocaleString('en-IN')}</li>
  `).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: -apple-system, sans-serif; background: #fdfbf7; padding: 24px; color: #292721;">
      <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 10px; padding: 28px; border: 1px solid #eee5da;">
        
        <div style="font-size: 12px; font-weight: 700; color: #b76b52; letter-spacing: 1px; text-transform: uppercase;">
          Aanur Textile Workshop Order System
        </div>
        <h2 style="margin: 8px 0 16px; color: #111;">${subject}</h2>

        <div style="background-color: ${bannerColor}; color: #fff; padding: 10px 16px; border-radius: 6px; font-weight: 600; font-size: 14px; margin-bottom: 20px;">
          ${statusBanner}
        </div>

        <div style="background: #faf7f2; border: 1px solid #e6ded3; border-radius: 8px; padding: 16px; margin-bottom: 20px; font-size: 14px; line-height: 1.6;">
          <strong>Order Reference:</strong> #${order.orderRef}<br>
          <strong>Customer Name:</strong> ${order.firstName} ${order.lastName || ''}<br>
          <strong>Email:</strong> ${order.email || 'N/A'}<br>
          <strong>Phone:</strong> ${order.phone || 'N/A'}<br>
          <strong>Delivery Address:</strong> ${order.street}, ${order.city} - ${order.postalCode}<br>
          <strong>Payment:</strong> ${order.paymentMethod || 'Cash on Delivery'}<br>
          <strong>Total Amount:</strong> ₹${Number(order.total || 0).toLocaleString('en-IN')}
        </div>

        <h3 style="font-size: 15px; margin: 0 0 10px;">Ordered Items:</h3>
        <ul style="padding-left: 20px; line-height: 1.6; font-size: 14px; color: #444;">
          ${itemsList}
        </ul>

        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #eee; font-size: 12px; color: #888;">
          Aanur Textile Automated Workshop Dispatch · Nathakadaiyur, Tamil Nadu
        </div>
      </div>
    </body>
    </html>
  `;

  return sendSafeEmail({
    to: adminEmail,
    subject,
    html: htmlContent,
  });
}

/**
 * Backward compatible entry point for placing an order
 */
export async function sendOrderEmail(order, confirmUrl = '') {
  // 1. Send customer email
  const customerResult = await sendOrderCustomerEmail(order, confirmUrl);

  // 2. Send owner notification email
  const ownerResult = await sendOrderOwnerEmail(order, 'new');

  return {
    success: customerResult.success || ownerResult.success,
    customerId: customerResult.id,
    ownerId: ownerResult.id,
  };
}
