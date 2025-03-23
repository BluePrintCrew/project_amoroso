import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ProductCard.css';
import no_image from '../../assets/noproduct.webp';
import { API_BASE_URL } from '../../pages/MyPage/api';

function ProductCard({ product }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageUrl, setImageUrl] = useState(no_image);
  
  // 모든 Hook들은 조건문 앞에 위치해야 함
  useEffect(() => {
    if (!product) return;
    
    const { productId, primaryImageURL } = product;
    
    // 이미지 URL 처리 로직
    let newImageUrl = no_image;
    
    if (primaryImageURL) {
      if (primaryImageURL.startsWith('http')) {
        // 이미 완전한 URL인 경우
        newImageUrl = primaryImageURL;
      } else if (primaryImageURL.startsWith('/images/')) {
        // /images/로 시작하는 경우 - API 경로로 변환
        // 파일명만 추출하여 API 엔드포인트에 추가
        const filename = primaryImageURL.split('/').pop();
        newImageUrl = `${API_BASE_URL}/api/v1/images/${filename}`;
      } else if (primaryImageURL.startsWith('/api/v1/images/')) {
        // 이미 올바른 API 경로인 경우
        newImageUrl = `${API_BASE_URL}${primaryImageURL}`;
      } else if (primaryImageURL.startsWith('/')) {
        // 다른 슬래시로 시작하는 경로인 경우
        newImageUrl = `${API_BASE_URL}${primaryImageURL}`;
      } else {
        // 단순 파일명으로 가정
        newImageUrl = `${API_BASE_URL}/api/v1/images/${primaryImageURL}`;
      }
    }
    
    setImageUrl(newImageUrl);
    
    // 이미지 URL 디버깅
    console.log(`상품(${productId}) 원본 이미지 경로:`, primaryImageURL);
    console.log(`상품(${productId}) 변환된 이미지 URL:`, newImageUrl);
  }, [product]);

  if (!product) {
    return <div className="product-card">상품 정보가 없습니다.</div>;
  }
  
  const {
    productId,
    productName,
    marketPrice,
    discountPrice,
    discountRate,
    category = '카테고리 없음',
    // 아래는 추가 정보가 있을 경우 표시하기 위함 (없으면 기본값)
    rating = 0,          // 평점
    reviewCount = 0,     // 리뷰 개수
    couponApplicable = false,  // 쿠폰 적용 가능 여부
  } = product;
  
  // 할인 중이라면 discountPrice 사용, 아니면 marketPrice
  const displayPrice = discountPrice && discountPrice > 0 ? discountPrice : marketPrice;
  
  // 할인율이 0보다 크면 할인율, 원가 표시
  const hasDiscount = discountRate && discountRate > 0;
  
  const handleWishlistAdd = (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    // 토큰 확인 (로그인 체크)
    const token = localStorage.getItem('access_token');
    if (!token) {
      // 로그인 필요 메시지 표시 또는 로그인 페이지로 리디렉션
      alert("로그인 후 이용 가능합니다.");
      // 또는 navigate('/login');
      return;
    }
    
    axios
      .post(`${API_BASE_URL}/api/v1/wishlist/add/${productId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      })
      .then((response) => {
        console.log('위시리스트에 추가됨:', response.data);
        // 성공 알림 표시
        alert("상품이 위시리스트에 추가되었습니다.");
        // 또는 toast 메시지 사용
      })
      .catch((error) => {
        console.error('위시리스트 추가 실패:', error);
        alert("위시리스트 추가에 실패했습니다.");
      });
  }; 
  
  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  
  const handleImageError = (e) => {
    console.error(`이미지 로드 실패 - 상품 ID: ${productId}, URL: ${imageUrl}`);
    e.target.src = no_image;
    setImageLoaded(true);
  };
  
  return (
    <div className="product-card">
      {/* 썸네일 영역 */}
      <div className="thumbnail">
        {/* 이미지를 클릭하면 상세 페이지로 이동 */}
        <Link to={`/product/${productId}`} className="product-link">
          {!imageLoaded && <div className="image-loading">로딩중...</div>}
          <img
            src={imageUrl}
            alt={productName}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ display: imageLoaded ? 'block' : 'none' }}
          />
        </Link>
        {/* 찜 버튼 */}
        <button
          className="wishlist-btn"
          title="찜하기"
          onClick={handleWishlistAdd}
        />
      </div>
      {/* 카드 정보 영역 (클릭 시 상세 페이지로 이동) */}
      <Link to={`/product/${productId}`} className="product-link">
        <div className="card-info">
          {/* 상품명 */}
          <p className="product-name">{productName}</p>
          {/* 가격 & 할인 */}
          <div className="price-row">
            {hasDiscount && (
              <span className="discount-rate">{discountRate}%</span>
            )}
            <span className="sale-price">
              {displayPrice?.toLocaleString()}원
            </span>
            {hasDiscount && (
              <span className="original-price">
                {marketPrice?.toLocaleString()}원
              </span>
            )}
          </div>
          {/* 평점 & 리뷰수 */}
          <div className="rating-row">
            <span className="star-icon">★</span>
            <span className="rating">{rating.toFixed(1)}</span>
            <span className="review-count">({reviewCount.toLocaleString()})</span>
          </div>
          {/* 쿠폰 표시 */}
          {couponApplicable && (
            <div className="coupon-badge">쿠폰</div>
          )}
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;