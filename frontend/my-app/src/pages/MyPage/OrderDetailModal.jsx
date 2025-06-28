import React from "react";
import "./OrderManagement.css";

const ORDER_STATUS_KR = {
  PAYMENT_COMPLETED: "결제완료",
  PREPARING: "상품 준비중",
  DELIVERING: "배송중",
  DELIVERED: "배송완료",
  CANCELLED: "주문취소",
  // 필요시 추가
};
const PAYMENT_STATUS_KR = {
  COMPLETED: "결제완료",
  PENDING: "결제대기",
  FAILED: "결제실패",
  // 필요시 추가
};
function getOrderStatusKR(status) {
  return ORDER_STATUS_KR[status] || status;
}
function getPaymentStatusKR(status) {
  return PAYMENT_STATUS_KR[status] || status;
}

function OrderDetailModal({ order, onClose }) {
  if (!order) return null;

  // 기본 이미지 경로
  const DEFAULT_IMG = "/default-furniture.png";

  return (
    <div className="modal-backdrop">
      <div className="order-detail-modal furniture-modal">
        <div className="order-list-title-row" style={{ marginBottom: 24 }}>
          <span className="order-list-title">주문 상세</span>
          <button className="modal-close-btn modal-close-btn-furniture" onClick={onClose}>×</button>
        </div>
        <div className="order-detail-info">
          <div><b>주문번호</b> {order.orderId}</div>
          <div><b>주문일시</b> {order.createdAt}</div>
          <div><b>주문상태</b> {getOrderStatusKR(order.orderStatus)}</div>
          <div><b>결제상태</b> {getPaymentStatusKR(order.paymentStatus)}</div>
        </div>
        <div className="order-detail-products">
          {order.orderItems.map((item, idx) => (
            <div className="order-product-card" key={idx}>
              <div className="order-product-img-wrap">
                {item.mainImageUri ? (
                  <img
                    src={item.mainImageUri}
                    alt="상품 이미지"
                    className="order-product-img"
                    onError={e => { e.target.onerror = null; e.target.src = DEFAULT_IMG; }}
                  />
                ) : (
                  <img src={DEFAULT_IMG} alt="기본 이미지" className="order-product-img" />
                )}
              </div>
              <div className="order-product-info">
                <div className="order-product-name" title={item.productName}>{item.productName}</div>
                <div className="order-product-option-row">
                  <span className="order-product-option">{item.productOptionName}</span>
                  {item.selectedOptionValue && <span className="order-product-option-sub">{item.selectedOptionValue}</span>}
                  {item.additionalOptionName && <span className="order-product-option-sub">+{item.additionalOptionName}</span>}
                </div>
                <div className="order-product-meta">
                  <span>수량 <b>{item.quantity}</b>개</span>
                  <span className="order-product-price">{item.finalPrice?.toLocaleString()}원</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="order-detail-divider" />
        <div className="order-detail-extra">
          <div><b>총 결제금액</b> <span className="order-detail-total-price">{(order.totalPrice ?? order.totalAmount ?? 0).toLocaleString()}원</span></div>
          <div className="order-detail-install">
            <b>설치/하역/차량진입/엘리베이터</b>
            <ul className="order-detail-install-list">
              <li>
                <span className={order.productInstallationAgreement ? "ok" : "no"}>
                  {order.productInstallationAgreement ? "설치 동의" : "설치 미동의"}
                </span>
              </li>
              <li>
                사다리차/하역
                <span className={order.freeLoweringService ? "ok" : "no"}>
                  {order.freeLoweringService ? "O" : "X"}
                </span>
              </li>
              <li>
                차량진입
                <span className={order.vehicleEntryPossible ? "ok" : "no"}>
                  {order.vehicleEntryPossible ? "O" : "X"}
                </span>
              </li>
              <li>
                엘리베이터
                <span className="elevator">{order.elevatorType || "없음"}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="order-detail-seller-guide">
          판매자 전화번호로 문의해보세요
        </div>
      </div>
    </div>
  );
}

export default OrderDetailModal; 