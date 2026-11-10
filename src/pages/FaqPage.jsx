import React from 'react';
import { store } from '../data.js';
import { Icon } from '../components/common/Icon.jsx';

export function FaqPage() {
  const questions = [
    [
      'Where are your textiles made?',
      'Bedsheets are made at Aanur Textile’s workshop in Nathakadaiyur, Kangayam, in the Tiruppur district of Tamil Nadu.',
    ],
    [
      'How long does delivery take?',
      'Doorstep delivery takes 7 to 14 days across India. All bedsheets are packed and shipped factory-direct from our workshop in Nathakadaiyur.',
    ],
    [
      'What bedsheet designs and sizes are available?',
      'The collection includes five designs in cotton and polyester blends. The manufacturer lists Queen and King sizes; contact the factory to confirm which colors are currently available.',
    ],
    [
      'Can I enquire about wholesale or bulk orders?',
      `Yes. Aanur Textile welcomes wholesale and retail distribution enquiries, as well as hotel and hospital orders. Call the factory directly at ${store.phoneDisplay} or email ${store.email}.`,
    ],
    [
      'What payment methods do you accept?',
      'We accept Cash on Delivery (COD) as well as direct UPI/bank transfer. Delivery is completed within 7 to 14 days.',
    ],
    [
      'How do I find the factory?',
      `The manufacturing address is ${store.address}. Use the Maps link on the contact page for directions.`,
    ],
    ['When can I contact the team?', `The listed working hours are ${store.hours}.`],
  ];

  return (
    <div className="faq-page page-pad">
      <div className="faq-intro">
        <span className="eyebrow">THE LITTLE DETAILS</span>
        <h1>
          Good questions.
          <br />
          <em>Kind answers.</em>
        </h1>
        <p>Everything to know about the Aanur Textile collection and delivery.</p>
      </div>
      <div className="faq-list">
        {questions.map(([question, answer]) => (
          <details key={question}>
            <summary>
              {question}
              <Icon name="plus" size={18} />
            </summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
      <div className="faq-help">
        <Icon name="mail" />
        <span>
          <strong>Want to ask the maker directly?</strong>
          <small>Call or email the Aanur Textile team.</small>
        </span>
        <a href={store.phone}>
          Call {store.phoneDisplay} <Icon name="arrow" size={15} />
        </a>
      </div>
    </div>
  );
}

export default FaqPage;
