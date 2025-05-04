import 'react-datepicker/dist/react-datepicker.css';

import React, { useEffect, useState } from 'react';

import { API_BASE_URL } from '../MyPage/api';
import CartSummary from '../../components/CartSummary/CartSummary';
import DatePicker from 'react-datepicker';
import PageLayout from '../../components/PageLayout/PageLayout';
import axios from 'axios';
import styles from './OrderForm.module.css';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// const paymentMethods = [
//   '퀵 계좌이체',
//   '신용카드(일반)',
//   '신용카드(법인)',
//   '결제수단1',
//   '토스 페이',
//   '카카오 페이',
//   '네이버 페이',
//   '페이코 결제',
// ];

const OrderForm = () => {
  // 1. 라우터 관련 훅
  const navigate = useNavigate();
  const location = useLocation();
  const passedData = location.state;
  const products = Array.isArray(passedData) ? passedData : [passedData];

  // 2. 상태 변수 선언
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);

  const [userAddress, setUserAddress] = useState(null);
  const [user, setUser] = useState(null);

  const [deliveryRequest, setDeliveryRequest] = useState('');
  const [freeLoweringService, setFreeLoweringService] = useState(false);
  const [productInstallationAgreement, setProductInstallationAgreement] =
    useState(false);
  const [vehicleEntryPossible, setVehicleEntryPossible] = useState(true);
  const [elevatorType, setElevatorType] = useState('ONE_TO_SEVEN');

  // 3. 가격 계산용 변수
  const cartItems = products.map((item) => ({
    price: item.discountPrice,
    originalPrice: item.marketPrice,
    quantity: item.quantity || 1,
  }));

  const totalOriginalPrice = products.reduce(
    (sum, item) => sum + item.marketPrice * (item.quantity || 1),
    0
  );
  const totalDiscountPrice = products.reduce(
    (sum, item) => sum + item.discountPrice * (item.quantity || 1),
    0
  );
  const totalDiscount = totalOriginalPrice - totalDiscountPrice;

  const shippingPrice = 0;
  const pointUsed = 0;
  const finalPrice = totalDiscountPrice + shippingPrice - pointUsed;

  // 4. 날짜 포맷
  const formatDate = (date) => {
    if (!date) return { year: '', month: '', day: '', dayOfWeek: '' };

    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString();
    const day = date.getDate().toString();
    const dayOfWeek = date
      .toLocaleDateString('ko-KR', { weekday: 'long' })
      .substring(0, 1);

    return { year, month, day, dayOfWeek };
  };

  const { year, month, day, dayOfWeek } = formatDate(selectedDate);

  // 5. useEffect: 유저 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/auth/users/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data);
      } catch (err) {
        console.error('유저 이메일 가져오기 실패:', err);
      }
    };
    fetchUserInfo();
  }, []);

  // 6. useEffect: 유저 주소 가져오기
  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/UserAddress/default`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUserAddress(response.data);
      } catch (error) {
        console.error('주소 정보 불러오기 실패:', error);
        alert('배송지 정보를 불러오지 못했습니다.');
      }
    };

    fetchUserAddress();
  }, []);

  // 7. 핸들러 함수들
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleMethodClick = (method) => {
    setSelectedMethod(method);
  };

  const handleOrderSubmit = async () => {
    try {
      const token = localStorage.getItem('access_token');

      const orderItems = products.map((item) => ({
        productId: item.productId,
        quantity: item.quantity || 1,
      }));

      const orderResponse = await axios.post(
        `${API_BASE_URL}/api/v1/orders`,
        {
          totalPrice: finalPrice,
          orderItems,
          userAddressId: userAddress?.addressId ?? 0,
          deliveryRequest,
          freeLoweringService,
          productInstallationAgreement,
          vehicleEntryPossible,
          elevatorType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('✅ 주문 완료:', orderResponse.data);

      const orderId = orderResponse.data.orderId;

      const { IMP } = window;
      if (!IMP) {
        alert('결제 모듈이 로드되지 않았습니다.');
        return;
      }

      IMP.init(process.env.REACT_APP_IAMPORT_MERCHANT_CODE);
      const merchant_uid = `order_${orderId}_${Date.now()}`;

      IMP.request_pay(
        {
          channelKey: process.env.REACT_APP_PORTONE_CHANNEL_KEY,
          pg: 'html5_inicis',
          pay_method: 'card',
          merchant_uid,
          name: `주문번호 ${orderId}`,
          amount: finalPrice,
          buyer_email: user?.email ?? 'guest@example.com',
          buyer_name: user?.name ?? '비회원',
          buyer_tel: user?.phoneNumber ?? '010-0000-0000',
          buyer_addr: userAddress?.address ?? '',
          buyer_postcode: userAddress?.postalCode ?? '',
          currency: 'KRW',
        },
        async function (rsp) {
          if (rsp.success) {
            try {
              const verifyRes = await axios.post(
                `${API_BASE_URL}/api/v1/payments/verify`,
                {
                  impUid: rsp.imp_uid,
                  orderId: orderId,
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                }
              );

              if (verifyRes.data.success) {
                alert('결제가 성공적으로 처리되었습니다.');
              } else {
                alert('결제 검증 실패: ' + verifyRes.data.message);
              }
            } catch (err) {
              console.error('결제 검증 오류', err);
              alert('결제 검증 중 오류가 발생했습니다.');
            }
          } else {
            console.error('결제 실패: ', rsp.error_msg);
            alert(`결제 실패: ${rsp.error_msg}`);
          }
        }
      );
    } catch (error) {
      console.error('❌ 주문 실패:', error);
      alert('주문에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <PageLayout>
      <h1 className={styles.orderTitle}>주문서 작성</h1>
      <div className={styles.infoTable}>
        <div className={styles.infoHeader1}>
          <div className={`${styles.column} ${styles.leftAlign}`}>상품정보</div>
          <div className={`${styles.column} ${styles.centerAlign}`}>수량</div>
          <div className={`${styles.column} ${styles.centerAlign}`}>
            상품금액
          </div>
          <div className={`${styles.column} ${styles.centerAlign}`}>
            배송정보
          </div>
        </div>
        <div className={styles.infoHeader2}>
          <div className={`${styles.column} ${styles.leftAlign}`}>
            <span className={styles.mainText}>로젠택배</span>
            <span className={styles.subText}>배송/설치일 직접 지정 가능</span>
          </div>
        </div>
        {products.map((product, index) => (
          <div key={index} className={styles.infoBody}>
            <div className={styles.row}>
              <div className={`${styles.column} ${styles.leftAlign}`}>
                <div className={styles.productInfo}>
                  <img
                    src={
                      product.mainImageURL
                        ? `${API_BASE_URL}/api/v1/images/${product.mainImageURL
                            .split('/')
                            .pop()}`
                        : 'https://placehold.co/120x120'
                    }
                    alt="상품 이미지"
                    className={styles.productImage}
                  />
                  <div>
                    <p>Amoroso</p>
                    <p className={styles.productName}>{product.productName}</p>
                  </div>
                </div>
              </div>

              <div className={`${styles.column} ${styles.centerAlign}`}>
                <p>1</p>
              </div>

              <div className={`${styles.column} ${styles.centerAlign}`}>
                <p className={styles.price}>{product.discountPrice}원</p>
                <p className={styles.originalPrice}>{product.marketPrice}원</p>
                <button className={styles.discountInfo}>할인내역</button>
              </div>

              <div className={`${styles.column} ${styles.centerAlign}`}>
                <p className={styles.shipping1}>무료배송</p>
                <p className={styles.shipping2}>지역별/옵션별 배송비 추가</p>
                <p className={styles.shipping3}>지역별 배송비</p>
              </div>
            </div>
          </div>
        ))}

        <div className={styles.infoBottom}>
          <p>
            • 배송일자 안내 내용입니다. 배송일자 안내 내용입니다. 배송일자 안내
            내용입니다.
          </p>
        </div>
      </div>
      <CartSummary cartItems={cartItems} />

      <div className={styles.delivery}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>주문상품 배송정보</h2>
            <p className={styles.sectionDescription}>
              • 주문상품 배송정보 안내입니다. 주문상품 배송정보 안내입니다.
              <br />• 주문상품 배송정보 안내입니다.주문상품 배송정보
              안내입니다.주문상품 배송정보 안내입니다.
            </p>
          </div>
        </div>

        <hr className={styles.sepLine} />

        {userAddress && (
          <div className={styles.deliveryInfo}>
            <h3 className={styles.subTitle}>배송정보</h3>
            <div className={styles.deliveryTable}>
              <div className={styles.row}>
                <div className={`${styles.cell} ${styles.label}`}>
                  주문자명/연락처<span className={styles.required}>*</span>
                </div>
                <div className={styles.cell}>
                  {userAddress.recipientName} / {userAddress.phoneNumber}
                  <button
                    className={styles.editButton}
                    onClick={() => navigate('/mypageinfo')}
                  >
                    주문자 정보 변경
                  </button>
                </div>
              </div>
              <div className={styles.row}>
                <div className={`${styles.cell} ${styles.label}`}>
                  배송지 주소<span className={styles.required}>*</span>
                </div>
                <div className={styles.cell}>
                  기본배송지:
                  <br />({userAddress.postalCode}) {userAddress.address}{' '}
                  {userAddress.detailAddress}
                  <button className={styles.editButton}>배송지 목록</button>
                  <br />
                  {userAddress.phoneNumber}
                </div>
              </div>
              <div className={styles.row} style={{ border: 'none' }}>
                <div className={`${styles.cell} ${styles.label}`}>
                  가구배송 추가정보<span className={styles.required}>*</span>
                </div>
                <div
                  className={styles.cell}
                  style={{ borderBottom: '1px solid #e6e6e6' }}
                >
                  <div className={styles.radioButtons}>
                    <div className={styles.elevatorOptions}>
                      <span>엘리베이터:</span>
                      <label>
                        <input
                          type="radio"
                          name="elevator"
                          value="ONE_TO_SEVEN"
                          checked={elevatorType === 'ONE_TO_SEVEN'}
                          onChange={() => setElevatorType('ONE_TO_SEVEN')}
                        />
                        1~7인승
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="elevator"
                          value="EIGHT_TO_TEN"
                          checked={elevatorType === 'EIGHT_TO_TEN'}
                          onChange={() => setElevatorType('EIGHT_TO_TEN')}
                        />
                        8~10인승
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="elevator"
                          value="ELEVEN_OR_MORE"
                          checked={elevatorType === 'ELEVEN_OR_MORE'}
                          onChange={() => setElevatorType('ELEVEN_OR_MORE')}
                        />
                        11인승 이상
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="elevator"
                          value="NONE"
                          checked={elevatorType === 'NONE'}
                          onChange={() => setElevatorType('NONE')}
                        />
                        없음
                      </label>
                    </div>
                    <div className={styles.vehicleOptions}>
                      <span>차량현장 진입:</span>
                      <label>
                        <input
                          type="radio"
                          name="vehicle"
                          value="true"
                          checked={vehicleEntryPossible === true}
                          onChange={() => setVehicleEntryPossible(true)}
                        />
                        진입가능
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="vehicle"
                          value="false"
                          checked={vehicleEntryPossible === false}
                          onChange={() => setVehicleEntryPossible(false)}
                        />
                        진입불가
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.row}>
                <div className={`${styles.cell} ${styles.label}`}></div>
                <div className={styles.cell}>
                  <div className={styles.checkboxOptions}>
                    <label>
                      <input
                        type="checkbox"
                        checked={productInstallationAgreement}
                        onChange={(e) =>
                          setProductInstallationAgreement(e.target.checked)
                        }
                      />
                      (필수) 제품 설치 공간 확보 및 사다리차 추가비용
                      동의합니다.
                    </label>
                    <p className={styles.additionalInfo}>
                      • 가구배송 추가정보 내용입니다. 가구배송 추가정보
                      내용입니다.
                    </p>
                    <label>
                      <input
                        type="checkbox"
                        checked={freeLoweringService}
                        onChange={(e) =>
                          setFreeLoweringService(e.target.checked)
                        }
                      />
                      (선택) 무료내림서비스 신청
                    </label>
                  </div>
                </div>
              </div>
              <div className={styles.row}>
                <div className={`${styles.cell} ${styles.label}`}>
                  배송시 요청사항
                </div>
                <div className="cell">
                  <textarea
                    className={styles.deliveryRequest}
                    placeholder="배송시 요청사항 내용을 입력하세요."
                    value={deliveryRequest}
                    onChange={(e) => setDeliveryRequest(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>

            <hr className={styles.divider} />

            <div className={styles.deliveryDate}>
              <div className={styles.deliveryDateTop}>
                <span>배송 예정일</span>
                <button className={styles.applyProduct}>적용상품보기</button>
              </div>
              <div className={styles.deliveryDateInput}>
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="yyyy/MM/dd"
                  className={styles.hiddenDateInput}
                  customInput={
                    <button className={styles.editButton} style={{ margin: 0 }}>
                      📅배송예정일
                    </button>
                  }
                />

                <div className={styles.dateBox}>
                  <div className={styles.dateBundle}>
                    <div className={styles.dateItem}>{year}</div>
                    <label>년</label>
                  </div>
                  <div className={styles.dateBundle}>
                    <div className={styles.dateItem}>{month}</div>
                    <label>월</label>
                  </div>
                  <div className={styles.dateBundle}>
                    <div className={styles.dateItem}>{day}</div>
                    <label>일</label>
                  </div>
                  <div className={styles.dateBundle}>
                    <div className={styles.dateItem}>{dayOfWeek}</div>
                    <label>요일</label>
                  </div>
                </div>
                <div className={styles.reservationTimer}>
                  <span>⏰ 남은 예약시간은</span>
                  <span className={styles.timerMinute}>12</span>
                  <span>분</span>
                  <span className={styles.timerSecond}>34</span>
                  <span>초 입니다.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={styles.paymentSection}>
          <div className={styles.discountBenefit}>
            <h3>할인/혜택 적용</h3>
            <div className={styles.priceTable}>
              <div className={styles.row}>
                <div className={`${styles.priceCell} ${styles.label}`}>
                  총 상품금액
                </div>
                <div className={styles.priceCell}>
                  {totalOriginalPrice.toLocaleString()}원
                </div>
              </div>
              <div className={styles.row}>
                <div className={`${styles.priceCell} ${styles.label}`}>
                  기본할인
                </div>
                <div className={styles.priceCell}>
                  <div className={styles.priceBundle}>
                    <div className={styles.priceItem}>
                      {totalDiscount.toLocaleString()}
                    </div>
                    <span>원</span>
                  </div>
                </div>
              </div>
              <div className={styles.row}>
                <div className={`${styles.priceCell} ${styles.label}`}>
                  상품쿠폰할인
                </div>
                <div className={styles.priceCell}>
                  <div className={styles.priceBundle}>
                    <div className={styles.priceItem}>0</div>
                    <span>원</span>
                    <button className={styles.couponButton}>
                      적용가능쿠폰
                    </button>
                  </div>
                </div>
              </div>
              <div className={styles.row}>
                <div className={`${styles.priceCell} ${styles.label}`}>
                  포인트
                </div>
                <div className={styles.priceCell}>
                  <div className={styles.priceBundle}>
                    <div className={styles.priceItem}>
                      {pointUsed.toLocaleString()}
                    </div>
                    <span>원(0원 보유)</span>
                    <button className={styles.couponButton}>전체사용</button>
                  </div>
                </div>
              </div>
              <div className={styles.row}>
                <div className={`${styles.priceCell} ${styles.label}`}>
                  결제하실 금액
                </div>
                <div className={styles.priceCell}>
                  {finalPrice.toLocaleString()}원 (배송비 포함)
                </div>
              </div>
            </div>
            {/* <div className={styles.paymentMethod}>
              <h3>결제수단 선택</h3>
              <hr className={styles.divider3} />
              <div className={styles.methodOptions}>
                {paymentMethods.map((method) => (
                  <button
                    key={method}
                    className={`${styles.methodButton} ${
                      selectedMethod === method ? styles.selectedMethod : ''
                    }`}
                    onClick={() => handleMethodClick(method)}
                  >
                    {method}
                  </button>
                ))}
              </div>
              <div className={styles.agreement1}>
                <input type="checkbox" id="remember-method" />
                <label htmlFor="remember-method">
                  선택한 결제수단을 다음에도 사용
                </label>
              </div>
            </div> */}
          </div>
          <div className={styles.finalPayment}>
            <h3>최종 결제 금액</h3>
            <hr className={styles.divider1} />
            <div className={styles.detailRow}>
              <span>총 상품금액</span>
              <span className={styles.amount}>
                {totalOriginalPrice.toLocaleString()}원
              </span>
            </div>
            <div className={styles.detailRow}>
              <span>총 배송비</span>
              <span className={styles.amount}>
                {shippingPrice.toLocaleString()}원
              </span>
            </div>
            <div className={styles.detailRow}>
              <span>총 할인금액</span>
              <span className={styles.amount}>
                {totalDiscount.toLocaleString()}원
              </span>
            </div>
            <div className={styles.detailRow}>
              <span>포인트 사용금액</span>
              <span className={styles.amount}>
                {pointUsed.toLocaleString()}원
              </span>
            </div>
            <hr className={styles.divider2} />
            <div className={styles.detailRow}>
              <span>최종결제금액</span>
              <span
                className={styles.amount}
                style={{ fontSize: '20px', color: 'red' }}
              >
                {finalPrice.toLocaleString()}원
              </span>
            </div>
            <div className={styles.agreement}>
              <input type="checkbox" id="agree" />
              <label htmlFor="agree">
                하기 필수약관을 모두 확인하였으며 결제에 동의합니다.
              </label>
            </div>
            <button className={styles.payButton} onClick={handleOrderSubmit}>
              결제하기
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default OrderForm;
