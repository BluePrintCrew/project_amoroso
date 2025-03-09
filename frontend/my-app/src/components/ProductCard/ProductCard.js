// src/components/ProductCard/ProductCard.jsx
import React from 'react';
import './ProductCard.css';

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
    createdAt = '' // 등록일 표시를 원한다면 UI에 추가
  } = product;

  // 할인 중이라면 discountPrice 사용, 아니면 marketPrice
  const displayPrice = discountPrice && discountPrice > 0
    ? discountPrice
    : marketPrice;

  // 이미지 URL이 없으면 기본 이미지 사용
  const imageUrl = primaryImageURL || 'https://via.placeholder.com/150';

  // 할인율이 0보다 크면 할인율, 원가 표시
  const hasDiscount = discountRate && discountRate > 0;

  return (
    <div className="product-card">
      {/* 썸네일 영역 */}
      <div className="thumbnail">
        <img
          src={imageUrl}
          alt={productName}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/150';
          }}
        />
        <button className="wishlist-btn" title="찜하기" />
      </div>

      {/* 상품 정보 영역 */}
      <div className="card-info">
        {/* 카테고리 (필요하다면 위치/스타일 조정) */}
        <p className="product-category">[{category}]</p>

        {/* 상품명 */}
        <p className="product-name">{productName}</p>

        {/* 가격 & 할인 표시 */}
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

        {/* 등록일 표시 (필요 시) */}
        {/* <p className="created-at">등록일: {createdAt}</p> */}
      </div>
    </div>
  );
}

export default ProductCard;
