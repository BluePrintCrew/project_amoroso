import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { API_BASE_URL } from '../MyPage/api';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import CartPopup from '../Product_Detail/CartPopup';
import PageLayout from '../../components/PageLayout/PageLayout';
import ProductQnA from '../../components/ProductQnA/ProductQnA'; 
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
  
  // 옵션 관련 상태 추가
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/products/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
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

  // 옵션이 없는 경우 컴포넌트 마운트 시 자동으로 기본 상품 선택
  useEffect(() => {
    if (product && 
        (!product.productOptionResponses || product.productOptionResponses.length === 0) && 
        selectedOptions.length === 0) {
      setSelectedOptions([{
        name: product.productName,
        price: 0,
        quantity: 1,
        type: 'base'
      }]);
    }
  }, [product, selectedOptions.length]);

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

  // 배송 예정일 계산 (주문일 기준 14일 후)
  const getEstimatedDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 14); // 현재로부터 14일 뒤 배송 예정
    
    const options = { month: 'numeric', day: 'numeric', weekday: 'short' };
    return date.toLocaleDateString('ko-KR', options);
  };

  // 평균 평점 계산
  const calculateAverageRating = () => {
    if (!product.reviews || product.reviews.length === 0) return 0;
    
    const sum = product.reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / product.reviews.length).toFixed(1);
  };

  const averageRating = calculateAverageRating();

  // 제품 옵션 변경 핸들러
  const handleOptionChange = (optionId, value) => {
    if (!value) return;
    
    // 새 옵션 추가
    const optionObj = product.productOptionResponses.find(
      option => option.productOptionId === optionId
    );
    
    // 기존 옵션 중 같은 종류가 있으면 업데이트, 없으면 새로 추가
    const existingOptionIndex = selectedOptions.findIndex(
      opt => opt.type === 'product' && opt.optionId === optionId
    );
    
    const newOption = {
      optionId,
      value,
      name: `${optionObj.optionName}: ${value}`,
      price: 0, // 기본 옵션은 추가 비용 없음
      quantity: 1,
      type: 'product'
    };
    
    if (existingOptionIndex >= 0) {
      // 기존 옵션 업데이트
      const updatedOptions = [...selectedOptions];
      updatedOptions[existingOptionIndex] = newOption;
      setSelectedOptions(updatedOptions);
    } else {
      // 새 옵션 추가
      setSelectedOptions([...selectedOptions, newOption]);
    }
  };

  // 추가 옵션 변경 핸들러
  const handleAdditionalOptionChange = (optionId) => {
    if (!optionId) return;
    
    // 새 옵션 추가
    const optionObj = product.additionalOptionResponses.find(
      option => option.additionalOptionId === optionId
    );
    
    // 기존 옵션 중 같은 종류가 있으면 업데이트, 없으면 새로 추가
    const existingOptionIndex = selectedOptions.findIndex(
      opt => opt.type === 'additional' && opt.optionId === optionId
    );
    
    const newOption = {
      optionId,
      value: optionObj.optionName,
      name: optionObj.optionName,
      price: optionObj.additionalPrice,
      quantity: 1,
      type: 'additional'
    };
    
    if (existingOptionIndex >= 0) {
      // 기존 옵션 업데이트
      const updatedOptions = [...selectedOptions];
      updatedOptions[existingOptionIndex] = newOption;
      setSelectedOptions(updatedOptions);
    } else {
      // 새 옵션 추가
      setSelectedOptions([...selectedOptions, newOption]);
    }
  };

  // 총 가격 계산
  const calculateTotalPrice = () => {
    const basePrice = product.discountPrice;
    const optionsPrice = selectedOptions.reduce((total, option) => {
      return total + (option.price * option.quantity);
    }, 0);
    
    // 옵션이 없으면 기본 가격 반환
    if (selectedOptions.length === 0) {
      return basePrice;
    }
    
    // 기본 상품 가격 + 옵션별 추가 가격
    return basePrice + optionsPrice;
  };

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

  // 장바구니 추가 핸들러 - 수정됨
  const handleAddToCart = async () => {
    if (isAddingToCart) return;
    
    if (selectedOptions.length === 0) {
      alert('옵션을 선택해주세요.');
      return;
    }

    const token = localStorage.getItem('access_token');

    if (!token) {
      setPopupType('login');
      setIsCartPopupOpen(true);
      return;
    }

    try {
      setIsAddingToCart(true);
      
      // 첫 번째 옵션만 처리 (나중에 필요시 여러 옵션 처리 기능 추가)
      const option = selectedOptions[0];
      
      const cartItem = {
        productId: product.productId,
        quantity: 1, // 항상 1로 고정
      };

      // 옵션 타입에 따라 다르게 처리
      if (option.type === 'additional' && option.optionId) {
        cartItem.additionalOptionId = option.optionId;
      } else if (option.type === 'product' && option.optionId) {
        cartItem.productOptionId = option.optionId;
        cartItem.selectedOptionValue = option.value;
      }
      
      console.log('장바구니 추가 데이터:', cartItem);

      const response = await fetch(`${API_BASE_URL}/api/v1/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cartItem),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('장바구니 추가 실패:', response.status, errorData);
        throw new Error(`장바구니 추가 실패: ${response.status}`);
      }

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

  // 주문하기 핸들러 - 수정됨
  const handleOrderClick = () => {
    // 선택된 옵션이 없는 경우
    if (selectedOptions.length === 0) {
      alert('옵션을 선택해주세요.');
      return;
    }
    
    const token = localStorage.getItem('access_token');

    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    // API 형식에 맞게 orderItems 배열 생성
    const orderItems = selectedOptions.map(option => {
      const orderItem = {
        productId: product.productId,
        quantity: 1 // 항상 1로 고정
      };
      
      // 옵션 타입에 따라 다르게 처리
      if (option.type === 'additional' && option.optionId) {
        orderItem.additionalOptionId = option.optionId;
      } else if (option.type === 'product' && option.optionId) {
        orderItem.productOptionId = option.optionId;
        orderItem.selectedOptionValue = option.value;
      }
      
      return orderItem;
    });

    // 주문 데이터 (API 형식에 맞게 구성)
    const orderData = {
      product: product, // 제품 정보 (화면 표시용)
      orderRequest: {
        totalPrice: calculateTotalPrice(),
        orderItems: orderItems,
        // 나머지 필드는 주문 페이지에서 입력받을 수 있음
        userAddressId: null,
        deliveryRequest: '',
        freeLoweringService: false,
        productInstallationAgreement: false,
        vehicleEntryPossible: false,
        elevatorType: 'NONE'
      }
    };

    navigate('/order', { state: orderData });
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
                <span className={styles.ratingStars}>
                  ⭐ {averageRating}
                </span>
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
                    {product.shippingInstallationFee > 0 
                      ? `${product.shippingInstallationFee.toLocaleString()}원` 
                      : '무료'} / 로진택배
                    <br />
                    <span>{getEstimatedDeliveryDate()} 도착예상</span>
                    <span className={styles.deliveryNote}>(주문 후 평균 14일 소요)</span>
                    <br />
                    <span>| 도서산간지역과 제주특별자치도의 추가 배송비는 관리자에게 별도로 문의해주세요. </span>
                    <br />
                    <span className={styles.adminContact}>
                      ※ 정확한 배송일은 관리자에게 문의해주세요.
                    </span>
                  </span>
                </div>
              </div>

           {/*}   <div className={styles.couponPack}>
                <button className={styles.packButton}>
                  <img src={couponPack} alt="쿠폰팩 버튼" />
                </button>
              </div> */}
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

              {activeTab === 'review' && <ReviewSection productId={product.productId} />}

              {activeTab === 'inquiry' && (
                <div className={styles.inquiryTab}>
                  <ProductQnA productId={product.productId} />
                </div>
              )}
              
              {activeTab === 'delivery' && (
                <div className={styles.deliveryTab}>
                  <h3>배송 및 교환/반품 안내</h3>
                  <div className={styles.deliveryInfo}>
                    <div className={styles.deliverySection}>
                      <h4>배송 정보</h4>
                      <ul>
                        <li>배송 방법: 택배</li>
                        <li>배송 지역: 전국(일부 도서 산간 지역 제외)</li>
                        <li>배송 비용: {product.shippingInstallationFee > 0 
                            ? `${product.shippingInstallationFee.toLocaleString()}원` 
                            : '무료'}</li>
                        <li className={styles.deliveryHighlight}>배송 기간: 주문일로부터 평균 14일 소요</li>
                        <li className={styles.adminContactInfo}>
                          배송 일정 확인: 정확한 배송일은 주문 후 관리자에게 문의해주세요.
                          (고객센터: 1588-XXXX)
                        </li>
                        <li>
                          배송 안내: 배송 과정에서 상품이 분실되거나 파손된 경우
                          즉시 고객센터로 연락 바랍니다.
                        </li>
                      </ul>
                    </div>

                    <div className={styles.deliverySection}>
                      <h4>교환/반품 안내</h4>
                      <ul>
                        <li>교환/반품 기간: 상품 수령 후 7일 이내</li>
                        <li>
                          교환/반품 비용: 고객 변심에 의한 경우 왕복 배송비 고객
                          부담
                        </li>
                        <li>
                          교환/반품 불가 사유:
                          <ul>
                            <li>
                              고객 사용 또는 소비로 인해 상품의 가치가 감소한
                              경우
                            </li>
                            <li>시간 경과로 인해 재판매가 어려운 경우</li>
                            <li>복제가 가능한 상품의 포장을 훼손한 경우</li>
                            <li>
                              고객의 요청에 따라 개별적으로 주문 제작된 상품인
                              경우
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.productRight}>
          {/* 제품 옵션 선택 (옵션이 있는 경우) */}
          {product.productOptionResponses && product.productOptionResponses.length > 0 ? (
            product.productOptionResponses.map((option, index) => (
              <div key={index}>
                <select 
                  className={styles.selectButton}
                  onChange={(e) => handleOptionChange(option.productOptionId, e.target.value)}
                >
                  <option value="">{option.optionName} 선택 &gt;</option>
                  {option.optionValues.map((value, valueIndex) => (
                    <option key={valueIndex} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            ))
          ) : (
            <button 
              className={styles.selectButton}
              onClick={() => {
                if (selectedOptions.length === 0) {
                  setSelectedOptions([{
                    name: product.productName,
                    price: 0,
                    quantity: 1,
                    type: 'base'
                  }]);
                }
              }}
            >
              기본 상품 선택
              <span className={styles.arrow}>&gt;</span>
            </button>
          )}
          
          {/* 추가 옵션 선택 (있는 경우) */}
          {product.additionalOptionResponses && product.additionalOptionResponses.length > 0 && (
            <div>
              <select 
                className={styles.selectButton}
                onChange={(e) => handleAdditionalOptionChange(parseInt(e.target.value))}
              >
                <option value="">추가 옵션 선택 &gt;</option>
                {product.additionalOptionResponses.map((addOption, index) => (
                  <option key={index} value={addOption.additionalOptionId}>
                    {addOption.optionName} (+{addOption.additionalPrice.toLocaleString()}원)
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className={styles.totalPrice}>
            <div className={styles.priceInfo}>
              <span className={styles.priceTitle}>총 구매가</span>
              <span className={styles.priceValue}>
                {calculateTotalPrice().toLocaleString()}원
              </span>
            </div>
            <p className={styles.priceNote}>
              쿠폰적용 및 패키지할인 적용금액은
              <br />
              장바구니/주문서 작성 시 적용됩니다.
            </p>
          </div>
          <div className={styles.buttonGroup}>
            <button
              className={styles.cartButton}
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? '처리 중...' : '장바구니'}
            </button>
            <button 
              className={styles.buyButton} 
              onClick={handleOrderClick}
            >
              구매하기
            </button>
          </div>
        </div>
      </div>

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