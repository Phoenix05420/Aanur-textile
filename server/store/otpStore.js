/**
 * In-memory OTP store
 * --------------------
 * A Map keyed by normalised phone number. Each entry holds:
 *   { code, attempts, createdAt, expiresAt, lastSentAt, verified }
 *
 * This is intentionally simple — single-process, lost on restart.
 * All mutating methods are synchronous and return values for ergonomics.
 */

const store = new Map();

/**
 * Normalise a phone to its 10-digit Indian form.
 * Strips country code, spaces, dashes, parentheses.
 * @param {string} phone
 * @returns {string|null} 10-digit string, or null if invalid
 */
export function normalizePhone(phone) {
  const digits = String(phone || "").replace(/[^\d]/g, "").slice(-10);
  return digits.length === 10 ? digits : null;
}

/**
 * Save / overwrite the OTP record for a phone.
 * @param {string} phone  — already normalised
 * @param {object} record — partial record; merges with defaults
 */
export function setRecord(phone, record) {
  const now = Date.now();
  const existing = store.get(phone) || {};

  const merged = {
    code: record.code ?? existing.code,
    attempts: record.attempts ?? existing.attempts ?? 0,
    createdAt: record.createdAt ?? now,
    expiresAt: record.expiresAt ?? now + 5 * 60 * 1000,
    lastSentAt: record.lastSentAt ?? 0,
    verified: record.verified ?? false,
    ...record,
  };

  store.set(phone, merged);
  return merged;
}

export function getRecord(phone) {
  return store.get(phone) || null;
}

export function deleteRecord(phone) {
  store.delete(phone);
}

/**
 * Remove expired OTP records. Called periodically by the cleanup timer.
 * @returns {number} number of records removed
 */
export function purgeExpired() {
  const now = Date.now();
  let removed = 0;
  for (const [phone, rec] of store) {
    if (rec.expiresAt <= now) {
      store.delete(phone);
      removed++;
    }
  }
  return removed;
}

/**
 * Dev helper: peek at the live store (do not expose in production).
 */
export function _debugSnapshot() {
  return Array.from(store.entries()).map(([phone, rec]) => ({
    phone,
    code: rec.code,
    attempts: rec.attempts,
    expiresAt: new Date(rec.expiresAt).toISOString(),
    lastSentAt: rec.lastSentAt ? new Date(rec.lastSentAt).toISOString() : null,
    verified: rec.verified,
  }));
}

// Periodic cleanup every 60s — keeps the Map small and avoids stale lookups.
setInterval(() => {
  const n = purgeExpired();
  if (n > 0) console.debug(`[otpStore] Purged ${n} expired OTP record(s).`);
}, 60_000).unref?.();
