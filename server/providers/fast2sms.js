/**
 * Fast2SMS Live SMS Client
 * ------------------------
 * Real-world SMS delivery client using the Fast2SMS API (https://www.fast2sms.com/).
 * Dispatches 6-digit verification codes to Indian mobile phone numbers (+91).
 */

import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const FAST2SMS_URL = "https://www.fast2sms.com/dev/bulkV2";
const FALLBACK_KEY = "ulbIwjA41n6a5r8oNKJfzEePG0SBvmyUYxc2FRZtpqgCs7iHWXrZ3WVmYOlRa4IvQokEtsi5ySDJGu2w";

/**
 * Sends a real OTP SMS to an Indian mobile number.
 *
 * @param {object} opts
 * @param {string} opts.phone   — 10-digit Indian mobile number
 * @param {string} opts.code    — 6-digit numeric OTP code
 * @param {string} [opts.apiKey]  — Fast2SMS Authorization key
 * @param {string} [opts.route]  — 'q' (Quick SMS, default) or 'otp'
 * @returns {Promise<{ ok: boolean, provider?: string, error?: string, raw?: any }>}
 */
export async function sendOtpSms({
  phone,
  code,
  apiKey,
  route = "q",
}) {
  const normalized = String(phone || "").replace(/[^\d]/g, "").slice(-10);

  if (normalized.length !== 10) {
    return {
      ok: false,
      error: "Please enter a valid 10-digit Indian mobile number.",
    };
  }

  const activeApiKey = apiKey || process.env.FAST2SMS_API_KEY || FALLBACK_KEY;

  if (!activeApiKey || activeApiKey === "YOUR_FAST2SMS_API_KEY_HERE") {
    return {
      ok: false,
      error: "Fast2SMS API key is not configured. Please add FAST2SMS_API_KEY in server .env",
    };
  }

  // Construct payload based on selected Fast2SMS route
  let payload;
  if (route === "otp") {
    payload = {
      route: "otp",
      variables_values: String(code),
      numbers: normalized,
    };
  } else {
    // Route 'q' (Quick SMS) - reliable transactional dispatch
    payload = {
      route: "q",
      message: `${code} is your Aanur Textile login verification code. Valid for 5 minutes. Do not share this OTP with anyone.`,
      numbers: normalized,
      language: "english",
    };
  }

  try {
    const response = await axios.post(FAST2SMS_URL, payload, {
      headers: {
        authorization: activeApiKey,
        "Content-Type": "application/json",
      },
      timeout: 12000,
    });

    const data = response.data || {};
    const isSuccess =
      data.return === true ||
      data.status === "success" ||
      (response.status === 200 && !data.error && data.status_code !== 999 && data.status_code !== 996);

    if (isSuccess) {
      console.info(`[Fast2SMS] Successfully dispatched live OTP to +91 ${normalized}`);
      return { ok: true, provider: "fast2sms", raw: data };
    }

    const errorMsg = Array.isArray(data.message) ? data.message.join(" ") : (data.message || "Fast2SMS rejected dispatch.");
    return { ok: false, error: errorMsg, raw: data };
  } catch (err) {
    const status = err.response?.status;
    const body = err.response?.data;

    console.error(
      `[Fast2SMS] Gateway error (HTTP ${status}):`,
      JSON.stringify(body || err.message)
    );

    let friendlyError = "Unable to send SMS. Please verify your mobile number and try again.";

    if (body?.status_code === 999) {
      friendlyError =
        "Fast2SMS API requires an active account with a minimum ₹100 transaction. Please recharge your Fast2SMS wallet at fast2sms.com to enable live SMS delivery.";
    } else if (body?.status_code === 996) {
      friendlyError =
        "Fast2SMS website verification required for OTP route. Please complete website verification on fast2sms.com or use route 'q'.";
    } else if (body?.message) {
      friendlyError = Array.isArray(body.message) ? body.message.join(" ") : body.message;
    } else if (err.message) {
      friendlyError = err.message;
    }

    return {
      ok: false,
      error: friendlyError,
      raw: body,
    };
  }
}
