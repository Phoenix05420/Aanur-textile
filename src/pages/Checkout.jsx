import React, { useState } from 'react';
import { store } from '../data.js';
import { apiUrl } from '../api.js';
import { money } from '../utils/format.js';
import { calculateDiscount } from '../utils/coupons.js';
import { ordersStorage } from '../utils/storage.js';
import { Icon } from '../components/common/Icon.jsx';

export function Checkout({
  cart,
  setCart,
  navigate,
  products = [],
  coupon,
  setCoupon,
  currentUser,
  setToast,
}) {
  const [step, setStep] = useState(1);
  const [customer, setCustomer] = useState(() => {
    if (!currentUser) return {};
    const nameParts = (currentUser.name || '').trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    return {
      firstName,
      lastName,
      email: currentUser.email || '',
      phone: currentUser.phone || '',
      city: currentUser.city || 'Tiruppur',
      street: currentUser.street || '',
      postalCode: currentUser.postalCode || '',
    };
  });
  const [orderRef, setOrderRef] = useState('');
  const [placedItems, setPlacedItems] = useState([]);
  const [placedTotal, setPlacedTotal] = useState(0);

  const items = Object.values(cart)
    .map((entry) => ({ ...entry, product: products.find((item) => item.id === entry.productId) }))
    .filter((entry) => entry.product);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const discount = calculateDiscount(subtotal, coupon?.code);
  const total = Math.max(0, subtotal - discount);

  const advance = (event) => {
    event.preventDefault();
    if (step === 1) {
      const formData = Object.fromEntries(new FormData(event.currentTarget));
      setCustomer((prev) => ({ ...prev, ...formData }));
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      const generatedRef = `AT-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderRef(generatedRef);
      setPlacedItems(items);
      setPlacedTotal(total);
      if (setCart) setCart({});
      if (setCoupon) setCoupon(null);
      const newOrder = {
        orderRef: generatedRef,
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: 'processing',
        statusLabel: 'Processing · On the Loom',
        deliveryEstimate: '7 to 14 days',
        total,
        paymentMethod: 'Cash on Delivery',
        courier: 'Aanur Factory Direct Express',
        trackingNumber: `AANUR-${generatedRef}`,
        items: items.map((i) => ({
          id: i.product.id,
          name: i.product.name,
          size: i.size || i.product.sizes?.[0] || 'Standard',
          color: i.color || 'Artisan Weave',
          image: i.variantImage || i.product.image,
          price: i.product.price,
          quantity: i.quantity,
        })),
      };
      ordersStorage.saveOrder(newOrder);
      setStep(4);
      fetch(apiUrl('/api/orders'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderRef: generatedRef,
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone,
          street: customer.street,
          city: customer.city,
          postalCode: customer.postalCode,
          subtotal,
          discount,
          couponCode: coupon?.code || '',
          total,
          items: items.map((i) => ({
            id: i.product.id,
            name: i.product.name,
            price: i.product.price,
            quantity: i.quantity,
            size: i.size || i.product.sizes?.[0] || 'Standard',
          })),
          paymentMethod: 'Cash on Delivery',
        }),
      }).catch((err) => {
        console.warn('Backend order sync issue (saved locally):', err);
      });
    }
  };

  const displayItems = step === 4 ? placedItems : items;
  const displayTotal = step === 4 ? placedTotal : total;

  if (displayItems.length === 0 && step !== 4) {
    return (
      <div className="empty-state checkout-empty">
        <h2>Nothing to check out just yet.</h2>
        <p>Your next soft landing is waiting in the shop.</p>
        <button className="button button-dark" onClick={() => navigate('/shop')}>
          Explore the collection <Icon name="arrow" />
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      {step === 4 ? (
        <div className="order-success">
          <div className="success-icon">
            <Icon name="check" size={30} />
          </div>
          <span className="eyebrow">ORDER CONFIRMED</span>
          <h1>Thank you for your order!</h1>
          <p>We’ve received your order and are preparing your bedsheets for dispatch from our factory in Nathakadaiyur.</p>
          <div className="order-number">ORDER REFERENCE · {orderRef}</div>
          <div style={{ margin: '0.5rem 0 1rem', fontSize: '1.1rem', fontWeight: 600, color: 'var(--ink)' }}>
            Total Paid / Due: {money(displayTotal)}
          </div>
          <div className="shipping-progress" style={{ maxWidth: '480px', margin: '1.25rem auto', textAlign: 'left' }}>
            <div className="progress-icon">
              <Icon name="truck" />
            </div>
            <div>
              <strong>Estimated Delivery: 7 to 14 days</strong>
              <small>Doorstep delivery across India directly from Aanur Textile.</small>
            </div>
          </div>
          <div style={{ margin: '1.2rem 0', color: 'var(--text-muted, #666)', fontSize: '0.92rem' }}>
            For queries, updates, or custom sizes, call us at{' '}
            <a href={store.phone} style={{ fontWeight: 600 }}>
              {store.phoneDisplay}
            </a>{' '}
            or email{' '}
            <a href={`mailto:${store.email}`} style={{ fontWeight: 600 }}>
              {store.email}
            </a>
            .
          </div>
          <button className="button button-dark" onClick={() => navigate('/shop')}>
            Continue shopping <Icon name="arrow" />
          </button>
          <div className="checkout-trust-bottom" style={{ marginTop: '1.5rem' }}>
            <Icon name="shield" size={16} /> Doorstep delivery in 7 to 14 days · Direct factory support
          </div>
        </div>
      ) : (
        <>
          <div className="checkout-steps">
            {['Address', 'Delivery', 'Payment'].map((name, index) => (
              <div
                key={name}
                className={step === index + 1 ? 'active' : step > index + 1 ? 'complete' : ''}
              >
                <span>{step > index + 1 ? <Icon name="check" size={14} /> : `0${index + 1}`}</span>
                {name}
              </div>
            ))}
          </div>
          <div className="checkout-layout">
            <form className="checkout-form" onSubmit={advance}>
              <span className="eyebrow">
                STEP 0{step} · {['YOUR DETAILS', 'DELIVERY TIMEFRAME', 'PAYMENT & CONFIRMATION'][step - 1]}
              </span>
              <h1>
                {['Where should we send your order?', 'Factory-direct delivery.', 'Payment method.'][step - 1]}
              </h1>
              {step === 1 && (
                <>
                  <div className="form-grid">
                    <label>
                      First name
                      <input
                        name="firstName"
                        required
                        autoComplete="given-name"
                        placeholder="Your first name"
                        defaultValue={customer.firstName || ''}
                      />
                    </label>
                    <label>
                      Last name
                      <input
                        name="lastName"
                        required
                        autoComplete="family-name"
                        placeholder="Your last name"
                        defaultValue={customer.lastName || ''}
                      />
                    </label>
                    <label className="span-two">
                      Email address
                      <input
                        name="email"
                        required
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        defaultValue={customer.email || ''}
                      />
                    </label>
                    <label className="span-two">
                      Phone number
                      <input
                        name="phone"
                        required
                        type="tel"
                        autoComplete="tel"
                        placeholder="+91 98765 43210"
                        defaultValue={customer.phone || ''}
                      />
                    </label>
                    <label className="span-two">
                      Street address
                      <input
                        name="street"
                        required
                        autoComplete="street-address"
                        placeholder="House number and street"
                        defaultValue={customer.street || ''}
                      />
                    </label>
                    <label>
                      City
                      <input
                        name="city"
                        required
                        autoComplete="address-level2"
                        placeholder="City"
                        defaultValue={customer.city || ''}
                      />
                    </label>
                    <label>
                      PIN code
                      <input
                        name="postalCode"
                        required
                        inputMode="numeric"
                        autoComplete="postal-code"
                        placeholder="000 000"
                        defaultValue={customer.postalCode || ''}
                      />
                    </label>
                  </div>
                  <small className="tax-note">
                    Orders are dispatched directly from our Nathakadaiyur workshop. Standard doorstep delivery takes 7 to 14
                    days.
                  </small>
                </>
              )}
              {step === 2 && (
                <div className="delivery-choice">
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem' }}>
                    <Icon name="truck" size={24} />
                    <div>
                      <strong>Standard Factory Delivery — 7 to 14 days</strong>
                      <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted, #666)', fontSize: '0.9rem' }}>
                        Free doorstep delivery across India. Carefully inspected and packaged at Aanur Textile.
                      </p>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted, #666)' }}>
                    Need expedited delivery or bulk distribution? Call <a href={store.phone}>{store.phoneDisplay}</a>.
                  </p>
                </div>
              )}
              {step === 3 && (
                <div className="payment-choice">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        cursor: 'pointer',
                        padding: '0.75rem 1rem',
                        border: '1px solid var(--border, #ddd)',
                        borderRadius: '6px',
                      }}
                    >
                      <input type="radio" name="paymentMethod" defaultChecked />
                      <span>
                        <strong>Cash on Delivery (COD) / UPI on Delivery</strong>
                        <br />
                        <small style={{ color: 'var(--text-muted, #666)' }}>
                          Pay when your bedsheets arrive at your doorstep in 7 to 14 days.
                        </small>
                      </span>
                    </label>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted, #666)' }}>
                    Have questions regarding your order? Call our factory directly at{' '}
                    <a href={store.phone}>{store.phoneDisplay}</a>.
                  </p>
                </div>
              )}
              <div className="checkout-form-actions">
                {step > 1 && (
                  <button type="button" className="text-link" onClick={() => setStep(step - 1)}>
                    Back
                  </button>
                )}
                <button className="button button-dark">
                  {step === 3 ? `Place Order · ${money(total)}` : 'Continue'} <Icon name="arrow" size={16} />
                </button>
              </div>
            </form>
            <aside className="checkout-summary">
              <h2>Your order</h2>
              {displayItems.map(({ product: item, quantity, cartKey }) => (
                <div className="checkout-item" key={cartKey || item.id}>
                  <img src={item.image} alt="" />
                  <span>
                    {item.name}
                    <small>Qty {quantity}</small>
                  </span>
                  <strong>{money(item.price * quantity)}</strong>
                </div>
              ))}
              <div className="checkout-summary-total">
                <span>Product subtotal</span>
                <strong>{money(step === 4 ? displayTotal : subtotal)}</strong>
              </div>
              {step !== 4 && discount > 0 && (
                <div className="checkout-summary-total discount-line">
                  <span>Secret Coupon ({coupon?.code})</span>
                  <strong className="discount-amount">−{money(discount)}</strong>
                </div>
              )}
              <div className="checkout-summary-total">
                <span>Delivery</span>
                <strong>7 to 14 days (Free)</strong>
              </div>
              <div
                className="checkout-summary-total grand-total"
                style={{ borderTop: '1px solid var(--border, #d1ccc1)', paddingTop: '0.75rem', marginTop: '0.5rem' }}
              >
                <span>Total</span>
                <strong style={{ fontSize: '1.25rem' }}>{money(displayTotal)}</strong>
              </div>
              <small className="tax-note">
                All items ship factory-direct from Aanur Textile. Doorstep delivery in 7 to 14 days.
              </small>
            </aside>
          </div>
          <div className="checkout-trust-bottom">
            <Icon name="truck" size={16} /> Doorstep delivery in 7 to 14 days across India
          </div>
        </>
      )}
    </div>
  );
}

export default Checkout;
