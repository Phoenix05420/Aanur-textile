import React from 'react';
import { Icon } from './common/Icon.jsx';

export function SectionTitle({ eyebrow, title, copy, link, navigate }) {
  return (
    <div className="section-title reveal">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        {copy && <p>{copy}</p>}
      </div>
      {link && (
        <button className="text-link" onClick={() => navigate(link.to)}>
          {link.label}
          <Icon name="arrow" size={16} />
        </button>
      )}
    </div>
  );
}

export default SectionTitle;
