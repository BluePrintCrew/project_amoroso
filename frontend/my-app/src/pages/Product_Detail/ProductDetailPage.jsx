import React, { useEffect, useRef, useState } from 'react';

import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import PageLayout from '../../components/PageLayout/PageLayout';
import couponPack from '../../assets/coupon_pack.png';
import getCoupon from '../../assets/get_coupon.png';
import likeButton from '../../assets/like.png';
import shareButton from '../../assets/share.png';
import styles from './ProductDetailPage.module.css';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const thumbnailContainerRef = useRef(null);
  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [showMore, setShowMore] = useState(false);
  const tabRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch(
          `http://localhost:8080/api/v1/products/1`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if (!response.ok) {
          throw new Error('상품 정보를 불러올 수 없습니다.');
        }
        const data = await response.json();

        console.log('API 응답 데이터:', data);

        if (!data || Object.keys(data).length === 0) {
          throw new Error('받아온 데이터가 비어 있음.');
        }
        setProduct(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleScroll = () => {
    if (!tabRef.current) return;
    const offsetTop = tabRef.current.parentElement.offsetTop;
    if (window.scrollY >= offsetTop) {
      tabRef.current.classList.add(styles.fixedTab);
    } else {
      tabRef.current.classList.remove(styles.fixedTab);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!product) return <p>상품 정보를 불러오는 중...</p>;

  const scrollThumbnails = (direction) => {
    if (thumbnailContainerRef.current) {
      const scrollAmount = direction === 'left' ? -100 : 100;
      thumbnailContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const scrollToSection = (section) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveTab(section);
    }
  };

  return (
    <PageLayout>
      <Breadcrumb />

      <div className={styles.productContent}>
        <div className={styles.productMain}>
          <div className={styles.productTop}>
            <div className={styles.productImage}>
              <div className={styles.mainImage}>제품상세페이지 대표이미지</div>
              <div className={styles.thumbnailContainer}>
                <button
                  className={styles.arrow}
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
                  className={styles.arrow}
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
              <h1 className={styles.productTitle}>{product.productName}</h1>
              <p className={styles.productPrice}>
                <span className={styles.discountPrice}>
                  {product.discountPrice.toLocaleString()}원
                </span>
                <span className={styles.originalPrice}>
                  {product.marketPrice.toLocaleString()}원
                </span>
                <span className={styles.discountPercent}>18%</span>
              </p>
              <div className={styles.productRating}>
                <span className={styles.ratingStars}>⭐ 4.7</span>
                <span className={styles.ratingReviews}>
                  {' '}
                  리뷰 {product.reviews.length}개{' '}
                </span>
                <button className={styles.couponButton}>
                  <img src={getCoupon} alt="쿠폰받기 버튼" />
                </button>
              </div>
              <div className={styles.productInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>포인트</span>
                  <span className={styles.infoValue}>
                    구매 시 <span className={styles.highlight}>29P</span> 예상
                    적립 (회원 0.3%)
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
          </div>

          <div className={styles.productBottom}>
            <div ref={tabRef} className={styles.tabNavigation}>
              <button
                onClick={() => scrollToSection('info')}
                className={activeTab === 'info' ? styles.active : ''}
              >
                상품정보
              </button>
              <button
                onClick={() => scrollToSection('review')}
                className={activeTab === 'review' ? styles.active : ''}
              >
                후기
              </button>
              <button
                onClick={() => scrollToSection('inquiry')}
                className={activeTab === 'inquiry' ? styles.active : ''}
              >
                문의
              </button>
              <button
                onClick={() => scrollToSection('delivery')}
                className={activeTab === 'delivery' ? styles.active : ''}
              >
                배송
              </button>
            </div>

            <div id="info" className={styles.section}>
              {product.imagesURL.length > 0 ? (
                product.imagesURL.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`상세 이미지 ${index}`}
                    className={styles.detailImage}
                  />
                ))
              ) : (
                <img
                  src="https://placehold.co/800x500"
                  alt="상품 상세 이미지 없음"
                  className={styles.detailImage}
                />
              )}
            </div>

            <div className={styles.moreInfo}>
              {showMore && (
                <>
                  <img
                    src="https://placehold.co/800x300"
                    alt="상품 공지사항"
                    className={styles.noticeImage}
                  />
                  <img
                    src="https://placehold.co/800x500"
                    alt="상품 설명"
                    className={styles.detailImage}
                  />
                </>
              )}
              <button
                onClick={() => setShowMore(!showMore)}
                className={styles.toggleButton}
              >
                {showMore ? '상세정보 접기 ▲' : '상세정보 펼치기 ▼'}
              </button>
            </div>
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
    </PageLayout>
  );
};

export default ProductDetailPage;
