import React, { useState, useEffect } from 'react';
import { store } from '../data.js';
import { money } from '../utils/format.js';
import { Icon } from '../components/common/Icon.jsx';
import { SectionTitle } from '../components/SectionTitle.jsx';
import { ProductGrid } from '../components/ProductGrid.jsx';
import { getProductImages, getVariantImage } from '../utils/product.js';

export function ProductDetail({ product, onAdd, onWish, wished, navigate, allProducts = [] }) {
  const images = getProductImages(product);
  const [activeSlide, setActiveSlide] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState(product.sizes?.[0] || 'Standard');
  const [color, setColor] = useState(0);

  useEffect(() => {
    setActiveSlide(0);
    setColor(0);
  }, [product.id]);

  const goToSlide = (index) => {
    const valid = (index + images.length) % images.length;
    setActiveSlide(valid);
    if (product.colors && product.colors[valid] !== undefined) {
      setColor(valid);
    }
  };

  const handleColorSelect = (index) => {
    setColor(index);
    if (images[index]) {
      setActiveSlide(index);
    }
  };

  const nextSlide = () => goToSlide(activeSlide + 1);
  const prevSlide = () => goToSlide(activeSlide - 1);

  const currentImage = getVariantImage(product, activeSlide);

  return (
    <div className="pdp-page">
      <div className="breadcrumbs">
        <button onClick={() => navigate('/')}>Home</button>
        <span>/</span>
        <button onClick={() => navigate('/shop')}>Shop</button>
        <span>/</span>
        <span>{product.name}</span>
      </div>
      <div className="pdp-layout">
        <div className="gallery-layout">
          <div className="gallery-thumbs" role="tablist" aria-label="Product thumbnails">
            {images.map((imgSrc, idx) => (
              <button
                key={idx}
                type="button"
                className={activeSlide === idx ? 'selected' : ''}
                aria-label={`View photo ${idx + 1}: ${product.colorNames?.[idx] || ''}`}
                onClick={() => goToSlide(idx)}
              >
                <img src={imgSrc} alt={`${product.name} ${product.colorNames?.[idx] || ''}`} />
              </button>
            ))}
          </div>
          <div className="gallery-main">
            <div className="gallery-slide-wrap">
              <img
                src={currentImage}
                alt={`${product.name} - ${product.colorNames?.[color] || ''}`}
                className="gallery-slide-img"
                key={currentImage}
              />
              {product.badge && <span className="product-badge">{product.badge}</span>}
              {product.colorNames?.[activeSlide] && (
                <div className="slider-variant-pill" title={`Fabric Color: ${product.colorNames[activeSlide]}`}>
                  <span
                    className="slider-variant-dot"
                    style={{ backgroundColor: product.colors?.[activeSlide] || '#666' }}
                  />
                  <span>{product.colorNames[activeSlide]}</span>
                </div>
              )}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    className="slider-arrow slider-prev"
                    onClick={prevSlide}
                    aria-label="Previous photo"
                  >
                    <Icon name="arrow" size={17} style={{ transform: 'rotate(180deg)' }} />
                  </button>
                  <button
                    type="button"
                    className="slider-arrow slider-next"
                    onClick={nextSlide}
                    aria-label="Next photo"
                  >
                    <Icon name="arrow" size={17} />
                  </button>
                  <div className="slider-dots">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`slider-dot ${activeSlide === idx ? 'active' : ''}`}
                        onClick={() => goToSlide(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                  <div className="slider-counter">
                    {activeSlide + 1} / {images.length}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="pdp-copy">
          <span className="eyebrow">MADE BY AANUR TEXTILE</span>
          <h1>{product.name}</h1>
          <div className="pdp-price">
            <strong>{money(product.price)}</strong>
            {product.originalPrice > product.price && (
              <>
                <del>{money(product.originalPrice)}</del>
                <span>{Math.round((1 - product.price / product.originalPrice) * 100)}% off</span>
              </>
            )}
          </div>
          <p className="pdp-description">{product.description}</p>
          <div className="variant-details-block">
            <div className="variant-header">
              <span className="option-label" style={{ margin: 0 }}>
                Color: <strong>{product.colorNames?.[color] || `Variant ${color + 1}`}</strong>
              </span>
            </div>

            <div className="color-options" style={{ marginTop: '8px' }}>
              {product.colors?.map((shade, index) => (
                <button
                  key={shade}
                  type="button"
                  style={{ '--swatch-color': shade }}
                  className={`color-swatch-btn ${color === index ? 'selected' : ''}`}
                  onClick={() => handleColorSelect(index)}
                  title={product.colorNames?.[index] || `Color ${index + 1}`}
                  aria-label={`Choose ${product.colorNames?.[index] || `color ${index + 1}`}`}
                  aria-pressed={color === index}
                />
              ))}
            </div>

            {product.colors && product.colors.length > 0 && (
              <div className="variant-cards-list" role="radiogroup" aria-label="Available color variants">
                {product.colors.map((shade, index) => {
                  const vName = product.colorNames?.[index] || `Variant ${index + 1}`;
                  const vImg = images[index] || product.image;
                  const isSelected = color === index;
                  return (
                    <button
                      key={index}
                      type="button"
                      className={`variant-card-tile ${isSelected ? 'active' : ''}`}
                      onClick={() => handleColorSelect(index)}
                      role="radio"
                      aria-checked={isSelected}
                      title={`Click to view ${vName} photo`}
                    >
                      <img src={vImg} alt={vName} className="variant-tile-thumb" />
                      <div className="variant-tile-info">
                        <div className="variant-tile-name-row">
                          <span className="variant-tile-dot" style={{ backgroundColor: shade }} />
                          <strong>{vName}</strong>
                        </div>
                      </div>
                      {isSelected ? (
                        <span className="variant-selected-badge">
                          <Icon name="check" size={12} /> Active
                        </span>
                      ) : (
                        <span className="variant-view-action">View photo</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <div className="option-block">
            <span className="option-label">Size</span>
            <div className="size-options">
              {product.sizes?.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={size === item ? 'selected' : ''}
                  onClick={() => setSize(item)}
                  aria-pressed={size === item}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="purchase-row">
            <div className="quantity-selector">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Icon name="minus" size={15} />
              </button>
              <span>{quantity}</span>
              <button type="button" aria-label="Increase quantity" onClick={() => setQuantity(quantity + 1)}>
                <Icon name="plus" size={15} />
              </button>
            </div>
            <button
              type="button"
              className="button button-dark add-to-bag"
              onClick={() => onAdd(product, quantity, { size, colorIndex: color, variantImage: currentImage })}
            >
              Add to bag <Icon name="bag" size={18} />
            </button>
            <button
              type="button"
              className={`pdp-wish ${wished ? 'is-wished' : ''}`}
              aria-label={wished ? 'Remove from wishlist' : 'Save to wishlist'}
              aria-pressed={wished}
              onClick={() => onWish(product.id)}
            >
              <Icon name="heart" />
            </button>
          </div>
          <button
            type="button"
            className="button button-terracotta full-width buy-now"
            onClick={() => {
              onAdd(product, quantity, { size, colorIndex: color, variantImage: currentImage });
              navigate('/checkout');
            }}
          >
            Buy it now <Icon name="arrow" size={17} />
          </button>
          <div className="delivery-note">
            <Icon name="truck" size={19} />
            <span>
              <strong>Doorstep delivery in 7 to 14 days.</strong>
              <small>Factory-direct from Aanur Textile, Kangayam · Tiruppur</small>
            </span>
          </div>
          <div className="pdp-promises">
            <span>
              <Icon name="truck" size={16} /> Delivery: 7–14 days
            </span>
            <span>
              <Icon name="shield" size={16} /> In-house quality inspected
            </span>
          </div>
          <details className="pdp-detail">
            <summary>
              Details & materials <Icon name="chevron" size={16} />
            </summary>
            <p>
              {product.description} Made in {product.material?.toLowerCase() || 'cotton'}. Bedsheet designs are listed in Queen
              and King sizes.
            </p>
          </details>
          <details className="pdp-detail">
            <summary>
              About the maker <Icon name="chevron" size={16} />
            </summary>
            <p>
              Aanur Textile was founded by {store.founder} in Nathakadaiyur in 2013. The local workshop brings together more
              than 20 skilled artisans.
            </p>
          </details>
        </div>
      </div>
      <section className="pdp-reviews">
        <span className="eyebrow">MADE BY AANUR TEXTILE · NATHAKADAIYUR</span>
        <h2>Thoughtful textiles, made by skilled local hands.</h2>
        <p>
          {store.yearsExperience}+ years of textile craftsmanship · {store.artisans} local artisans · Inspected in-house
        </p>
        <button className="text-link" onClick={() => navigate('/about')}>
          Meet the maker <Icon name="arrow" size={15} />
        </button>
      </section>
      <div className="section-wrap related-products">
        <SectionTitle
          eyebrow="More from the collection"
          title="More bedsheet designs."
          link={{ label: 'Shop the collection', to: '/shop' }}
          navigate={navigate}
        />
        <ProductGrid
          list={allProducts.filter((item) => item.id !== product.id).slice(0, 4)}
          onAdd={onAdd}
          wishlist={[]}
          onWish={() => {}}
          onQuick={(item) => navigate(`/product/${item.id}`)}
        />
      </div>
    </div>
  );
}

export default ProductDetail;
