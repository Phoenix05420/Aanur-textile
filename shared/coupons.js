/**
 * Shared canonical coupon definitions and calculation engine for both Client and Server
 */
export const COUPON_DEFINITIONS = {
  BESTOFFER: { code: 'BESTOFFER', percent: 15, label: '15% Secret Offer Discount' },
  BESTOFFERS: { code: 'BESTOFFER', percent: 15, label: '15% Secret Offer Discount' },
  SECRET15: { code: 'BESTOFFER', percent: 15, label: '15% Secret Offer Discount' },
  AANUR10: { code: 'AANUR10', percent: 10, label: '10% Factory Discount' },
  SECRET10: { code: 'AANUR10', percent: 10, label: '10% Factory Discount' },
  OFFER50: { code: 'OFFER50', flat: 50, label: '₹50 Flat Off' },
};

export function validateCoupon(inputCode) {
  if (!inputCode || typeof inputCode !== 'string') return null;
  const clean = inputCode.trim().toUpperCase();
  const rule = COUPON_DEFINITIONS[clean];
  if (!rule) return null;
  return {
    code: rule.code,
    label: rule.label,
    discountPercent: rule.percent,
    discountAmount: rule.flat,
  };
}

export function calculateDiscount(subtotal, couponCode) {
  if (!couponCode || typeof couponCode !== 'string') return 0;
  const clean = couponCode.trim().toUpperCase();
  const rule = COUPON_DEFINITIONS[clean];
  if (!rule) return 0;

  const validSubtotal = Math.max(0, Number(subtotal || 0));
  if (rule.percent) {
    return Math.round(validSubtotal * (rule.percent / 100));
  }
  if (rule.flat) {
    return Math.min(rule.flat, validSubtotal);
  }
  return 0;
}
