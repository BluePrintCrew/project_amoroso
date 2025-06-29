import './OrderManagement.css';

import React from 'react';

const ORDER_STATUS_KR = {
  PAYMENT_COMPLETED: '결제완료',
  PREPARING: '상품 준비중',
  DELIVERING: '배송중',
  DELIVERED: '배송완료',
  CANCELLED: '주문취소',
  // 필요시 추가
};
const PAYMENT_STATUS_KR = {
  COMPLETED: '결제완료',
  PENDING: '결제대기',
  FAILED: '결제실패',
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
  const DEFAULT_IMG = '/default-furniture.png';

  return (
    <div className="modal-backdrop">
      <div className="order-detail-modal furniture-modal">
        <div className="order-list-title-row" style={{ marginBottom: 24 }}>
          <span className="order-list-title">주문 상세</span>
          <button
            className="modal-close-btn modal-close-btn-furniture"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {/* 주문 기본 정보 */}
        <div className="order-detail-section">
          <h3 className="order-detail-section-title">주문 정보</h3>
          <div className="order-detail-info-grid">
            <div className="order-detail-info-item">
              <span className="order-detail-label">주문번호</span>
              <span className="order-detail-value">{order.orderId}</span>
            </div>
            <div className="order-detail-info-item">
              <span className="order-detail-label">주문일시</span>
              <span className="order-detail-value">{order.createdAt}</span>
            </div>
            <div className="order-detail-info-item">
              <span className="order-detail-label">주문상태</span>
              <span
                className={`order-detail-value order-status-${order.orderStatus?.toLowerCase()}`}
              >
                {getOrderStatusKR(order.orderStatus)}
              </span>
            </div>
            <div className="order-detail-info-item">
              <span className="order-detail-label">결제상태</span>
              <span
                className={`order-detail-value payment-status-${order.paymentStatus?.toLowerCase()}`}
              >
                {getPaymentStatusKR(order.paymentStatus)}
              </span>
            </div>
          </div>
        </div>

        {/* 상품 정보 */}
        <div className="order-detail-section">
          <h3 className="order-detail-section-title">상품 정보</h3>
          <div className="order-detail-products">
            {order.orderItems?.map((item, idx) => (
              <div className="order-product-card" key={idx}>
                <div className="order-product-img-wrap">
                  {item.mainImageUri ? (
                    <img
                      src={item.mainImageUri}
                      alt="상품 이미지"
                      className="order-product-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_IMG;
                      }}
                    />
                  ) : (
                    <img
                      src={DEFAULT_IMG}
                      alt="기본 이미지"
                      className="order-product-img"
                    />
                  )}
                </div>
                <div className="order-product-info">
                  <div className="order-product-name" title={item.productName}>
                    {item.productName}
                  </div>
                  <div className="order-product-option-row">
                    <span className="order-product-option">
                      {item.productOptionName}
                    </span>
                    {item.selectedOptionValue && (
                      <span className="order-product-option-sub">
                        {item.selectedOptionValue}
                      </span>
                    )}
                    {item.additionalOptionName && (
                      <span className="order-product-option-sub">
                        +{item.additionalOptionName}
                      </span>
                    )}
                  </div>
                  <div className="order-product-meta">
                    <span>
                      수량 <b>{item.quantity}</b>개
                    </span>
                    <span className="order-product-price">
                      {item.finalPrice?.toLocaleString()}원
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 배송 및 설치 정보 */}
        <div className="order-detail-section">
          <h3 className="order-detail-section-title">배송 및 설치 정보</h3>
          <div className="order-detail-install-grid">
            <div className="order-detail-install-item">
              <span className="order-detail-install-label">설치 동의</span>
              <span
                className={`order-detail-install-value ${
                  order.productInstallationAgreement ? 'ok' : 'no'
                }`}
              >
                {order.productInstallationAgreement ? '동의' : '미동의'}
              </span>
            </div>
            <div className="order-detail-install-item">
              <span className="order-detail-install-label">사다리차/하역</span>
              <span
                className={`order-detail-install-value ${
                  order.freeLoweringService ? 'ok' : 'no'
                }`}
              >
                {order.freeLoweringService ? '가능' : '불가능'}
              </span>
            </div>
            <div className="order-detail-install-item">
              <span className="order-detail-install-label">차량진입</span>
              <span
                className={`order-detail-install-value ${
                  order.vehicleEntryPossible ? 'ok' : 'no'
                }`}
              >
                {order.vehicleEntryPossible ? '가능' : '불가능'}
              </span>
            </div>
            <div className="order-detail-install-item">
              <span className="order-detail-install-label">엘리베이터</span>
              <span className="order-detail-install-value elevator">
                {order.elevatorType || '없음'}
              </span>
            </div>
          </div>
        </div>

        {/* 결제 정보 */}
        <div className="order-detail-section">
          <h3 className="order-detail-section-title">결제 정보</h3>
          <div className="order-detail-payment">
            <div className="order-detail-payment-item">
              <span className="order-detail-payment-label">총 결제금액</span>
              <span className="order-detail-total-price">
                {(order.totalPrice ?? order.totalAmount ?? 0).toLocaleString()}
                원
              </span>
            </div>
          </div>
        </div>

        {/* 안내 문구 */}
        <div className="order-detail-seller-guide">
          <div className="order-detail-guide-icon">📞</div>
          <div className="order-detail-guide-text">
            <strong>배송 문의</strong>
            <br />
            판매자 전화번호로 문의해보세요
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailModal;
