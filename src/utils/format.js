/**
 * Unified currency and number formatting for Aanur Textile
 */
export function money(value) {
  return `₹${Number(value || 0).toLocaleString('en-IN')}`;
}

export default money;
