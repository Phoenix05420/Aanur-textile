import React from 'react';
import { store } from '../data.js';
import { Icon } from '../components/common/Icon.jsx';

export function AboutPage({ navigate }) {
  return (
    <div className="about-page">
      <section className="about-hero">
        <span className="eyebrow">AANUR TEXTILE · NATHAKADAIYUR</span>
        <h1>
          Made with care.
          <br />
          <em>Made close to home.</em>
        </h1>
        <p>A village workshop, a skilled local team, and everyday bedsheets made in Nathakadaiyur.</p>
      </section>
      <div className="about-photo">
        <img src="/products/red-check-bedding.jpg" alt="Red and cream check bedsheet made by Aanur Textile" />
      </div>
      <section className="about-statement">
        <span className="eyebrow">A TEXTILE STORY, SINCE 2013</span>
        <h2>
          From village tailoring to <em>home textiles.</em>
        </h2>
        <p>
          Founded by {store.founder} in Nathakadaiyur, Aanur Textile began as one of the village’s early garment-making
          workshops, stitching durable shorts, trousers, and pants.
        </p>
        <p>
          Over the years, the team invested in machinery and artisan training, growing into a maker of cotton and
          polyester-blend bedsheets. Today, more than 20 local workers bring their skill to the work, with pieces inspected
          in-house before dispatch.
        </p>
        <button className="button button-dark" onClick={() => navigate('/shop')}>
          Browse the collection <Icon name="arrow" />
        </button>
      </section>
      <div className="about-values">
        {[
          ['A local team', 'More than 20 skilled local artisans make up the Aanur Textile team.'],
          ['Textiles made in-house', 'Bedsheets made in Nathakadaiyur, Tiruppur.'],
          ['Factory-direct contact', 'Ask the maker directly about household, wholesale, or hotel and hospital orders.'],
        ].map(([title, copy]) => (
          <article key={title}>
            <Icon name="leaf" />
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export default AboutPage;
