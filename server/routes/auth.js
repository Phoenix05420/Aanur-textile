import express from 'express';
import crypto from 'crypto';
import { generateAuthToken, verifyAuthToken, isAdminUser } from '../middleware/auth.js';
import { sendOtpEmail } from '../email.js';

export const authRouter = express.Router();

const otpStore = new Map(); // email.toLowerCase() -> { otp, expiresAt, name, phone, attempts }
const otpRateLimit = new Map(); // key -> [timestamps]

function checkRateLimit(key, maxRequests = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const timestamps = (otpRateLimit.get(key) || []).filter((t) => now - t < windowMs);
  if (timestamps.length >= maxRequests) {
    return false;
  }
  timestamps.push(now);
  otpRateLimit.set(key, timestamps);
  return true;
}

// Periodic cleanup every 2 minutes for expired OTPs and stale rate-limit trackers
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of otpStore.entries()) {
    if (now > val.expiresAt) otpStore.delete(key);
  }
  for (const [key, timestamps] of otpRateLimit.entries()) {
    const fresh = timestamps.filter((t) => now - t < 15 * 60 * 1000);
    if (fresh.length === 0) otpRateLimit.delete(key);
    else otpRateLimit.set(key, fresh);
  }
}, 2 * 60 * 1000).unref();

/**
 * Send 6-Digit OTP to Gmail / Email with Rate Limiting and Secure PRNG
 */
authRouter.post('/api/auth/send-otp', async (req, res) => {
  const { email, name, phone } = req.body || {};

  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, error: 'Please enter a valid Gmail / email address.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const clientIp = req.ip || req.headers['x-forwarded-for'] || 'client';

  if (!checkRateLimit(`ip:${clientIp}`, 10) || !checkRateLimit(`email:${cleanEmail}`, 5)) {
    return res.status(429).json({
      success: false,
      error: 'Too many verification code requests. Please wait a few minutes before trying again.',
    });
  }

  const otp = crypto.randomInt(100000, 1000000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  otpStore.set(cleanEmail, {
    otp,
    expiresAt,
    name: name || '',
    phone: phone || '',
    attempts: 0,
  });

  console.log(`[Gmail OTP] 🔑 Verification code generated and dispatched to: ${cleanEmail}`);

  let emailSent = false;
  try {
    const result = await sendOtpEmail({ email: cleanEmail, otp });
    emailSent = Boolean(result.success);
  } catch (err) {
    console.error('[Gmail OTP Error]:', err.message);
  }

  return res.json({
    success: true,
    message: emailSent
      ? `Verification OTP sent to ${cleanEmail}`
      : `Verification code sent to ${cleanEmail}`,
    email: cleanEmail,
    emailSent,
  });
});

/**
 * Verify 6-Digit OTP & Authenticate User with Attempt Lockout & Signed Token
 */
authRouter.post('/api/auth/verify-otp', async (req, res) => {
  const { email, otp, name, phone } = req.body || {};

  if (!email || !otp) {
    return res.status(400).json({ success: false, error: 'Email and 6-digit OTP code are required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanOtp = String(otp).trim();
  const entry = otpStore.get(cleanEmail);

  if (!entry) {
    return res.status(400).json({
      success: false,
      error: 'No active OTP found for this email. Please request a new code.',
    });
  }

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(cleanEmail);
    return res.status(400).json({
      success: false,
      error: 'Verification code expired (valid for 10 minutes). Please request a new code.',
    });
  }

  if ((entry.attempts || 0) >= 5) {
    otpStore.delete(cleanEmail);
    return res.status(429).json({
      success: false,
      error: 'Too many incorrect attempts. For security, this code was invalidated. Please request a new code.',
    });
  }

  const expectedBuffer = Buffer.from(entry.otp.padStart(6, '0'));
  const candidateBuffer = Buffer.from(cleanOtp.padStart(6, '0'));
  const isMatch = expectedBuffer.length === candidateBuffer.length && crypto.timingSafeEqual(expectedBuffer, candidateBuffer);

  if (!isMatch) {
    entry.attempts = (entry.attempts || 0) + 1;
    const remaining = 5 - entry.attempts;
    return res.status(400).json({
      success: false,
      error: `Invalid 6-digit verification code. (${remaining} attempts remaining before lockout)`,
    });
  }

  otpStore.delete(cleanEmail);

  const isAdmin = isAdminUser({ email: cleanEmail });

  const displayName = isAdmin ? 'Aanur Admin' : (name || entry.name || cleanEmail.split('@')[0]);
  const user = {
    name: displayName,
    email: cleanEmail,
    role: isAdmin ? 'admin' : 'customer',
    isAdmin,
    phone: phone || entry.phone || '+91 98427 51234',
    city: 'Tiruppur',
    state: 'Tamil Nadu',
    avatarBg: isAdmin ? '#8B1E0F' : '#b76b52',
  };

  const token = generateAuthToken(user);

  return res.json({
    success: true,
    message: isAdmin
      ? 'Admin verification successful! Accessing Artisan Admin Control Center...'
      : 'Verification successful. Welcome to Aanur Textile!',
    user,
    token,
    isAdmin,
    redirect: isAdmin ? '/admin' : '/profile',
  });
});

/**
 * Verify Current Session / Token
 */
authRouter.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
  const user = verifyAuthToken(token);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Not authenticated or token expired.' });
  }
  return res.json({ success: true, user });
});

export default authRouter;
