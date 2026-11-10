import React, { useState } from 'react';
import { money } from '../utils/format.js';
import { validateCoupon, calculateDiscount } from '../utils/coupons.js';
import { Icon } from '../components/common/Icon.jsx';
import { getVariantImage } from '../utils/product.js';

export function CartPage({ cart, setCart, onAdd, navigate, products = [], coupon, setCoupon, setToast }) {
  const [couponInput, setCouponInput] = useState('');
  const items = Object.entries(cart)
    .map(([cartKey, entry]) => ({
      ...entry,
      cartKey,
      product: products.find((item) => item.id === entry.productId),
    }))
    .filter((entry) => entry.product);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = calculateDiscount(subtotal, coupon?.code);
  const finalTotal = Math.max(0, subtotal - discount);

  const setQuantity = (id, quantity) =>
    setCart((current) => {
      const next = { ...current };
      if (quantity < 1) delete next[id];
      else next[id] = { ...next[id], quantity };
      return next;
    });

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const validated = validateCoupon(couponInput);
    if (validated) {
      if (setCoupon) setCoupon(validated);
      if (setToast) setToast(`Secret coupon "${validated.code}" applied! ${validated.label}`);
      setCouponInput('');
    } else {
      if (setToast) setToast('Invalid coupon code. Try secret code: BESTOFFER (15% off)');
    }
  };

  const handleRemoveCoupon = () => {
    if (setCoupon) setCoupon(null);
    if (setToast) setToast('Coupon removed.');
  };

  return (
    <div className="cart-page">
      <div className="breadcrumbs">
        <button onClick={() => navigate('/')}>Home</button>
        <span>/</span>
        <span>Your bag</span>
      </div>
      <div className="page-heading">
        <div>
          <span className="eyebrow">JUST A FEW SOFT THINGS</span>
          <h1>Your comfort collection.</h1>
        </div>
        <button className="text-link" onClick={() => navigate('/shop')}>
          Keep browsing <Icon name="arrow" size={16} />
        </button>
      </div>
      {items.length ? (
        <div className="cart-layout">
          <div className="cart-items">
            <div className="shipping-progress">
              <div className="progress-icon">
                <Icon name="truck" />
              </div>
              <div>
                <strong>Doorstep delivery in 7 to 14 days across India.</strong>
                <small>Factory-direct shipment from Aanur Textile, Nathakadaiyur.</small>
              </div>
            </div>
            {items.map(({ cartKey, product: item, quantity, size, colorIndex, variantImage }) => (
              <article className="cart-item" key={cartKey}>
                <button className="cart-image" onClick={() => navigate(`/product/${item.id}`)}>
                  <img src={variantImage || getVariantImage(item, colorIndex)} alt={item.name} />
                </button>
                <div className="cart-item-info">
                  <button className="cart-item-title" onClick={() => navigate(`/product/${item.id}`)}>
                    {item.name}
                  </button>
                  <small>
                    {size || item.sizes?.[0] || 'Standard'}
                    {item.colorNames?.[colorIndex] ? ` · ${item.colorNames[colorIndex]}` : ''}
                  </small>
                  <button className="remove-item" onClick={() => setQuantity(cartKey, 0)}>
                    Remove
                  </button>
                </div>
                <div className="cart-quantity">
                  <div className="quantity-selector">
                    <button
                      aria-label={`Decrease ${item.name} quantity`}
                      onClick={() => setQuantity(cartKey, quantity - 1)}
                    >
                      <Icon name="minus" size={14} />
                    </button>
                    <span>{quantity}</span>
                    <button
                      aria-label={`Increase ${item.name} quantity`}
                      onClick={() => setQuantity(cartKey, quantity + 1)}
                    >
                      <Icon name="plus" size={14} />
                    </button>
                  </div>
                  <strong>{money(item.price * quantity)}</strong>
                </div>
              </article>
            ))}
            <div className="cart-recommend">
              <span className="eyebrow">A little something extra</span>
              <h3>Make space for one more comfort.</h3>
              <div>
                {products
                  .filter((item) => !Object.values(cart).some((entry) => entry.productId === item.id))
                  .slice(0, 2)
                  .map((item) => (
                    <button className="recommend-item" key={item.id} onClick={() => onAdd(item)}>
                      <img src={item.image} alt="" />
                      <span>
                        {item.name}
                        <small>{money(item.price)}</small>
                      </span>
                      <Icon name="plus" size={17} />
                    </button>
                  ))}
              </div>
            </div>
          </div>
          <aside className="order-summary">
            <h2>A little overview</h2>
            <p className="summary-line">
              <span>Subtotal · {items.reduce((sum, item) => sum + item.quantity, 0)} pieces</span>
              <span>{money(subtotal)}</span>
            </p>

            {/* Secret Coupon Box */}
            <div className="cart-coupon-section">
              {coupon ? (
                <div className="applied-coupon-pill">
                  <div className="applied-coupon-info">
                    <Icon name="star" size={13} />
                    <div>
                      <strong>{coupon.code}</strong>
                      <small>{coupon.label}</small>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="remove-coupon-btn"
                    onClick={handleRemoveCoupon}
                    aria-label="Remove coupon"
                    title="Remove coupon"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <form className="cart-coupon-form" onSubmit={handleApplyCoupon}>
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Secret coupon code"
                    aria-label="Secret coupon code"
                  />
                  <button type="submit">Apply</button>
                </form>
              )}
              {!coupon && (
                <button
                  type="button"
                  className="coupon-secret-hint"
                  onClick={() => {
                    if (setCoupon) {
                      setCoupon({ code: 'BESTOFFER', discountPercent: 15, label: '15% Secret Offer Discount' });
                      if (setToast) setToast('Secret coupon "BESTOFFER" applied! (15% OFF)');
                    }
                  }}
                >
                  Have a secret code? Click to apply <strong>BESTOFFER</strong> (15% off)
                </button>
              )}
            </div>

            {discount > 0 && (
              <p className="summary-line discount-line">
                <span>Secret Coupon ({coupon?.code})</span>
                <span className="discount-amount">−{money(discount)}</span>
              </p>
            )}

            <p className="summary-line">
              <span>Delivery</span>
              <span>7 to 14 days (Free)</span>
            </p>
            <div className="summary-total">
              <span>Product total</span>
              <strong>{money(finalTotal)}</strong>
            </div>
            <small className="tax-note">All orders are shipped factory-direct. Delivery takes 7 to 14 days.</small>
            <button
              className="button button-dark full-width checkout-button"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout <Icon name="arrow" size={16} />
            </button>
            <div className="secure-note">
              <Icon name="truck" size={16} /> Estimated delivery: 7 to 14 days
            </div>
          </aside>
        </div>
      ) : (
        <div className="empty-state cart-empty">
          <div className="empty-art">
            <Icon name="bag" size={35} />
          </div>
          <h2>Your comfort collection is waiting.</h2>
          <p>Add something soft to your cart and make your next rest even better.</p>
          <button className="button button-dark" onClick={() => navigate('/shop')}>
            Start shopping <Icon name="arrow" size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export default CartPage;
