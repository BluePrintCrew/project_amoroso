import React from "react";
import "./CartSummary.css";

function CartSummary({ cartItems = [] }) {
  const totalOriginalPrice = cartItems
    .reduce((sum, item) => sum + (item.originalPrice || 0) * (item.quantity || 1), 0);

  const totalPrice = cartItems
    .reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

  const totalDiscount = totalOriginalPrice - totalPrice;

  return (
    <>
      <div className="cart-summary">
        {/* 상단 요약 */}
        <div className="summary-header">
          <span className="summary-title">총 상품금액</span>
          <span className="summary-title">총 할인금액</span>
          <span className="summary-title">총 배송비</span>
          <span className="summary-title">총 결제예정금액</span>
        </div>

        {/* 금액과 연산 기호 */}
        <div className="summary-values">
          <span className="summary-price">{totalOriginalPrice.toLocaleString()}원</span>
          <span className="summary-symbol">-</span>
          <span className="summary-price discount">{totalDiscount.toLocaleString()}원</span>
          <span className="summary-symbol">+</span>
          <span className="summary-price">0원</span>
          <span className="summary-symbol">=</span>
          <span className="summary-price final">{totalPrice.toLocaleString()}원</span>
        </div>

        <div className="summary-divider" />

        {/* 상세 정보 */}
        <div className="summary-details">
          <div className="details-row">
            <span>상품금액</span>
            <span>{totalOriginalPrice.toLocaleString()}원</span>
          </div>
          <div className="details-row">
            <span>쿠폰할인</span>
            <button className="coupon-button">쿠폰적용</button>
            <span className="discount">{totalDiscount.toLocaleString()}원</span>
          </div>
          <div className="details-row">
            <span>배송비</span>
            <span>0원</span>
          </div>
          <div className="details-row">
            <span>적립 예정 포인트</span>
            <span>9,918원</span>
          </div>
        </div>
      </div>

      {/* 설명 문구 */}
      <div className="summary-info">
        <p>• 배송비가 안내 내용입니다. 배송비가 안내 내용입니다.</p>
        <p>• 배송비가 안내 내용입니다. 배송비가 안내 내용입니다. 배송비가 안내 내용입니다.</p>
      </div>
    </>
  );
}

export default CartSummary;
