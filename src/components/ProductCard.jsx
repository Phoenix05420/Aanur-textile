import React, { useState } from 'react';
import { money } from '../utils/format.js';
import { Icon } from './common/Icon.jsx';
import { getVariantImage } from '../utils/product.js';

export function ProductCard({ product, onAdd, wishlist, onWish, onQuick, navigate }) {
  const isWished = wishlist.includes(product.id);
  const [activeVariant, setActiveVariant] = useState(0);
  const currentImage = getVariantImage(product, activeVariant);

  const handleCardClick = () => {
    if (navigate) {
      navigate(`/product/${product.id}`);
    } else {
      onQuick({ product, initialVariant: activeVariant });
    }
  };

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <button className="product-image-button" aria-label={`View ${product.name}`} onClick={handleCardClick}>
          <img src={currentImage} alt={product.name} loading="lazy" />
        </button>
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <button
          className={`wish-button ${isWished ? 'is-wished' : ''}`}
          aria-label={isWished ? `Remove ${product.name} from wishlist` : `Save ${product.name}`}
          aria-pressed={isWished}
          onClick={() => onWish(product.id)}
        >
          <Icon name="heart" size={19} />
        </button>
        <button className="quick-view" onClick={() => onQuick({ product, initialVariant: activeVariant })}>
          Quick view <Icon name="arrow" size={15} />
        </button>
      </div>
      <div className="product-info">
        <div className="product-title-line">
          <button className="product-name" onClick={handleCardClick}>
            {product.name}
          </button>
        </div>
        <p className="product-description">{product.description}</p>
        <div className="product-meta">
          <div className="product-prices">
            <strong>{money(product.price)}</strong>
            {product.originalPrice > product.price && <del>{money(product.originalPrice)}</del>}
          </div>
          {product.originalPrice > product.price && (
            <span className="discount">
              {Math.round((1 - product.price / product.originalPrice) * 100)}% off
            </span>
          )}
        </div>
        <div className="product-card-bottom">
          <div className="swatches" aria-label={`${product.colors?.length || 0} colors`}>
            {product.colors?.map((color, index) => (
              <button
                key={color}
                type="button"
                className={`card-swatch-dot ${activeVariant === index ? 'active' : ''}`}
                style={{ backgroundColor: color }}
                title={product.colorNames?.[index] || `Color ${index + 1}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveVariant(index);
                }}
                onMouseEnter={() => setActiveVariant(index)}
                aria-label={product.colorNames?.[index] || `Color ${index + 1}`}
              />
            ))}
          </div>
          <button
            className="mini-add"
            onClick={() => onAdd(product, 1, { colorIndex: activeVariant, variantImage: currentImage })}
            aria-label={`Add ${product.name} to bag`}
          >
            <Icon name="plus" size={17} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
