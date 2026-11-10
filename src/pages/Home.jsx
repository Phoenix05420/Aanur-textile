import React from 'react';
import { categories, store } from '../data.js';
import { Icon } from '../components/common/Icon.jsx';
import { SectionTitle } from '../components/SectionTitle.jsx';
import { ProductGrid } from '../components/ProductGrid.jsx';

export function Home({ navigate, products: all = [], onAdd, wishlist, onWish, onQuick }) {
  const featured = all.slice(0, 4);

  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <span className="hero-kicker">
            <span className="tiny-sun" /> AANUR TEXTILE · EST. 2013
          </span>
          <h1>
            Sleep better.
            <br />
            <em>Live softer.</em>
          </h1>
          <p>Thoughtfully woven bedsheets, made with local textile craftsmanship in Nathakadaiyur.</p>
          <div className="hero-actions">
            <button className="button button-dark" onClick={() => navigate('/shop')}>
              Shop the collection <Icon name="arrow" size={17} />
            </button>
            <button className="button button-light" onClick={() => navigate('/about')}>
              Our story
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-photo">
            <img src="/products/p01/variant-1.jpeg" alt="Signature check bedsheet from the Aanur Textile collection" />
          </div>
          <div className="hero-caption">
            <span>THE SLOW LIVING EDIT</span>
            <span>01 — 06</span>
          </div>
          <div className="hero-note">
            <span className="note-mark">d.</span>
            <span>
              Softness you
              <br />
              can come home to.
            </span>
          </div>
        </div>
      </section>

      <div className="trust-strip">
        <div>
          <Icon name="leaf" />
          <span>100% Pure cotton & rich blends</span>
        </div>
        <div>
          <Icon name="truck" />
          <span>Doorstep delivery in 7 to 14 days</span>
        </div>
        <div>
          <Icon name="shield" />
          <span>In-house quality inspected</span>
        </div>
        <div>
          <Icon name="star" />
          <span>Crafting textiles since 2013</span>
        </div>
      </div>

      <section className="section-wrap category-section">
        <SectionTitle
          eyebrow="Made close to home"
          title="Everyday textiles, made with care."
          copy="Thoughtful bedsheets, made by Aanur Textile in Nathakadaiyur."
          link={{ label: 'Explore the collection', to: '/shop' }}
          navigate={navigate}
        />
        <div className="category-grid">
          {categories.map((category, index) => (
            <button
              className={`category-card category-card-${index + 1}`}
              key={category.name}
              onClick={() => navigate(`/category/${category.name}`)}
            >
              <img src={category.image} alt="" loading="lazy" />
              <span className="category-shade" />
              <span className="category-copy">
                <span>{category.count} designs</span>
                <strong>{category.name}</strong>
                <span className="category-link">
                  Discover <Icon name="arrow" size={16} />
                </span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="section-wrap bestsellers-section">
        <SectionTitle
          eyebrow="From the Aanur Textile collection"
          title="Comfort for the everyday."
          copy="Six bedsheet designs, made by the team in Nathakadaiyur."
          link={{ label: 'Shop the collection', to: '/shop' }}
          navigate={navigate}
        />
        <ProductGrid
          list={featured}
          onAdd={onAdd}
          wishlist={wishlist}
          onWish={onWish}
          onQuick={onQuick}
          navigate={navigate}
        />
      </section>

      <section className="editorial-band">
        <div className="editorial-image">
          <img src="/products/p03/variant-1.jpeg" alt="Geometric grid woven cotton bed set" loading="lazy" />
        </div>
        <div className="editorial-copy">
          <span className="eyebrow">A better kind of everyday</span>
          <h2>
            Made for the way you <em>really</em> live.
          </h2>
          <p>
            Soft enough to stay in bed a little longer. Thoughtful enough to feel good in every way. These are comforts made
            to be used, loved, and lived in.
          </p>
          <button className="button button-outline" onClick={() => navigate('/about')}>
            A little about us <Icon name="arrow" size={17} />
          </button>
        </div>
      </section>

      <section className="section-wrap story-section">
        <div className="story-layout">
          <div className="story-sticky">
            <span className="eyebrow">The feeling of home</span>
            <h2>
              Small comforts.
              <br />
              <em>Big exhale.</em>
            </h2>
            <p>For the early risers, the one-more-chapter readers, and the people who find their best ideas in bed.</p>
            <button className="text-link" onClick={() => navigate('/shop')}>
              Come on in <Icon name="arrow" size={16} />
            </button>
          </div>
          <div className="story-visual">
            <img src="/products/p04/variant-1.jpeg" alt="A colorful bed made with Rustic Earth Stripe bedsheet" loading="lazy" />
            <div className="story-caption story-copy">“Your home should feel like a deep breath.”</div>
            <div className="story-side-note">DESIGNED TO BE LIVED IN · SINCE DAY ONE</div>
          </div>
        </div>
      </section>

      <section className="review-section">
        <div className="review-inner">
          <span className="eyebrow">A little more about our making</span>
          <div className="review-stars">EST. 2013 · TIRUPPUR, TAMIL NADU</div>
          <blockquote>“From village tailoring to everyday bedsheets, made with care in Nathakadaiyur.”</blockquote>
          <div className="review-author">
            <span className="author-dot">A</span>
            <span>
              <strong>Aanur Textile</strong>
              <small>Founded by {store.founder} · Kangayam</small>
            </span>
          </div>
          <div className="review-controls">
            <button className="text-link" onClick={() => navigate('/about')}>
              Our story <Icon name="arrow" size={15} />
            </button>
          </div>
        </div>
        <div className="review-image">
          <img src="/products/p02/variant-1.jpeg" alt="Heritage plaid bedding made by Aanur Textile" loading="lazy" />
        </div>
      </section>

      <section className="promo-banner">
        <div>
          <span className="eyebrow">FROM NATHAKADAIYUR, WITH CARE</span>
          <h2>
            Made by many
            <br />
            <em>skilled hands.</em>
          </h2>
          <p>
            More than 20 local artisans bring Aanur Textile’s bedsheets to life in a pioneering village manufacturing hub.
          </p>
          <button className="button button-light" onClick={() => navigate('/about')}>
            Meet the maker <Icon name="arrow" size={16} />
          </button>
        </div>
        <span className="promo-scribble">
          since
          <br />
          2013
        </span>
      </section>

      <section className="section-wrap instagram-section">
        <div className="instagram-head">
          <div>
            <span className="eyebrow">THE COLLECTION · MADE IN TIRUPPUR</span>
            <h2>Woven for everyday.</h2>
          </div>
          <button className="text-link" onClick={() => navigate('/shop')}>
            Shop bedsheets <Icon name="arrow" size={15} />
          </button>
        </div>
        <div className="instagram-grid">
          {['p01', 'p02', 'p03', 'p05'].map((id) => (
            <button key={id} onClick={() => navigate(`/product/${id}`)}>
              <img src={`/products/${id}/variant-1.jpeg`} alt="Bedsheet design from Aanur Textile" loading="lazy" />
              <span>↗</span>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}

export default Home;
