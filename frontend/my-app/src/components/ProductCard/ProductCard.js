// src/components/ProductCard/ProductCard.jsx
import React from 'react';
import './ProductCard.css';

// 기본 이미지 import
import no_image from '../../assets/noproduct.webp';

function ProductCard({ product }) {
  if (!product) {
    return <div className="product-card">상품 정보가 없습니다.</div>;
  }

  const {
    productId,
    productName,
    marketPrice,
    discountPrice,
    discountRate,
    primaryImageURL,
    category = '카테고리 없음',
    createdAt = ''
  } = product;

  // 할인 중이라면 discountPrice 사용, 아니면 marketPrice
  const displayPrice = discountPrice && discountPrice > 0
    ? discountPrice
    : marketPrice;

  // 이미지가 없으면 no_image 사용
  const imageUrl = primaryImageURL || no_image;

  // 할인율이 0보다 크면 할인율, 원가 표시
  const hasDiscount = discountRate && discountRate > 0;

  return (
    <div className="product-card">
      <div className="thumbnail">
        <img
          src={imageUrl}
          alt={productName}
          // 로딩 실패 시 no_image로 교체
          onError={(e) => {
            e.target.src = no_image;
          }}
        />
        <button className="wishlist-btn" title="찜하기" />
      </div>

      <div className="card-info">
        <p className="product-category">[{category}]</p>
        <p className="product-name">{productName}</p>

        <div className="price-area">
          {hasDiscount && (
            <span className="discount">
              {discountRate}%
            </span>
          )}
          <span className="price">
            {displayPrice.toLocaleString()}원
          </span>
          {hasDiscount && (
            <span className="original-price">
              {marketPrice.toLocaleString()}원
            </span>
          )}
        </div>

        {/* 등록일 등 추가 정보가 필요하면 여기에 */}
      </div>
    </div>
  );
}

export default ProductCard;
