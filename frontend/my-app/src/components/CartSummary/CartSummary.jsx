import React from "react";
import "./CartSummary.css";

function CartSummary({ cartItems = [] }) {
  // 주어진 로직 - 총 상품금액, 총 결제금액, 할인액 계산
  const totalOriginalPrice = cartItems.reduce(
    (sum, item) => sum + (item.originalPrice || 0) * (item.quantity || 1),
    0
  );
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );
  const totalDiscount = totalOriginalPrice - totalPrice;


  const shippingPrice = 0;       // 예시로 고정 0원
  const point = 9918;           // 예시로 고정

  return (
    <div className="order-summary">
      {/* 상단 헤더 */}
      <div className="summary-header">
        <div>총 상품금액</div>
        <div>총 할인금액</div>
        <div>총 배송비</div>
        <div>총 결제예정금액</div>
      </div>

      {/* 중간 금액 (상품 - 할인 + 배송 = 결제) */}
      <div className="summary-body">
        <span className="price">{totalOriginalPrice.toLocaleString()}원</span>
        <span className="operator">-</span>
        <span className="discount">{totalDiscount.toLocaleString()}원</span>
        <span className="operator">+</span>
        <span className="price">{shippingPrice.toLocaleString()}원</span>
        <span className="operator">=</span>
        <span className="total">{totalPrice.toLocaleString()}원</span>
      </div>

     {/* 하단 상세 영역 */}
<div className="summary-detail">
  <div className="detail-row">
    {/* (1) 상품금액 */}
    <div className="item">
      <span className="label">상품금액</span>
      <span className="value">
        {totalOriginalPrice.toLocaleString()}원
      </span>
    </div>

    {/* (2) 쿠폰할인 + 쿠폰적용 버튼 */}
    <div className="item">
      <div className="coupon-box">
        <span className="label">쿠폰할인</span>
        <button className="coupon-btn">쿠폰적용</button>
      </div>
      <span className="value discount">
        {totalDiscount.toLocaleString()}원
      </span>
    </div>

    {/* (3) 배송비 */}
    <div className="item">
      <span className="label">배송비</span>
      <span className="value">{shippingPrice.toLocaleString()}원</span>
    </div>

    {/* (4) 적립 예정 포인트 */}
    <div className="item">
      <span className="label">적립 예정 포인트</span>
      <span className="value">{point.toLocaleString()}원</span>
    </div>
  </div>
</div>
 
      {/* 안내 문구 */}
      <div className="summary-notice">
        <p>• 배송비가 안내 내용입니다. 배송비가 안내 내용입니다.</p>
        <p>• 배송비가 안내 내용입니다. 배송비가 안내 내용입니다. 배송비가 안내 내용입니다.</p>
      </div>
    </div>
  );
}

export default CartSummary;
