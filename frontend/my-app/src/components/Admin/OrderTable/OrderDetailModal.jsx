import React from 'react';
import styles from './OrderTable.module.css';

const OrderDetailModal = ({ order, onClose }) => {
  // 임시 데이터: 실제로는 order 객체에 포함되어야 함
  const sellerInfo = {
    담당자: '김판매',
    연락처: '010-1234-5678',
    송장번호: 'INV202501201749',
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        <div className={styles.modalTitle}>주문 상세 정보</div>
        <div className={styles.modalContent}>
          <div><b>주문 코드:</b> {order.orderCode}</div>
          <div><b>주문 일시:</b> {order.orderDate}</div>
          <div><b>고객 성함:</b> {order.customerName}</div>
          <div><b>고객 주소:</b> {order.customerAddress}</div>
          <div><b>주문 상태:</b> {order.orderStatus}</div>
          <div><b>결제 상태:</b> {order.paymentStatus}</div>
          <div><b>총 결제 금액:</b> {order.totalAmount.toLocaleString()} 원</div>
          <hr style={{margin: '18px 0'}} />
          <div><b>판매자 담당자:</b> {sellerInfo.담당자}</div>
          <div><b>연락처:</b> {sellerInfo.연락처}</div>
          <div><b>송장번호:</b> {sellerInfo.송장번호}</div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal; 