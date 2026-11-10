import React, { useState, useMemo } from 'react';
import { Icon } from '../components/common/Icon.jsx';
import { ProductGrid } from '../components/ProductGrid.jsx';

export function BestOffersPage({
  products: all = [],
  onAdd,
  wishlist,
  onWish,
  onQuick,
  navigate,
  coupon,
  setCoupon,
  setToast,
}) {
  const [copied, setCopied] = useState(false);
  // Strictly display only 5 curated products as requested
  const offerProducts = useMemo(() => all.slice(0, 5), [all]);
  const secretCode = 'BESTOFFER';

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(secretCode).catch(() => {});
    }
    setCopied(true);
    if (setToast) setToast(`Secret coupon "${secretCode}" copied to clipboard!`);
    setTimeout(() => setCopied(false), 2400);
  };

  const handleAutoApply = () => {
    if (setCoupon) {
      setCoupon({ code: secretCode, discountPercent: 15, label: '15% Secret Offer Discount' });
      if (setToast) setToast(`Secret coupon "${secretCode}" applied! (15% OFF)`);
    }
  };

  return (
    <div className="catalog-page best-offers-page">
      <div className="breadcrumbs">
        <button onClick={() => navigate('/')}>Home</button>
        <span>/</span>
        <span>Best Offers</span>
      </div>

      <div className="catalog-heading">
        <div>
          <span className="eyebrow">EXCLUSIVE FACTORY DEALS · LIMITED RUN</span>
          <h1>Top 5 Best Offers.</h1>
          <p>Hand-picked artisan bedsheets direct from our Nathakadaiyur loom with an exclusive secret coupon.</p>
        </div>
        <div className="catalog-count">
          5 pieces
          <br />
          <span>curated offers</span>
        </div>
      </div>

      {/* Secret Coupon Banner */}
      <div className="secret-coupon-banner">
        <div className="coupon-left">
          <div className="coupon-tag-badge">
            <Icon name="star" size={13} />
            <span>SECRET FACTORY COUPON</span>
          </div>
          <h2>Unlock Extra 15% OFF</h2>
          <p>
            Apply this exclusive secret code at checkout to take an additional 15% off your entire order on these top 5
            bedsheets.
          </p>
          <div className="coupon-code-wrap">
            <div className="coupon-code-display">
              <span className="coupon-code-label">SECRET CODE:</span>
              <strong className="coupon-code-value">{secretCode}</strong>
            </div>
            <button
              type="button"
              className="coupon-copy-btn"
              onClick={handleCopy}
              aria-label="Copy secret coupon code"
            >
              <Icon name={copied ? 'check' : 'plus'} size={14} />
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
        </div>

        <div className="coupon-right">
          <div className="coupon-savings-pill">
            <span className="savings-val">15%</span>
            <span className="savings-lbl">OFF TOTAL</span>
          </div>
          <button
            type="button"
            className={`button ${coupon?.code === secretCode ? 'button-outline' : 'button-dark'} coupon-auto-apply`}
            onClick={handleAutoApply}
          >
            {coupon?.code === secretCode ? (
              <>
                <Icon name="check" size={15} />
                <span>Coupon Active in Bag</span>
              </>
            ) : (
              <>
                <span>Auto-Apply to Bag</span>
                <Icon name="arrow" size={14} />
              </>
            )}
          </button>
          <small className="coupon-terms">Valid on all 5 featured bedsheet designs · Direct from loom</small>
        </div>
      </div>

      <div className="catalog-toolbar">
        <span>Curated collection of 5 best offers</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#686d51' }}>
          <Icon name="shield" size={14} />
          <span>Factory direct · Inspected in-house</span>
        </div>
      </div>

      <div className="catalog-layout">
        <div className="catalog-results">
          <ProductGrid
            list={offerProducts}
            onAdd={onAdd}
            wishlist={wishlist}
            onWish={onWish}
            onQuick={onQuick}
            navigate={navigate}
          />
        </div>
      </div>
    </div>
  );
}

export default BestOffersPage;
