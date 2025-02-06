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
                  <p>한샘 설치기사</p>
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
              <div className="price-info">
                <p className="price">3,306,000원</p>
                <p className="original-price">4,272,000원</p>
                <button className="discount-info">할인내역</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CartSummary />
    </div>
  );
};

export default OrderForm;
