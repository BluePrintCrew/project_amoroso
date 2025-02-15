import React from "react";
import "./OrderManagement.css";

function OrderManagement() {
  const statusData = {
    depositConfirm: 7,     // 입금 확인중
    paymentComplete: 5,    // 결제완료
    prepareShipping: 4,    // 배송준비중
    shipping: 1,           // 배송중
    shippingComplete: 0,   // 배송완료
    cancelCount: 1,        // 취소
    returnCount: 0,        // 반품
    exchangeCount: 0       // 교환
  };

  return (
    <div className="order-management-container">
      <div className="order-management-title">
        <h2>주문 관리 &gt;</h2>
      </div>

      {/* Main row with each status in a separate item */}
      <div className="order-steps">
        {/* 1) 입금확인중 */}
        <div className="status-item">
          <div className="status-num">{statusData.depositConfirm}</div>
          <div className="status-label">입금 확인중</div>
        </div>
        <span className="divider">&gt;</span>

        {/* 2) 결제완료 */}
        <div className="status-item">
          <div className="status-num">{statusData.paymentComplete}</div>
          <div className="status-label">결제완료</div>
        </div>
        <span className="divider">&gt;</span>

        {/* 3) 배송준비중 */}
        <div className="status-item">
          <div className="status-num">{statusData.prepareShipping}</div>
          <div className="status-label">배송준비중</div>
        </div>
        <span className="divider">&gt;</span>

        {/* 4) 배송중 */}
        <div className="status-item">
          <div className="status-num">{statusData.shipping}</div>
          <div className="status-label">배송중</div>
        </div>
        <span className="divider">&gt;</span>

        {/* 5) 배송완료 */}
        <div className="status-item">
          <div className="status-num">{statusData.shippingComplete}</div>
          <div className="status-label">배송완료</div>
        </div>
      </div>

      {/* Sub-row for 취소, 반품, 교환 */}
      <div className="order-steps-sub">
        <span className="cancel-text">
          취소 <strong>{statusData.cancelCount}</strong>
        </span>
        <span>
          반품 <strong>{statusData.returnCount}</strong>
        </span>
        <span>
          교환 <strong>{statusData.exchangeCount}</strong>
        </span>
      </div>
    </div>
  );
}

export default OrderManagement;
