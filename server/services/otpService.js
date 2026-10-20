/**
 * OTP service
 * -----------
 * Orchestrates OTP generation, SMS delivery (via Fast2SMS), verification,
 * resend cooldown, attempt limits, and expiry — all backed by the
 * in-memory store.
 */

import { sendOtpSms } from "../providers/fast2sms.js";
import {
  getRecord,
  setRecord,
  deleteRecord,
  normalizePhone,
} from "../store/otpStore.js";

/**
 * Generate a cryptographically reasonable OTP code.
 * Uses crypto.randomInt when available (Node 16+) for uniform distribution.
 * @returns {string} N-digit numeric OTP as a string
 */
export function generateOtp() {
  const len = Math.max(4, Math.min(8, parseInt(process.env.OTP_LENGTH || "6", 10) || 6));
  const min = Math.pow(10, len - 1);
  const max = Math.pow(10, len) - 1;

  if (typeof globalThis.crypto?.randomInt === "function") {
    return String(globalThis.crypto.randomInt(min, max + 1)).padStart(len, "0");
  }
  return String(Math.floor(min + Math.random() * (max - min + 1))).padStart(
    len,
    "0"
  );
}

/**
 * Send (or resend) an OTP to the given phone.
 *
 * Validates the phone, enforces the resend cooldown, generates a fresh code,
 * stores it, then dispatches via Fast2SMS (or dry-run logs it).
 *
 * @param {string} phoneRaw — user input (may include +91, spaces, dashes)
 * @returns {Promise<{ ok: boolean, phone: string, expiresInSec: number, cooldownSec: number, dryRun?: boolean, code?: string, error?: string }>}
 */
export async function sendOtp(phoneRaw) {
  const phone = normalizePhone(phoneRaw);
  if (!phone) {
    return {
      ok: false,
      phone: phoneRaw,
      expiresInSec: 0,
      cooldownSec: 0,
      error: "Invalid phone number. Please enter a 10-digit Indian mobile number.",
    };
  }

  const now = Date.now();
  const existing = getRecord(phone);
  const cooldownMs = parseInt(process.env.OTP_RESEND_COOLDOWN_MS || "60000", 10);

  // Cooldown: prevent spamming the resend button.
  if (existing && existing.lastSentAt > 0) {
    const elapsed = now - existing.lastSentAt;
    if (elapsed < cooldownMs) {
      const remaining = Math.ceil((cooldownMs - elapsed) / 1000);
      return {
        ok: false,
        phone,
        expiresInSec: Math.max(0, Math.ceil((existing.expiresAt - now) / 1000)),
        cooldownSec: remaining,
        error: `Please wait ${remaining}s before requesting a new code.`,
      };
    }
  }

  // Generate and store a fresh OTP.
  const code = generateOtp();
  const ttlMs = parseInt(process.env.OTP_TTL_MS || "300000", 10);
  setRecord(phone, {
    code,
    attempts: 0,
    createdAt: now,
    expiresAt: now + ttlMs,
    lastSentAt: now,
    verified: false,
  });

  const devMode = String(process.env.DEV_MODE || "true").toLowerCase() === "true";

  // Dispatch via Fast2SMS (or dry-run).
  const result = await sendOtpSms({
    phone,
    code,
    apiKey: process.env.FAST2SMS_API_KEY,
    sender: process.env.FAST2SMS_SENDER_ID || "FSTSMS",
    route: process.env.FAST2SMS_ROUTE || "q",
    devMode,
  });

  if (!result.ok) {
    return {
      ok: false,
      phone,
      expiresInSec: Math.ceil(ttlMs / 1000),
      cooldownSec: Math.ceil(cooldownMs / 1000),
      error: result.error || "Failed to send OTP via SMS provider.",
    };
  }

  return {
    ok: true,
    phone,
    expiresInSec: Math.ceil(ttlMs / 1000),
    cooldownSec: Math.ceil(cooldownMs / 1000),
    dryRun: !!result.dryRun,
    // In dev mode, return code in response so user can test locally easily if needed
    code: devMode ? code : undefined,
  };
}

/**
 * Verify the OTP for a given phone.
 *
 * On success: marks the phone as verified and removes the OTP record.
 * On failure: increments attempts; once attempts exceed OTP_MAX_ATTEMPTS,
 * the OTP is invalidated and the user must request a new one.
 *
 * @param {string} phoneRaw
 * @param {string} codeRaw — user-entered OTP code
 * @returns {{ ok: boolean, phone: string, attemptsLeft?: number, verified?: boolean, error?: string }}
 */
export function verifyOtp(phoneRaw, codeRaw) {
  const phone = normalizePhone(phoneRaw);
  if (!phone) {
    return { ok: false, phone: phoneRaw, error: "Invalid phone number." };
  }

  const code = String(codeRaw || "").trim();
  if (!/^\d{4,8}$/.test(code)) {
    return { ok: false, phone, error: "OTP must be 4-8 digits." };
  }

  const record = getRecord(phone);
  if (!record) {
    return {
      ok: false,
      phone,
      error: "No OTP was requested for this number. Please request a new code.",
    };
  }

  // Expiry check.
  if (record.expiresAt <= Date.now()) {
    deleteRecord(phone);
    return {
      ok: false,
      phone,
      error: "OTP has expired. Please request a new code.",
    };
  }

  // Attempt ceiling.
  const maxAttempts = parseInt(process.env.OTP_MAX_ATTEMPTS || "5", 10);
  if (record.attempts >= maxAttempts) {
    deleteRecord(phone);
    return {
      ok: false,
      phone,
      error: "Too many incorrect attempts. Please request a new code.",
    };
  }

  if (record.code !== code) {
    const updated = setRecord(phone, { attempts: record.attempts + 1 });
    const attemptsLeft = Math.max(0, maxAttempts - updated.attempts);
    return {
      ok: false,
      phone,
      attemptsLeft,
      error:
        attemptsLeft > 0
          ? `Incorrect code. ${attemptsLeft} attempt(s) remaining.`
          : "Incorrect code. Please request a new one.",
    };
  }

  // Success — mark verified, delete record so the same code can't be reused.
  setRecord(phone, { verified: true });
  deleteRecord(phone);

  return { ok: true, phone, verified: true };
}
