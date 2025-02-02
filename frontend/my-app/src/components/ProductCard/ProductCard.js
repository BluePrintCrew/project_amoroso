import React from 'react';
import './ProductCard.css';

function ProductCard({ product }) {
  // ✅ product가 undefined인 경우 기본값 설정
  if (!product) {
    return <div className="product-card">상품 정보가 없습니다.</div>;
  }
// basic setting parameter..
  const {
    name = '이름 없음',
    price = 0,
    discount = 0,
    originalPrice = 0,
    shipping = '',
    coupon = false,
    rating = 0,
    reviewCount = 0,
    imageUrl = 'https://via.placeholder.com/150' // 기본 이미지 설정
  } = product;

  return (
    <div className="product-card">
      {/* 썸네일 */}
      <div className="thumbnail">
        <img src={imageUrl} alt={name} onError={(e) => e.target.src = 'https://via.placeholder.com/150'} />
        <button className="wishlist-btn" title="찜하기" />
      </div>

      {/* 상품 정보 */}
      <div className="card-info">
        <p className="product-name">{name}</p>

        {/* 가격 & 할인 */}
        <div className="price-area">
          {discount > 0 && <span className="discount">{discount}%</span>}
          <span className="price">{price.toLocaleString()}원</span>
          {originalPrice > price && (
            <span className="original-price">{originalPrice.toLocaleString()}원</span>
          )}
        </div>

        {/* 혜택 & 별점 */}
        <div className="benefit-area">
          {shipping && <span className="badge">{shipping}</span>}
          {coupon && <span className="badge">할인쿠폰</span>}
          {rating > 0 && (
            <span className="rating">★ {rating} ({reviewCount.toLocaleString()})</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
