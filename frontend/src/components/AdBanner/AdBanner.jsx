import React from 'react';
import './AdBanner.css';

export default function AdBanner({ location, dimensions }) {
  return (
    <div className={`
      ad-container 
      ${dimensions === '160x600' ? 'ad-skyscraper' : ''}
      ${location === 'right' ? 'ad-right' : ''}
      ${location === 'bottom' ? 'ad-mobile-banner' : ''}
    `}>
      <div className="ad-label">ADVERTISEMENT</div>
      <div className="ad-content">
        {dimensions === '160x600' ? (
          <img 
            src="/ads/math-skyscraper.png" 
            alt="Advanced Math Tools" 
            className="ad-image"
          />
        ) : (
          <p className="ad-text">
            {location === 'right' 
              ? "Enhance your math skills with premium courses!" 
              : "Try our Pro Calculator Bundle"}
          </p>
        )}
      </div>
    </div>
  );
}