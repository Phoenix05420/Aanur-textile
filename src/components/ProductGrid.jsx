import React from 'react';
import { ProductCard } from './ProductCard.jsx';

export function ProductGrid({ list, onAdd, wishlist, onWish, onQuick, navigate }) {
  return (
    <div className="product-grid">
      {list.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAdd={onAdd}
          wishlist={wishlist}
          onWish={onWish}
          onQuick={onQuick}
          navigate={navigate}
        />
      ))}
    </div>
  );
}

export default ProductGrid;
