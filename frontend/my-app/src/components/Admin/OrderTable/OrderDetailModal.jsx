import React, { useState, useEffect } from 'react';
import styles from '../ProductTable/ProductTable.module.css';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const accessToken = localStorage.getItem('access_token');

const OrderDetailModal = ({ order, onClose, onStatusUpdate }) => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/sellers/orders/${order.orderId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setOrderDetails(response.data);
      } catch (err) {
        console.error('주문 상세 정보 조회 실패:', err);
        setError('주문 상세 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [order.orderId]);

  const handleStatusChange = async (newStatus) => {
    try {
      await onStatusUpdate(order.orderId, newStatus);
      onClose();
    } catch (err) {
      console.error('주문 상태 업데이트 실패:', err);
      alert('주문 상태 업데이트에 실패했습니다.');
    }
  };

  const getStatusButton = (currentStatus) => {
    switch (currentStatus) {
      case 'ORDER_PENDING':
        return (
          <button
            className={styles.shippingBtn}
            onClick={() => handleStatusChange('ORDER_CONFIRMED')}
          >
            주문 접수
          </button>
        );
      case 'ORDER_CONFIRMED':
        return (
          <button
            className={styles.shippingBtn}
            onClick={() => handleStatusChange('SHIPPING')}
          >
            배송 시작
          </button>
        );
      case 'SHIPPING':
        return (
          <button
            className={styles.shippingBtn}
            onClick={() => handleStatusChange('DELIVERED')}
          >
            배송 완료
          </button>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <div>로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <div>{error}</div>
          <button onClick={onClose} className={styles.closeButton}>
            닫기
          </button>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return null;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>주문 상세 정보</h2>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.orderInfo}>
            <h3>주문 정보</h3>
            <table className={styles.infoTable}>
              <tbody>
                <tr>
                  <th>주문번호</th>
                  <td>{orderDetails.orderCode}</td>
                  <th>주문일시</th>
                  <td>{new Date(orderDetails.orderDate).toLocaleString()}</td>
                </tr>
                <tr>
                  <th>주문상태</th>
                  <td>
                    <span className={`${styles.statusTag} ${styles[orderDetails.orderStatus.toLowerCase()]}`}>
                      {orderDetails.orderStatus}
                    </span>
                  </td>
                  <th>결제상태</th>
                  <td>
                    <span className={`${styles.statusTag} ${styles[orderDetails.paymentStatus.toLowerCase()]}`}>
                      {orderDetails.paymentStatus}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.customerInfo}>
            <h3>구매자 정보</h3>
            <table className={styles.infoTable}>
              <tbody>
                <tr>
                  <th>구매자</th>
                  <td>{orderDetails.customerName}</td>
                  <th>연락처</th>
                  <td>{orderDetails.customerPhone}</td>
                </tr>
                <tr>
                  <th>배송지</th>
                  <td colSpan="3">{orderDetails.customerAddress}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.productInfo}>
            <h3>상품 정보</h3>
            <table className={styles.productTable}>
              <thead>
                <tr>
                  <th>상품명</th>
                  <th>수량</th>
                  <th>가격</th>
                  <th>합계</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.orderItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.productName}</td>
                    <td>{item.quantity}개</td>
                    <td>{item.price.toLocaleString()}원</td>
                    <td>{(item.price * item.quantity).toLocaleString()}원</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className={styles.totalLabel}>
                    총 결제금액
                  </td>
                  <td className={styles.totalAmount}>
                    {orderDetails.totalAmount.toLocaleString()}원
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className={styles.actionButtons}>
            {getStatusButton(orderDetails.orderStatus)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal; 