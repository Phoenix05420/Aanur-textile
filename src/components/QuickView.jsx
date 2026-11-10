import React, { useState, useEffect, useRef } from 'react';
import { money } from '../utils/format.js';
import { Icon } from './common/Icon.jsx';
import { getProductImages, getVariantImage } from '../utils/product.js';

export function QuickView({ product, initialVariant = 0, onClose, onAdd, onDetails }) {
  const dialogRef = useRef(null);
  const images = getProductImages(product);
  const [activeSlide, setActiveSlide] = useState(initialVariant || 0);
  const [color, setColor] = useState(initialVariant || 0);

  const handleColorSelect = (index) => {
    setColor(index);
    if (images[index]) setActiveSlide(index);
  };

  const nextSlide = () => {
    const next = (activeSlide + 1) % images.length;
    setActiveSlide(next);
    if (product.colors && product.colors[next] !== undefined) setColor(next);
  };

  const prevSlide = () => {
    const prev = (activeSlide - 1 + images.length) % images.length;
    setActiveSlide(prev);
    if (product.colors && product.colors[prev] !== undefined) setColor(prev);
  };

  const currentImage = getVariantImage(product, activeSlide);

  useEffect(() => {
    const previous = document.activeElement;
    dialogRef.current?.focus();
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') nextSlide();
      if (event.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      previous?.focus?.();
    };
  }, [onClose, activeSlide]);

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="quick-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-title"
        tabIndex="-1"
        ref={dialogRef}
      >
        <button className="modal-close" aria-label="Close quick view" onClick={onClose}>
          <Icon name="close" />
        </button>
        <div className="quick-modal-media">
          <img src={currentImage} alt={`${product.name} ${product.colorNames?.[color] || ''}`} />
          {product.colorNames?.[activeSlide] && (
            <div className="slider-variant-pill" style={{ top: '10px', right: '10px' }}>
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
                aria-label="Previous image"
              >
                <Icon name="arrow" size={16} style={{ transform: 'rotate(180deg)' }} />
              </button>
              <button
                type="button"
                className="slider-arrow slider-next"
                onClick={nextSlide}
                aria-label="Next image"
              >
                <Icon name="arrow" size={16} />
              </button>
              <div className="slider-dots">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`slider-dot ${activeSlide === idx ? 'active' : ''}`}
                    onClick={() => {
                      setActiveSlide(idx);
                      setColor(idx);
                    }}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div className="quick-modal-copy">
          <span className="eyebrow">MADE BY AANUR TEXTILE</span>
          <h2 id="quick-title">{product.name}</h2>
          <div className="product-prices">
            <strong>{money(product.price)}</strong>
            {product.originalPrice > product.price && <del>{money(product.originalPrice)}</del>}
          </div>
          <p>{product.description}</p>
          <div className="option-block">
            <span className="option-label">
              Color: <strong>{product.colorNames?.[color] || `Variant ${color + 1}`}</strong>
            </span>
            <div className="color-options">
              {product.colors.map((shade, index) => (
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
          </div>
          <button
            className="button button-dark full-width"
            onClick={() => {
              onAdd(product, 1, { colorIndex: color, variantImage: currentImage });
              onClose();
            }}
          >
            Add to bag <Icon name="bag" size={17} />
          </button>
          <button className="text-link" onClick={() => onDetails(product.id)}>
            Take a closer look <Icon name="arrow" size={15} />
          </button>
        </div>
      </section>
    </div>
  );
}

export default QuickView;
