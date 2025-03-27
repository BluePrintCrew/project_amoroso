import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_BASE_URL } from '../MyPage/api';

import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import CartPopup from '../Product_Detail/CartPopup';
import PageLayout from '../../components/PageLayout/PageLayout';
import ReviewSection from './ReviewSection';
import couponPack from '../../assets/coupon_pack.png';
import getCoupon from '../../assets/get_coupon.png';
import likeButton from '../../assets/like.png';
import shareButton from '../../assets/share.png';
import styles from './ProductDetailPage.module.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const thumbnailContainerRef = useRef(null);
  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [showMore, setShowMore] = useState(false);
  const tabRef = useRef(null);

  // 장바구니 팝업 상태 관리
  const [isCartPopupOpen, setIsCartPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState('cart'); // 'cart' 또는 'login'
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/products/${id}`,
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
    const productBottom = document.querySelector(`.${styles.productBottom}`);

    if (window.scrollY >= offsetTop) {
      tabRef.current.classList.add(styles.fixedTab);
      if (productBottom) {
        const rect = productBottom.getBoundingClientRect();
        tabRef.current.style.width = `${rect.width}px`;
        tabRef.current.style.left = `${rect.left}px`;
      }
    } else {
      tabRef.current.classList.remove(styles.fixedTab);
      tabRef.current.style.width = '100%';
      tabRef.current.style.left = '0';
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

  // 장바구니 추가 핸들러
  const handleAddToCart = async () => {
    // 이미 처리 중이면 중복 요청 방지
    if (isAddingToCart) return;

    const token = localStorage.getItem('access_token');

    // 로그인 여부 확인
    if (!token) {
      setPopupType('login');
      setIsCartPopupOpen(true);
      return;
    }

    try {
      setIsAddingToCart(true);

      // 장바구니 API 호출
      const response = await fetch(`${API_BASE_URL}/api/v1/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product.productId,
          quantity: 1,
          // 추가 옵션이 있다면 여기에 포함
        }),
      });

      if (!response.ok) {
        throw new Error('장바구니 추가에 실패했습니다.');
      }

      // 장바구니 추가 성공 시 팝업 표시
      setPopupType('cart');
      setIsCartPopupOpen(true);
    } catch (error) {
      console.error('장바구니 추가 오류:', error);
      alert('장바구니 추가 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  // 장바구니 이동 확인 핸들러
  const handleCartConfirm = () => {
    setIsCartPopupOpen(false);
    navigate('/cart');
  };

  // 팝업 닫기 핸들러
  const handlePopupClose = () => {
    setIsCartPopupOpen(false);
  };

  return (
    <PageLayout>
      <Breadcrumb />

      <div className={styles.productContent}>
        <div className={styles.productMain}>
          <div className={styles.productTop}>
            <div className={styles.productImage}>
              <img
                src={
                  product.mainImageURL
                    ? `${API_BASE_URL}/api/v1/images/${product.mainImageURL
                        .split('/')
                        .pop()}`
                    : 'https://placehold.co/500x500'
                }
                alt={product.productName}
                className={styles.mainImage}
              />
              <div
                className={styles.thumbnailContainer}
                ref={thumbnailContainerRef}
              >
                <button
                  className={styles.arrow}
                  onClick={() => scrollThumbnails('left')}
                >
                  ◀
                </button>
                <div className={styles.thumbnailImages}>
                  {product.subImagesURL && product.subImagesURL.length > 0
                    ? product.subImagesURL.map((img, index) => (
                        <div key={index} className={styles.thumbnail}>
                          <img
                            src={`${API_BASE_URL}/api/v1/images/${img.imageURL
                              .split('/')
                              .pop()}`}
                            alt={`${product.productName} 썸네일 ${index + 1}`}
                          />
                        </div>
                      ))
                    : [...Array(5)].map((_, index) => (
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
                <span className={styles.discountPercent}>
                  {product.discountRate}%
                </span>
              </p>
              <div className={styles.productRating}>
                <span className={styles.ratingStars}>⭐ 4.7</span>
                <span className={styles.ratingReviews}>
                  {' '}
                  리뷰 {product.reviews ? product.reviews.length : 0}개{' '}
                </span>
                <button className={styles.couponButton}>
                  <img src={getCoupon} alt="쿠폰받기 버튼" />
                </button>
              </div>
              <div className={styles.productInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>포인트</span>
                  <span className={styles.infoValue}>
                    구매 시{' '}
                    <span className={styles.highlight}>
                      {Math.floor(product.discountPrice * 0.003)}P
                    </span>{' '}
                    예상 적립 (회원 0.3%)
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
                onClick={() => setActiveTab('info')}
                className={activeTab === 'info' ? styles.active : ''}
              >
                상품정보
              </button>
              <button
                onClick={() => setActiveTab('review')}
                className={activeTab === 'review' ? styles.active : ''}
              >
                후기
              </button>
              <button
                onClick={() => setActiveTab('inquiry')}
                className={activeTab === 'inquiry' ? styles.active : ''}
              >
                문의
              </button>
              <button
                onClick={() => setActiveTab('delivery')}
                className={activeTab === 'delivery' ? styles.active : ''}
              >
                배송
              </button>
            </div>

            <div className={styles.tabContent}>
              {activeTab === 'info' && (
                <div className={styles.infoTab}>
                  {product.detailDescriptionImageURL &&
                  product.detailDescriptionImageURL.length > 0 ? (
                    product.detailDescriptionImageURL.map((img, index) => (
                      <img
                        key={index}
                        src={`${API_BASE_URL}/api/v1/images/${img.imageURL
                          .split('/')
                          .pop()}`}
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
              )}

              {activeTab === 'review' && <ReviewSection />}
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
              <span className={styles.priceValue}>
                {product.discountPrice.toLocaleString()}원
              </span>
            </div>
            <p className={styles.priceNote}>
              쿠폰적용 및 패키지할인 적용금액은
              <br />
              장바구니/주문서 작성 시 적용됩니다.
            </p>
          </div>
          <div className={styles.buttonGroup}>
            {/* 장바구니 버튼에 핸들러 추가 */}
            <button
              className={styles.cartButton}
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? '처리 중...' : '장바구니'}
            </button>
            <button
              className={styles.buyButton}
              onClick={() => navigate('/order')}
            >
              구매하기
            </button>
          </div>
        </div>
      </div>

      {/* 장바구니/로그인 팝업 */}
      <CartPopup
        isOpen={isCartPopupOpen}
        onClose={handlePopupClose}
        onConfirm={handleCartConfirm}
        productName={product.productName}
        type={popupType}
      />
    </PageLayout>
  );
};

export default ProductDetailPage;
