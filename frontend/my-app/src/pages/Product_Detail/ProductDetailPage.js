import React, { useRef } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./ProductDetailPage.css";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import getCoupon from "../../assets/get_coupon.png";
import couponPack from "../../assets/coupon_pack.png";
import likeButton from "../../assets/like.png";
import shareButton from "../../assets/share.png";

const ProductDetailPage = () => {
  const thumbnailContainerRef = useRef(null);

  const scrollThumbnails = (direction) => {
    if (thumbnailContainerRef.current) {
      const scrollAmount = direction === "left" ? -100 : 100;
      thumbnailContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="product-detail-page">
      <Header />

      <Breadcrumb />

      <div className="product-content">
        <div className="product-image">
          <div className="main-image">제품상세페이지 대표이미지</div>
          <div className="thumbnail-container">
            <button
              className="arrow left"
              onClick={() => scrollThumbnails("left")}
            >
              ◀
            </button>
            <div className="thumbnail-images">
              {[...Array(10)].map((_, index) => (
                <div key={index} className="thumbnail">
                  썸네일 {index + 1}
                </div>
              ))}
            </div>
            <button
              className="arrow right"
              onClick={() => scrollThumbnails("right")}
            >
              ▶
            </button>
          </div>
        </div>
        <div className="product-middle">
          <div className="breadcrumb">
            <a href="#" className="breadcrumb-link">
              Amoroso
            </a>{" "}
            &gt;
            <div className="breadcrumb-actions">
              <button className="icon-button">
                <img src={likeButton} alt="좋아요 버튼" />
              </button>
              <button className="icon-button">
                <img src={shareButton} alt="공유 버튼" />
              </button>
            </div>
          </div>
          <h1 className="product-title">식탁의자1</h1>
          <p className="product-price">
            <span className="discount-price">473,000원</span>
            <span className="original-price">777,000원</span>
            <span className="discount-percent">18%</span>
          </p>
          <div className="product-rating">
            <span className="rating-stars">⭐ 4.7</span>
            <span className="rating-reviews"> 리뷰 131개 </span>
            <button className="coupon-button">
              <img src={getCoupon} alt="쿠폰받기 버튼" />
            </button>
          </div>
          <div className="product-info">
            <div className="info-row">
              <span className="info-label">포인트</span>
              <span className="info-value">
                구매 시 <span className="highlight">29P</span> 예상 적립 (회원
                0.3%)
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">배송정보</span>
              <span className="info-value">
                무료 / 로진택배
                <br />
                <span>12/18(수) 도착예상</span>
                <span>도서 산간 지역 불가</span>
                <br />
                <span>| 제주특별자치도 15,000원 선불 (1개당)</span>
              </span>
            </div>
          </div>

          <div className="coupon-pack">
            <button className="pack-button">
              <img src={couponPack} alt="쿠폰팩 버튼" />
            </button>
          </div>
        </div>

        <div className="product-right">
          <button className="select-button">
            기본 상품 선택
            <span className="arrow">&gt;</span>
          </button>

          <div className="total-price">
            <div className="price-info">
              <span className="price-title">총 구매가</span>
              <span className="price-value">473,000원</span>
            </div>
            <p className="price-note">
              쿠폰적용 및 패키지할인 적용금액은
              <br />
              장바구니/주문서 작성 시 적용됩니다.
            </p>
          </div>
          <div className="button-group">
            <button className="cart-button">장바구니</button>
            <button className="buy-button">구매하기</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
