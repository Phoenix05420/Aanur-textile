import crypto from 'crypto';

const SESSION_SECRET = process.env.SESSION_SECRET || 'aanur-textile-secure-secret-key-2026';

export function generateAuthToken(user) {
  const payload = Buffer.from(
    JSON.stringify({
      email: user.email,
      role: user.role,
      isAdmin: Boolean(user.isAdmin),
      name: user.name,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days expiration
    })
  ).toString('base64url');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

export function verifyAuthToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;
  const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  try {
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return null;
    }
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!data.exp || Date.now() > data.exp) return null;
    return data;
  } catch {
    return null;
  }
}

export function isAdminUser(user) {
  if (!user) return false;
  const adminEmail = (process.env.STORE_ADMIN_EMAIL || process.env.VITE_STORE_ADMIN_EMAIL || '').trim().toLowerCase();
  return Boolean(
    user.isAdmin || user.role === 'admin' || (adminEmail && user.email?.toLowerCase() === adminEmail)
  );
}

export function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
  const user = verifyAuthToken(token);

  if (!isAdminUser(user)) {
    return res.status(403).json({
      success: false,
      error: 'Access denied. Administrator authentication required.',
    });
  }
  req.user = user;
  next();
}
