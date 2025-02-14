import React, { useRef } from 'react';

import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import couponPack from '../../assets/coupon_pack.png';
import getCoupon from '../../assets/get_coupon.png';
import likeButton from '../../assets/like.png';
import shareButton from '../../assets/share.png';
import styles from './ProductDetailPage.module.css';
import { useNavigate } from 'react-router-dom';

const ProductDetailPage = () => {
  const thumbnailContainerRef = useRef(null);

  const scrollThumbnails = (direction) => {
    if (thumbnailContainerRef.current) {
      const scrollAmount = direction === 'left' ? -100 : 100;
      thumbnailContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const navigate = useNavigate();

  return (
    <div className={styles.productDetailPage}>
      <Header />

      <Breadcrumb />

      <div className={styles.productContent}>
        <div className={styles.productImage}>
          <div className={styles.mainImage}>제품상세페이지 대표이미지</div>
          <div className={styles.thumbnailContainer}>
            <button
              className={styles.arrowLeft}
              onClick={() => scrollThumbnails('left')}
            >
              ◀
            </button>
            <div className={styles.thumbnailImages}>
              {[...Array(10)].map((_, index) => (
                <div key={index} className={styles.thumbnail}>
                  썸네일 {index + 1}
                </div>
              ))}
            </div>
            <button
              className={styles.arrowRight}
              onClick={() => scrollThumbnails('right')}
            >
              ▶
            </button>
          </div>
        </div>
        <div className={styles.productMiddle}>
          <div className={styles.breadcrumb}>
            <a href="#" className={styles.breadcrumbLink}>
              Amoroso
            </a>{' '}
            &gt;
            <div className={styles.breadcrumbActions}>
              <button className={styles.iconButton}>
                <img src={likeButton} alt="좋아요 버튼" />
              </button>
              <button className={styles.iconButton}>
                <img src={shareButton} alt="공유 버튼" />
              </button>
            </div>
          </div>
          <h1 className={styles.productTitle}>식탁의자1</h1>
          <p className={styles.productPrice}>
            <span className={styles.discountPrice}>473,000원</span>
            <span className={styles.originalPrice}>777,000원</span>
            <span className={styles.discountPercent}>18%</span>
          </p>
          <div className={styles.productRating}>
            <span className={styles.ratingStars}>⭐ 4.7</span>
            <span className={styles.ratingReviews}> 리뷰 131개 </span>
            <button className={styles.couponButton}>
              <img src={getCoupon} alt="쿠폰받기 버튼" />
            </button>
          </div>
          <div className={styles.productInfo}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>포인트</span>
              <span className={styles.infoValue}>
                구매 시 <span className={styles.highlight}>29P</span> 예상 적립
                (회원 0.3%)
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>배송정보</span>
              <span className={styles.infoValue}>
                무료 / 로진택배
                <br />
                <span>12/18(수) 도착예상</span>
                <span>도서 산간 지역 불가</span>
                <br />
                <span>| 제주특별자치도 15,000원 선불 (1개당)</span>
              </span>
            </div>
          </div>

          <div className={styles.couponPack}>
            <button className={styles.packButton}>
              <img src={couponPack} alt="쿠폰팩 버튼" />
            </button>
          </div>
        </div>

        <div className={styles.productRight}>
          <button className={styles.selectButton}>
            기본 상품 선택
            <span className={styles.arrow}>&gt;</span>
          </button>

          <div className={styles.totalPrice}>
            <div className={styles.priceInfo}>
              <span className={styles.priceTitle}>총 구매가</span>
              <span className={styles.priceValue}>473,000원</span>
            </div>
            <p className={styles.priceNote}>
              쿠폰적용 및 패키지할인 적용금액은
              <br />
              장바구니/주문서 작성 시 적용됩니다.
            </p>
          </div>
          <div className={styles.buttonGroup}>
            <button className={styles.cartButton}>장바구니</button>
            <button
              className={styles.buyButton}
              onClick={() => navigate('/order')}
            >
              구매하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
