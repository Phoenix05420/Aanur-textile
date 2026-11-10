import React from 'react';
import { store } from '../data.js';
import { apiUrl } from '../api.js';
import { Icon } from '../components/common/Icon.jsx';

export function ContactPage({ setToast }) {
  return (
    <div className="contact-page">
      <div className="contact-intro">
        <span className="eyebrow">TALK DIRECTLY WITH THE MAKER</span>
        <h1>
          Say hello to
          <br />
          <em>Aanur Textile.</em>
        </h1>
        <p>For household orders, wholesale supply, or hotel and hospital requirements, get in touch with the factory team.</p>
        <div className="contact-method">
          <Icon name="user" />
          <span>
            <strong>Founder & Managing Director</strong>
            <small>{store.founder}</small>
          </span>
        </div>
        <div className="contact-method">
          <Icon name="phone" />
          <span>
            <strong>Call the factory</strong>
            <small>
              <a href={store.phone}>{store.phoneDisplay}</a>
            </small>
          </span>
        </div>
        <div className="contact-method">
          <Icon name="mail" />
          <span>
            <strong>Official email</strong>
            <small>
              <a href={`mailto:${store.email}`}>{store.email}</a>
            </small>
          </span>
        </div>
        <div className="contact-method">
          <Icon name="truck" />
          <span>
            <strong>Delivery timeframe</strong>
            <small>Doorstep delivery in 7 to 14 days across India</small>
          </span>
        </div>
        <div className="contact-method">
          <Icon name="pin" />
          <span>
            <strong>Manufacturing address</strong>
            <small>{store.address}</small>
          </span>
        </div>
        <div className="contact-method">
          <Icon name="star" />
          <span>
            <strong>Working hours</strong>
            <small>{store.hours}</small>
          </span>
        </div>
        <div className="contact-actions">
          <a className="button button-dark" href={store.phone}>
            Call the factory <Icon name="arrow" size={16} />
          </a>
          <a className="button button-outline" href={store.map} target="_blank" rel="noreferrer">
            Open in Maps <Icon name="arrow" size={16} />
          </a>
        </div>
      </div>
      <form
        className="contact-form"
        onSubmit={(event) => {
          event.preventDefault();
          const form = event.currentTarget;
          const data = Object.fromEntries(new FormData(form));
          fetch(apiUrl('/api/enquiries'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          }).catch((err) => {
            console.warn('Enquiry submission network issue:', err);
          });
          form.reset();
          setToast('Thank you! Your message has been received. We will get in touch with you promptly.');
        }}
      >
        <label>
          Your name
          <input name="name" required placeholder="Name" />
        </label>
        <label>
          Email address
          <input name="email" required type="email" placeholder="you@example.com" />
        </label>
        <label>
          What can we help with?
          <select name="topic" defaultValue="">
            <option value="" disabled>
              Choose a topic
            </option>
            <option>Household order</option>
            <option>Wholesale supply</option>
            <option>Hotel or hospital order</option>
            <option>Bedsheet enquiry</option>
            <option>Something else</option>
          </select>
        </label>
        <label>
          Your note
          <textarea name="message" required rows="5" placeholder="Tell us what you need..." />
        </label>
        <button className="button button-dark">
          Send enquiry <Icon name="arrow" size={16} />
        </button>
        <p className="contact-form-note">
          You can also call us directly at {store.phoneDisplay} or email {store.email}.
        </p>
      </form>
    </div>
  );
}

export default ContactPage;
