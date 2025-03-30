import 'react-datepicker/dist/react-datepicker.css';
import React, { useState } from 'react';
import axios from 'axios';
import CartSummary from '../../components/CartSummary/CartSummary';
import DatePicker from 'react-datepicker';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import PageLayout from '../../components/PageLayout/PageLayout';
import styles from './OrderForm.module.css';

const storeId = process.env.REACT_APP_PORTONE_STORE_ID;
const clientKey = process.env.REACT_APP_PORTONE_CLIENT_KEY;
const channelKey = process.env.REACT_APP_PORTONE_CHANNEL_KEY

const paymentMethods = [
    '퀵 계좌이체',
    '신용카드(일반)',
    '신용카드(법인)',
    '결제수단1',
    '토스 페이',
    '카카오 페이',
    '네이버 페이',
    '페이코 결제',
];

const OrderForm = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedMethod, setSelectedMethod] = useState(null);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const formatDate = (date) => {
        if (!date) return { year: '', month: '', day: '', dayOfWeek: '' };
        const year = date.getFullYear().toString();
        const month = (date.getMonth() + 1).toString();
        const day = date.getDate().toString();
        const dayOfWeek = date.toLocaleDateString('ko-KR', { weekday: 'long' }).substring(0, 1);
        return { year, month, day, dayOfWeek };
    };

    const { year, month, day, dayOfWeek } = formatDate(selectedDate);

    const handleMethodClick = (method) => {
        setSelectedMethod(method);
    };


    const handleOrderSubmit = async () => {
        try {
            const token = localStorage.getItem('access_token');

            // 1. 주문 생성
            const orderResponse = await axios.post(
                'http://localhost:8080/api/v1/orders',
                {
                    totalPrice: 100,
                    orderItems: [
                        { productId: 1, quantity: 1 }
                    ],
                    userAddressId: 1,
                    deliveryRequest: "문 앞에 놓아주세요",
                    freeLoweringService: true,
                    productInstallationAgreement: true,
                    vehicleEntryPossible: true,
                    elevatorType: "ONE_TO_SEVEN"
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const orderId = orderResponse.data.orderId;

            // 2. 결제 요청
            const { IMP } = window;
            if (!IMP) {
                alert("결제 모듈이 로드되지 않았습니다.");
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
                    amount: 100,
                    buyer_email: 'test@example.com',
                    buyer_name: '홍길동',
                    buyer_tel: '010-1234-5678',
                    buyer_addr: '서울특별시 강남구 삼성동',
                    buyer_postcode: '123-456',
                    currency: 'KRW',
                    useCardPoint: false
                },
                async function (rsp) {
                    if (rsp.success) {
                        try {
                            const verifyRes = await axios.post(
                                'http://localhost:8080/api/v1/payments/verify',
                                {
                                    impUid: rsp.imp_uid,
                                    orderId: orderId
                                },
                                {
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                        'Content-Type': 'application/json'
                                    }
                                }
                            );

                            if (verifyRes.data.success) {
                                alert("결제가 성공적으로 처리되었습니다.");
                            } else {
                                alert("결제 검증 실패: " + verifyRes.data.message);
                            }
                        } catch (err) {
                            console.error("결제 검증 오류:", err);
                            alert("결제 검증 중 오류가 발생했습니다.");
                        }
                    } else {
                        console.error(`결제 실패: ${rsp.error_msg} (코드: ${rsp.error_code})`);
                        alert(`결제 실패: ${rsp.error_msg}`);
                    }
                }
            );
        } catch (error) {
            console.error("주문 또는 결제 처리 중 오류:", error);
            alert("주문 생성 또는 결제 처리 중 오류가 발생했습니다.");
        }
    };
    return (
        <PageLayout>
            <h1 className={styles.orderTitle}>주문서 작성</h1>
            <div className={styles.infoTable}>
                <div className={`${styles.column} ${styles.leftAlign}`}>상품정보</div>
                <div className={`${styles.column} ${styles.centerAlign}`}>수량</div>
                <div className={`${styles.column} ${styles.centerAlign}`}>상품금액</div>
                <div className={`${styles.column} ${styles.centerAlign}`}>배송정보</div>
            </div>
            <div className={styles.infoHeader2}>
                <div className={`${styles.column} ${styles.leftAlign}`}>
                    <span className={styles.mainText}>로젠택배(1)</span>
                    <span className={styles.subText}>배송/설치일 직접 지정 가능</span>
                </div>
            </div>
            <div className={styles.infoBody}>
                <div className={styles.row}>
                    <div className={`${styles.column} ${styles.leftAlign}`}>
                        <div className={styles.productInfo}>
                            <img
                                src="https://placehold.co/120"
                                alt="상품 이미지"
                                className={styles.productImage}
                            />
                            <div>
                                <p>Amoroso</p>
                                <p className={styles.productName}>
                                    제품명 1 제품명 1 제품명 1 제품명 1
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.column} ${styles.centerAlign}`}>
                        <p>1</p>
                    </div>
                    <div className={`${styles.column} ${styles.centerAlign}`}>
                        <p className={styles.price}>3,306,000원</p>
                        <p className={styles.originalPrice}>4,272,000원</p>
                        <button className={styles.discountInfo}>할인내역</button>
                    </div>
                    <div className={`${styles.column} ${styles.centerAlign}`}>
                        <p className={styles.shipping1}>무료배송</p>
                        <p className={styles.shipping2}>지역별/옵션별 배송비 추가</p>
                        <p className={styles.shipping3}>지역별 배송비</p>
                    </div>
                </div>
            </div>
            <div className={styles.infoBottom}>
                <p>
                    • 배송일자 안내 내용입니다. 배송일자 안내 내용입니다. 배송일자 안내 내용입니다.
                </p>
            </div>
            <CartSummary />
            <div className={styles.delivery}>
                <div className={styles.sectionHeader}>
                    <div>
                        <h2 className={styles.sectionTitle}>주문상품 배송정보</h2>
                        <p className={styles.sectionDescription}>
                            • 주문상품 배송정보 안내입니다. 주문상품 배송정보 안내입니다.
                            <br />• 주문상품 배송정보 안내입니다. 주문상품 배송정보 안내입니다.
                        </p>
                    </div>
                </div>
                <hr className={styles.sepLine} />
                <div className={styles.deliveryInfo}>
                    <h3 className={styles.subTitle}>배송정보</h3>
                    <div className={styles.deliveryTable}>
                        <div className={styles.row}>
                            <div className={`${styles.cell} ${styles.label}`}>
                                주문자명/연락처<span className={styles.required}>*</span>
                            </div>
                            <div className={styles.cell}>
                                홍길동 / 010-1234-5678
                                <button className={styles.editButton}>주문자 정보 변경</button>
                            </div>
                        </div>
                        <div className={styles.row}>
                            <div className={`${styles.cell} ${styles.label}`}>
                                배송지 주소<span className={styles.required}>*</span>
                            </div>
                            <div className={styles.cell}>
                                기본배송지: [홍길동] 홍길동
                                <br />
                                (12345) 00시 00구 00번길 12-34 000아파트 5층 607호
                                <button className={styles.editButton}>배송지 목록</button>
                                <br />
                                010-1234-5678
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
                                            <input type="radio" name="elevator" />
                                            1~7인승
                                        </label>
                                        <label>
                                            <input type="radio" name="elevator" />
                                            8~10인승
                                        </label>
                                        <label>
                                            <input type="radio" name="elevator" />
                                            11인승 이상
                                        </label>
                                        <label>
                                            <input type="radio" name="elevator" />
                                            없음
                                        </label>
                                    </div>
                                    <div className={styles.vehicleOptions}>
                                        <span>차량현장 진입:</span>
                                        <label>
                                            <input type="radio" name="vehicle" />
                                            진입가능
                                        </label>
                                        <label>
                                            <input type="radio" name="vehicle" />
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
                                        <input type="checkbox" />
                                        (필수) 제품 설치 공간 확보 및 사다리차 추가비용 동의합니다.
                                    </label>
                                    <p className={styles.additionalInfo}>
                                        • 가구배송 추가정보 내용입니다. 가구배송 추가정보 내용입니다.
                                    </p>
                                    <label>
                                        <input type="checkbox" />
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
                                        배송예정일
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
                                <span> 남은 예약시간은</span>
                                <span className={styles.timerMinute}>12</span>
                                <span>분</span>
                                <span className={styles.timerSecond}>34</span>
                                <span>초 입니다.</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.paymentSection}>
                    <div className={styles.discountBenefit}>
                        <h3>할인/혜택 적용</h3>
                        <div className={styles.priceTable}>
                            <div className={`${styles.priceCell} ${styles.label}`}>
                                총 상품금액
                            </div>
                            <div className={styles.priceCell}>4,272,000원</div>
                        </div>
                        <div className={styles.row}>
                            <div className={`${styles.priceCell} ${styles.label}`}>
                                기본할인
                            </div>
                            <div className={styles.priceCell}>
                                <div className={styles.priceBundle}>
                                    <div className={styles.priceItem}>0</div>
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
                                    <div className={styles.priceItem}>966,000</div>
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
                                    <div className={styles.priceItem}>0</div>
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
                                3,306,000원 (배송비 포함)
                            </div>
                        </div>
                    </div>
                    <div className={styles.paymentMethod}>
                        <h3>결제수단 선택</h3>
                        <hr className={styles.divider3} />
                        <div className={styles.methodOptions}>
                            {paymentMethods.map((method) => (
                                <button
                                    key={method}
                                    className={`${styles.methodButton} ${selectedMethod === method ? styles.selectedMethod : ''}`}
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
                    </div>
                    <div className={styles.finalPayment}>
                        <h3>최종 결제 금액</h3>
                        <hr className={styles.divider1} />
                        <div className={styles.detailRow}>
                            <span>총 상품금액</span>
                            <span className={styles.amount}>4,272,000원</span>
                        </div>
                        <div className={styles.detailRow}>
                            <span>총 배송비</span>
                            <span className={styles.amount}>0원</span>
                        </div>
                        <div className={styles.detailRow}>
                            <span>총 할인금액</span>
                            <span className={styles.amount}>966,000원</span>
                        </div>
                        <div className={styles.detailRow}>
                            <span>포인트 사용금액</span>
                            <span className={styles.amount}>0원</span>
                        </div>
                        <hr className={styles.divider2} />
                        <div className={styles.detailRow}>
                            <span>최종결제금액</span>
                            <span className={styles.amount} style={{ fontSize: '20px', color: 'red' }}>
                                3,306,000원
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