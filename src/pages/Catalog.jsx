import React, { useState, useMemo } from 'react';
import { Icon } from '../components/common/Icon.jsx';
import { ProductGrid } from '../components/ProductGrid.jsx';

export function Catalog({
  title,
  subtitle,
  list = [],
  onAdd,
  wishlist,
  onWish,
  onQuick,
  navigate,
  emptyTitle = 'A little quiet here.',
}) {
  const [sort, setSort] = useState('Featured');
  const sorted = useMemo(
    () =>
      [...list].sort((a, b) =>
        sort === 'Price: low to high' ? a.price - b.price : sort === 'Price: high to low' ? b.price - a.price : 0
      ),
    [list, sort]
  );

  return (
    <div className="catalog-page">
      <div className="breadcrumbs">
        <button onClick={() => navigate('/')}>Home</button>
        <span>/</span>
        <span>{title}</span>
      </div>
      <div className="catalog-heading">
        <div>
          <span className="eyebrow">COMFORT, CONSIDERED</span>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        <div className="catalog-count">
          {list.length} pieces
          <br />
          <span>to make a home</span>
        </div>
      </div>
      <div className="catalog-toolbar">
        <span>{sorted.length} pieces by Aanur Textile</span>
        <div>
          <label className="sort-control">
            Sort by{' '}
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option>Featured</option>
              <option>Price: low to high</option>
              <option>Price: high to low</option>
            </select>
          </label>
        </div>
      </div>
      <div className="catalog-layout">
        <div className="catalog-results">
          {sorted.length ? (
            <ProductGrid
              list={sorted}
              onAdd={onAdd}
              wishlist={wishlist}
              onWish={onWish}
              onQuick={onQuick}
              navigate={navigate}
            />
          ) : (
            <div className="empty-state catalog-empty">
              <div className="empty-art">
                <Icon name="search" size={34} />
              </div>
              <h2>{emptyTitle}</h2>
              <p>We couldn't find a match this time. Try another search or browse our full collection.</p>
              <button className="button button-dark" onClick={() => navigate('/shop')}>
                Explore everything <Icon name="arrow" size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Catalog;
