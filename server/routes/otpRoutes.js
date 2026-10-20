/**
 * OTP routes
 * ---------
 * Express router exposing two REST endpoints:
 *   POST /api/otp/send    — generate + dispatch OTP
 *   POST /api/otp/verify  — verify OTP, mark verified
 *
 * Both endpoints accept JSON bodies and return JSON responses.
 */

import { Router } from "express";
import { sendOtp, verifyOtp } from "../services/otpService.js";

const router = Router();

/**
 * POST /api/otp/send
 * Body: { "phone": "9876543210" }
 *
 * Success 200: { ok: true, phone, expiresInSec, cooldownSec, dryRun?, code? }
 * Error   400: { ok: false, error, phone, cooldownSec? }
 */
router.post("/send", async (req, res) => {
  const phone = req.body?.phone;
  if (!phone) {
    return res
      .status(400)
      .json({ ok: false, error: 'Missing "phone" in request body.' });
  }
  const result = await sendOtp(phone);
  return res.status(result.ok ? 200 : 400).json(result);
});

/**
 * POST /api/otp/verify
 * Body: { "phone": "9876543210", "code": "123456" }
 *
 * Success 200: { ok: true, phone, verified: true }
 * Error   400: { ok: false, error, phone, attemptsLeft? }
 */
router.post("/verify", (req, res) => {
  const { phone, code } = req.body || {};
  if (!phone || !code) {
    return res.status(400).json({
      ok: false,
      error: 'Missing "phone" or "code" in request body.',
    });
  }
  const result = verifyOtp(phone, code);
  return res.status(result.ok ? 200 : 400).json(result);
});

export default router;
