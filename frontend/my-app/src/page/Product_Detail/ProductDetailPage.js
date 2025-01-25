import React, { useRef } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./ProductDetailPage.css";

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
              {[...Array(14)].map((_, index) => (
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
          <h1 className="product-title">식탁의자1</h1>
          <p className="product-price">
            <span className="discount-price">473,000원</span>
            <span className="original-price">777,000원</span>
            <span className="discount-percent">18%</span>
          </p>
          <div className="product-rating">
            <span className="rating-stars">⭐ 4.7</span>
            <span className="rating-reviews"> 리뷰 131개 </span>
          </div>
        </div>

        <div className="product-right">
          <div className="option-select">
            <p>기본 상품 선택</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
