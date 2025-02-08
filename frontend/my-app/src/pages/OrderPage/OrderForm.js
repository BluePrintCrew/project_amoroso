import './OrderForm.css';

import CartSummary from '../../components/CartSummary/CartSummary';
import Header from '../../components/Header/Header';
import React from 'react';

const OrderForm = () => {
  return (
    <div className="order-page">
      <Header />
      <h1 className="order-title">주문서 작성</h1>
      <div className="info-table">
        <div className="info-header1">
          <div className="column left-align">상품정보</div>
          <div className="column center-align">수량</div>
          <div className="column center-align">상품금액</div>
          <div className="column center-align">배송정보</div>
        </div>
        <div className="info-header2">
          <div className="column left-align">
            <span className="main-text">로젠택배(1)</span>
            <span className="sub-text">배송/설치일 직접 지정 가능</span>
          </div>
        </div>
        <div className="info-body">
          <div className="row">
            <div className="column left-align">
              <div className="product-info">
                <img
                  src="https://placehold.co/120"
                  alt="상품 이미지"
                  className="product-image"
                />
                <div>
                  <p>Amoroso</p>
                  <p className="product-name">
                    제품명 1 제품명 1 제품명 1 제품명 1
                  </p>
                </div>
              </div>
            </div>

            <div className="column center-align">
              <p>1</p>
            </div>

            <div className="column center-align">
              <p className="price">3,306,000원</p>
              <p className="original-price">4,272,000원</p>
              <button className="discount-info">할인내역</button>
            </div>

            <div className="column center-align">
              <p className="shipping1">무료배송</p>
              <p className="shipping2">지역별/옵션별 배송비 추가</p>
              <p className="shipping3">지역별 배송비</p>
            </div>
          </div>
        </div>

        <div className="info-bottom">
          <p>
            • 배송일자 안내 내용입니다. 배송일자 안내 내용입니다. 배송일자 안내
            내용입니다.
          </p>
        </div>
      </div>
      <CartSummary />

      <div className="delivery">
        <div className="section-header">
          <div>
            <h2 className="section-title">주문상품 배송정보</h2>
            <p className="section-description">
              • 주문상품 배송정보 안내입니다. 주문상품 배송정보 안내입니다.
              <br />• 주문상품 배송정보 안내입니다.주문상품 배송정보
              안내입니다.주문상품 배송정보 안내입니다.
            </p>
          </div>
        </div>

        <hr className="sep-line" />

        <div className="delivery-info">
          <h3 className="sub-title">배송정보</h3>
          <div className="delivery-table">
            <div className="row-1">
              <div className="cell label-1">
                주문자명/연락처<span className="required">*</span>
              </div>
              <div className="cell">
                홍길동 / 010-1234-5678
                <button className="edit-button">주문자 정보 변경</button>
              </div>
            </div>
            <div className="row-1">
              <div className="cell label-1">
                배송지 주소<span className="required">*</span>
              </div>
              <div className="cell">
                기본배송지: [홍길동] 홍길동
                <br />
                (12345) 00시 00구 00번길 12-34 000아파트 5층 607호
                <button className="edit-button">배송지 목록</button>
                <br />
                010-1234-5678
              </div>
            </div>
            <div className="row-1" style={{ border: 'none' }}>
              <div className="cell label-1">
                가구배송 추가정보<span className="required">*</span>
              </div>
              <div
                className="cell"
                style={{ borderBottom: '1px solid #e6e6e6' }}
              >
                <div className="radio-buttons">
                  <div className="elevator-options">
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
                  <div className="vehicle-options">
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
            <div className="row-1">
              <div className="cell label-1"></div>
              <div className="cell">
                <div className="checkbox-options">
                  <label>
                    <input type="checkbox" />
                    (필수) 제품 설치 공간 확보 및 사다리차 추가비용 동의합니다.
                  </label>
                  <p className="additional-info">
                    • 가구배송 추가정보 내용입니다. 가구배송 추가정보
                    내용입니다.
                  </p>
                  <label>
                    <input type="checkbox" />
                    (선택) 무료내림서비스 신청
                  </label>
                </div>
              </div>
            </div>
            <div className="row-1">
              <div className="cell label-1">배송시 요청사항</div>
              <div className="cell">
                <textarea
                  className="delivery-request"
                  placeholder="배송시 요청사항 내용을 입력하세요."
                ></textarea>
              </div>
            </div>
          </div>

          <hr className="divider" />

          <div className="delivery-date">
            <div className="delivery-date-top">
              <span>배송 예정일</span>
              <button className="apply-product">적용상품보기</button>
            </div>
            <div className="delivery-date-input">
              <button className="edit-button" style={{ margin: 0 }}>
                📅배송예정일
              </button>
              <div className="date-box">
                <div className="date-bundle">
                  <div className="date-item"></div>
                  <label>년</label>
                </div>
                <div className="date-bundle">
                  <div className="date-item"></div>
                  <label>월</label>
                </div>
                <div className="date-bundle">
                  <div className="date-item"></div>
                  <label>일</label>
                </div>
                <div className="date-bundle">
                  <div className="date-item"></div>
                  <label>요일</label>
                </div>
              </div>
              <div className="reservation-timer">
                <span>⏰ 남은 예약시간은</span>
                <span className="timer-minute">12</span>
                <span>분</span>
                <span className="timer-second">34</span>
                <span>초 입니다.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="payment-section">
          <div className="discount-benefit">
            <h3>할인/혜택 적용</h3>
            <div className="price-table">
              <div className="row-1">
                <div className="price-cell label-1">총 상품금액</div>
                <div className="price-cell">4,272,000원</div>
              </div>
              <div className="row-1">
                <div className="price-cell label-1">기본할인</div>
                <div className="price-cell">
                  <div className="price-bundle">
                    <div className="price-item">0</div>
                    <span>원</span>
                  </div>
                </div>
              </div>
              <div className="row-1">
                <div className="price-cell label-1">상품쿠폰할인</div>
                <div className="price-cell">
                  <div className="price-bundle">
                    <div className="price-item">966,000</div>
                    <span>원</span>
                    <button className="coupon-button">적용가능쿠폰</button>
                  </div>
                </div>
              </div>
              <div className="row-1">
                <div className="price-cell label-1">포인트</div>
                <div className="price-cell">
                  <div className="price-bundle">
                    <div className="price-item">0</div>
                    <span>원(0원 보유)</span>
                    <button className="coupon-button">전체사용</button>
                  </div>
                </div>
              </div>
              <div className="row-1">
                <div className="price-cell label-1">결제하실 금액</div>
                <div className="price-cell">3,306,000원 (배송비 포함)</div>
              </div>
            </div>
            <div className="payment-method">
              <h3>결제수단 선택</h3>
              <hr className="divider3" />
              <div className="method-options">
                <button className="method-button">퀵 계좌이체</button>
                <button className="method-button">신용카드(일반)</button>
                <button className="method-button">신용카드(법인)</button>
                <button className="method-button">결제수단1</button>
                <button className="method-button">토스 페이</button>
                <button className="method-button">카카오 페이</button>
                <button className="method-button">네이버 페이</button>
                <button className="method-button">페이코 결제</button>
              </div>
              <div className="agreement1">
                <input type="checkbox" id="remember-method" />
                <label for="remember-method">
                  선택한 결제수단을 다음에도 사용
                </label>
              </div>
            </div>
          </div>
          <div className="final-payment">
            <h3>최종 결제 금액</h3>
            <hr className="divider1" />
            <div className="detail-row">
              <span>총 상품금액</span>
              <span className="amount">4,272,000원</span>
            </div>
            <div className="detail-row">
              <span>총 배송비</span>
              <span className="amount">0원</span>
            </div>
            <div className="detail-row">
              <span>총 할인금액</span>
              <span className="amount">966,000원</span>
            </div>
            <div className="detail-row">
              <span>포인트 사용금액</span>
              <span className="amount">0원</span>
            </div>
            <hr className="divider2" />
            <div className="detail-row">
              <span>최종결제금액</span>
              <span
                className="amount"
                style={{ fontSize: '20px', color: 'red' }}
              >
                3,306,000원
              </span>
            </div>
            <div className="agreement">
              <input type="checkbox" id="agree" />
              <label for="agree">
                하기 필수약관을 모두 확인하였으며 결제에 동의합니다.
              </label>
            </div>
            <button className="pay-button">결제하기</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
