import React from 'react';
import { store } from '../data.js';
import { Icon } from './common/Icon.jsx';

export function Footer({ navigate }) {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <a
            className="wordmark"
            href="/"
            onClick={(event) => {
              event.preventDefault();
              navigate('/');
            }}
          >
            <span>
              Aanur <i>Textile</i>
            </span>
            <small>COMFORT, CONSIDERED.</small>
          </a>
          <p>
            Home textiles made by Aanur Textile
            <br />
            in Nathakadaiyur, Tamil Nadu.
            <br />
            <small style={{ opacity: 0.85, display: 'block', marginTop: '0.4rem' }}>
              Doorstep delivery in 7 to 14 days
            </small>
          </p>
          <a className="social-link" href={store.phone} aria-label="Call Aanur Textile">
            <Icon name="phone" />
          </a>
        </div>
        <div className="footer-links">
          <div>
            <h3>Find your comfort</h3>
            <button onClick={() => navigate('/shop')}>Collections</button>
            <button onClick={() => navigate('/category/Bedsheets')}>Bedsheets</button>
            <button onClick={() => navigate('/sale')}>Best offers</button>
          </div>
          <div>
            <h3>The useful bits</h3>
            <button onClick={() => navigate('/login')}>Sign In / Register</button>
            <button onClick={() => navigate('/account')}>Your account</button>
            <button onClick={() => navigate('/orders')}>Track orders</button>
            <button onClick={() => navigate('/contact')}>Contact the maker</button>
            <button onClick={() => navigate('/faq')}>FAQs & Delivery</button>
            <button onClick={() => navigate('/admin')} style={{ color: '#8B1E0F', fontWeight: 600 }}>
              Admin Portal
            </button>
          </div>
          <div>
            <h3>A little more</h3>
            <button onClick={() => navigate('/about')}>Our story</button>
            <button onClick={() => navigate('/wishlist')}>Saved pieces</button>
            <button onClick={() => navigate('/contact')}>Wholesale enquiries</button>
          </div>
        </div>
        <div className="footer-news">
          <span className="eyebrow">AANUR TEXTILE · EST. 2013</span>
          <h3>
            Made by skilled
            <br />
            local hands.
          </h3>
          <p>
            {store.artisans} artisans in Nathakadaiyur. Factory-direct household, wholesale, hotel, and hospital orders
            welcome. Delivery in 7 to 14 days.
          </p>
          <a className="text-link" href={store.phone}>
            Call {store.phoneDisplay} <Icon name="arrow" size={15} />
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Aanur Textile, Nathakadaiyur.</span>
        <span>{store.address} · Delivery: 7 to 14 days</span>
        <div>
          <a href={store.map} target="_blank" rel="noreferrer">
            Find us
          </a>
          <a href={`mailto:${store.email}`}>Email</a>
          <a href={store.phone}>Call</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
