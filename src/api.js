/**
 * Centralized API URL helper for Seamless Local, Railway, and Vercel Deployments
 *
 * If VITE_API_BASE_URL is set (e.g. on Vercel pointing to Railway), requests
 * will target the remote backend. Otherwise, relative paths are used.
 */
export const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export function apiUrl(endpoint) {
  const clean = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE}${clean}`;
}

export default apiUrl;
