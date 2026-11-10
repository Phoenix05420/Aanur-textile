import React from 'react';
import { Icon } from '../components/common/Icon.jsx';

export function NotFound({ navigate }) {
  return (
    <div className="not-found">
      <span className="eyebrow">A LITTLE DETOUR</span>
      <h1>
        This page took
        <br />
        <em>a slow day.</em>
      </h1>
      <p>We couldn't find what you were looking for, but there’s plenty of comfort elsewhere.</p>
      <button className="button button-dark" onClick={() => navigate('/')}>
        Back to the good stuff <Icon name="arrow" />
      </button>
    </div>
  );
}

export default NotFound;
