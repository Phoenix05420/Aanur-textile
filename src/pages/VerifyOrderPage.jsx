import React, { useState, useEffect } from 'react';
import { apiUrl } from '../api.js';
import { Icon } from '../components/common/Icon.jsx';

export function VerifyOrderPage({ navigate, setToast }) {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');

  const params = new URLSearchParams(window.location.search);
  const orderRef = params.get('orderRef') || '';
  const token = params.get('token') || '';

  useEffect(() => {
    if (!orderRef) {
      setError('No order reference specified.');
      setLoading(false);
      return;
    }

    fetch(apiUrl(`/api/orders/verify?orderRef=${encodeURIComponent(orderRef)}&token=${encodeURIComponent(token)}`))
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.success) {
          setStatus(data);
          if (setToast) setToast(`Order #${orderRef} successfully confirmed!`);
        } else {
          return fetch(apiUrl(`/api/orders/status/${encodeURIComponent(orderRef)}`))
            .then((res) => res.json())
            .then((stat) => {
              if (stat.success) {
                setStatus(stat);
              } else {
                setError(data.error || 'Failed to verify order.');
              }
            });
        }
      })
      .catch(() => {
        setLoading(false);
        setError('Network error verifying order.');
      });
  }, [orderRef, token, setToast]);

  return (
    <div className="page-pad verify-order-page" style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center' }}>
      {loading ? (
        <div className="empty-state">
          <div className="empty-art">
            <Icon name="refresh" size={35} />
          </div>
          <h2>Verifying Your Order...</h2>
          <p>Connecting with our Nathakadaiyur loom management system...</p>
        </div>
      ) : error ? (
        <div className="empty-state">
          <div className="empty-art">
            <Icon name="close" size={35} />
          </div>
          <h2>Verification Notice</h2>
          <p>{error}</p>
          <button className="button button-dark" onClick={() => navigate('/orders')}>
            View Your Orders
          </button>
        </div>
      ) : (
        <div
          className="order-verified-card"
          style={{
            background: '#fff',
            borderRadius: '16px',
            border: '1px solid #e6ded3',
            padding: '36px 28px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#eaf5eb',
              color: '#2e7d32',
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto 20px',
            }}
          >
            <Icon name="check" size={36} />
          </div>
          <span className="eyebrow" style={{ color: '#2e7d32', fontWeight: 700 }}>
            ORDER VERIFIED & CONFIRMED
          </span>
          <h1 style={{ fontSize: '28px', margin: '8px 0 12px' }}>Order #{orderRef} Confirmed!</h1>
          <p style={{ color: '#666', fontSize: '15px', lineHeight: 1.5, marginBottom: '24px' }}>
            Thank you for confirming your order! Your pure cotton bedsheets are scheduled for priority loom weaving and
            factory-direct dispatch from our workshop in Nathakadaiyur, Tamil Nadu.
          </p>

          <div
            style={{
              background: '#fbf9f5',
              border: '1px solid #eee5da',
              borderRadius: '10px',
              padding: '16px',
              marginBottom: '24px',
              textAlign: 'left',
              fontSize: '13.5px',
              lineHeight: 1.6,
            }}
          >
            <div>
              <strong>Status:</strong>{' '}
              <span style={{ color: '#2e7d32', fontWeight: 600 }}>✓ Verified & Scheduled for Dispatch</span>
            </div>
            <div>
              <strong>Doorstep Delivery:</strong> 7 to 14 days across India
            </div>
            <div>
              <strong>Workshop:</strong> Aanur Textile · Nathakadaiyur, Tamil Nadu
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="button button-dark" onClick={() => navigate('/orders')}>
              View in My Orders <Icon name="arrow" size={15} />
            </button>
            <button className="button button-outline" onClick={() => navigate('/shop')}>
              Browse Collections
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VerifyOrderPage;
