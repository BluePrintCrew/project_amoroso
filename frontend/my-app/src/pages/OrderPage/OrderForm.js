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
          <h3>배송정보</h3>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
