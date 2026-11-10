import React from 'react';
import { Icon } from '../components/common/Icon.jsx';
import { ProductGrid } from '../components/ProductGrid.jsx';

export function WishlistPage({ wishlist = [], onWish, onAdd, navigate, products = [] }) {
  const items = products.filter((item) => wishlist.includes(item.id));

  return (
    <div className="page-pad">
      <div className="page-heading">
        <div>
          <span className="eyebrow">SAVED FOR A SOFTER DAY</span>
          <h1>Your little list.</h1>
          <p>All the things you’ve had your eye on, in one lovely place.</p>
        </div>
        <span className="saved-count">{items.length} pieces saved</span>
      </div>
      {items.length ? (
        <ProductGrid
          list={items}
          onAdd={onAdd}
          wishlist={wishlist}
          onWish={onWish}
          onQuick={(item) => navigate(`/product/${item.id}`)}
        />
      ) : (
        <div className="empty-state">
          <div className="empty-art">
            <Icon name="heart" size={35} />
          </div>
          <h2>Keep the good ones close.</h2>
          <p>Save the pieces you love and find them here whenever you’re ready.</p>
          <button className="button button-dark" onClick={() => navigate('/shop')}>
            Find your favorites <Icon name="arrow" />
          </button>
        </div>
      )}
    </div>
  );
}

export default WishlistPage;
