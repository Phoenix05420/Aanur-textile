/**
 * Fast2SMS API client
 * -------------------
 * Sends OTP SMS to Indian mobile numbers via the Fast2SMS HTTP API.
 *
 * Docs: https://docs.fast2sms.com/
 * Free plan: limited daily credits, ad-supported, India only.
 *
 * If FAST2SMS_API_KEY is missing or invalid, the client falls back to
 * "dry-run" mode — it logs the OTP to the server console and returns
 * success. This lets you develop / test the full OTP flow without
 * burning SMS credits or having an account yet.
 */

import axios from "axios";

const FAST2SMS_URL = "https://www.fast2sms.com/dev/bulkV2";

/**
 * Send an OTP message to the given phone number.
 *
 * @param {object} opts
 * @param {string} opts.phone   — 10-digit Indian mobile number (no country code)
 * @param {string} opts.code    — the OTP code to deliver (e.g. "123456")
 * @param {string} opts.apiKey  — Fast2SMS API key
 * @param {string} [opts.sender] — sender ID (default FSTSMS)
 * @param {string} [opts.route]  — "q" (transactional OTP) or "p" (promotional)
 * @param {boolean} [opts.devMode] — when true, always log the OTP server-side
 * @returns {Promise<{ ok: boolean, provider?: string, dryRun?: boolean, raw?: any, error?: string }>}
 */
export async function sendOtpSms({
  phone,
  code,
  apiKey,
  sender = "FSTSMS",
  route = "q",
  devMode = true,
}) {
  // Normalise phone: strip +91, spaces, dashes; keep last 10 digits.
  const normalized = String(phone || "").replace(/[^\d]/g, "").slice(-10);

  if (normalized.length !== 10) {
    return {
      ok: false,
      error: "Phone number must be a 10-digit Indian mobile number.",
    };
  }

  // Dry-run mode: no API key, or dev mode without forcing real send.
  if (!apiKey || apiKey === "YOUR_FAST2SMS_API_KEY_HERE") {
    if (devMode) {
      console.warn(
        `\n[Fast2SMS] DRY-RUN — no API key configured.\n` +
          `            OTP for ${normalized}: ${code}\n` +
          `            Set FAST2SMS_API_KEY in .env to deliver real SMS.\n`
      );
    }
    return { ok: true, dryRun: true, provider: "fast2sms-dryrun" };
  }

  // Message variables for Fast2SMS variable template.
  const message = `${code} is your login verification code for Aanur Textile. Do not share it with anyone. Valid for 5 minutes.`;

  try {
    const response = await axios.post(
      FAST2SMS_URL,
      {
        variables_values: message,
        route: route,
        numbers: normalized,
        sender_id: sender,
        message: message,
        language: "english",
      },
      {
        headers: {
          authorization: apiKey,
          "Content-Type": "application/json",
        },
        timeout: 10_000,
      }
    );

    const data = response.data || {};
    const ok = data.return === true || data.status === "success" || (response.status === 200 && !data.error);

    if (devMode) {
      console.info(
        `[Fast2SMS] Sent OTP to ${normalized} — provider response:`,
        JSON.stringify(data)
      );
    }

    return { ok, provider: "fast2sms", raw: data };
  } catch (err) {
    const status = err.response?.status;
    const body = err.response?.data;
    console.error(
      `[Fast2SMS] Request failed (status=${status}):`,
      JSON.stringify(body || err.message)
    );
    return {
      ok: false,
      error: body?.message || err.message || "Fast2SMS request failed",
      raw: body,
    };
  }
}
