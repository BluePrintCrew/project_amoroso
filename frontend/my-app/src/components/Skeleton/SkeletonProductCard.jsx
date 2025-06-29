import React from 'react';
import './Skeleton.css';

const SkeletonProductCard = () => {
  return (
    <div className="skeleton-product-card">
      <div className="skeleton-image"></div>
      <div className="skeleton-content">
        <div className="skeleton-title"></div>
        <div className="skeleton-price"></div>
        <div className="skeleton-description"></div>
      </div>
    </div>
  );
};

export default SkeletonProductCard; 