import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
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
  const displayPrice = discountPrice && discountPrice > 0 ? discountPrice : marketPrice;
  // 이미지가 없으면 no_image 사용
  const imageUrl = primaryImageURL || no_image;
  // 할인율이 0보다 크면 할인율, 원가 표시
  const hasDiscount = discountRate && discountRate > 0;

  // 위시리스트 추가 핸들러
  const handleWishlistAdd = (e) => {
    // 상세 페이지 이동 방지
    e.stopPropagation();
    e.preventDefault();

    const token = localStorage.getItem('accessToken');
    axios.post(`http://localhost:8080/api/v1/wishlist/add/${productId}`, null, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    })
    .then((response) => {
      console.log("위시리스트에 추가됨:", response.data);
      // 추가 UI 업데이트 (예: 토스트 메시지) 구현 가능
    })
    .catch((error) => {
      console.error("위시리스트 추가 실패:", error);
    });
  };

  return (
    <div className="product-card">
      <div className="thumbnail">
        {/* 이미지 클릭 시 상세 페이지로 이동 */}
        <Link to={`/product/${productId}`} className="product-link">
          <img
            src={imageUrl}
            alt={productName}
            onError={(e) => {
              e.target.src = no_image;
            }}
          />
        </Link>
        <button 
          className="wishlist-btn" 
          title="찜하기"
          onClick={handleWishlistAdd}
        >
          {/* 아이콘이나 텍스트 추가 가능 */}
        </button>
      </div>
      {/* 카드 정보 클릭 시 상세 페이지로 이동 */}
      <Link to={`/product/${productId}`} className="product-link">
        <div className="card-info">
          <p className="product-category">[{category}]</p>
          <p className="product-name">{productName}</p>
          <div className="price-area">
            {hasDiscount && (
              <span className="discount">{discountRate}%</span>
            )}
            <span className="price">{displayPrice.toLocaleString()}원</span>
            {hasDiscount && (
              <span className="original-price">{marketPrice.toLocaleString()}원</span>
            )}
          </div>
          {/* 추가 정보(등록일 등)도 여기에 표시 가능 */}
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;
