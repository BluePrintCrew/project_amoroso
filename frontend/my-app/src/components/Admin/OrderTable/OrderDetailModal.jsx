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
          <button className={styles.shippingBtn} onClick={() => handleStatusChange('ORDER_CONFIRMED')}>
            주문 접수
          </button>
        );
      case 'ORDER_CONFIRMED':
        return (
          <button className={styles.shippingBtn} onClick={() => handleStatusChange('SHIPPING')}>
            배송 시작
          </button>
        );
      case 'SHIPPING':
        return (
          <button className={styles.shippingBtn} onClick={() => handleStatusChange('DELIVERED')}>
            배송 완료
          </button>
        );
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PAYMENT_COMPLETE':
        return '결제완료';
      case 'PAYMENT_FAILED':
        return '결제실패';
      case 'ORDER_PENDING':
        return '접수대기';
      case 'ORDER_CONFIRMED':
        return '접수완료';
      case 'SHIPPING':
        return '배송중';
      case 'DELIVERED':
        return '배송완료';
      case 'CANCELED':
        return '주문취소';
      default:
        return status;
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
          <button onClick={onClose} className={styles.closeButton}>닫기</button>
        </div>
      </div>
    );
  }
  if (!orderDetails) return null;

  // 실제 데이터에서 추가 정보 추출
  const {
    orderCode,
    orderDate,
    orderStatus,
    paymentStatus,
    paymentMethod,
    deliveryRequest,
    couponDiscount,
    shippingFee,
    totalAmount,
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
    orderItems = [],
  } = orderDetails;

  // 결제수단 한글 변환 예시
  const getPaymentMethodText = (method) => {
    if (!method) return '-';
    switch (method) {
      case 'CARD': return '신용카드';
      case 'BANK_TRANSFER': return '무통장입금';
      case 'KAKAO_PAY': return '카카오페이';
      default: return method;
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>주문 상세 정보</h2>
          <button onClick={onClose} className={styles.closeButton}>×</button>
        </div>
        <div className={styles.modalBody}>
          {/* 주문 정보 */}
          <div className={styles.orderInfo}>
            <h3>주문 정보</h3>
            <table className={styles.infoTable}>
              <tbody>
                <tr>
                  <th>주문번호</th>
                  <td>{orderCode}</td>
                  <th>주문일시</th>
                  <td>{orderDate ? new Date(orderDate).toLocaleString() : '-'}</td>
                </tr>
                <tr>
                  <th>주문상태</th>
                  <td>
                    <span className={`${styles.statusTag} ${styles[orderStatus]}`}>
                      {getStatusText(orderStatus)}
                    </span>
                  </td>
                  <th>결제상태</th>
                  <td>
                    <span className={`${styles.statusTag} ${styles[paymentStatus]}`}>
                      {getStatusText(paymentStatus)}
                    </span>
                  </td>
                </tr>
                <tr>
                  <th>결제수단</th>
                  <td>{getPaymentMethodText(paymentMethod)}</td>
                  <th>배송요청사항</th>
                  <td>{deliveryRequest || '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* 구매자 정보 */}
          <div className={styles.customerInfo}>
            <h3>구매자 정보</h3>
            <table className={styles.infoTable}>
              <tbody>
                <tr>
                  <th>구매자</th>
                  <td>{customerName}</td>
                  <th>이메일</th>
                  <td>{customerEmail || '-'}</td>
                </tr>
                <tr>
                  <th>연락처</th>
                  <td>{customerPhone}</td>
                  <th>배송지</th>
                  <td>{customerAddress}</td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* 상품 정보 */}
          <div className={styles.productInfo}>
            <h3>상품 정보</h3>
            <table className={styles.productTable}>
              <thead>
                <tr>
                  <th>상품명</th>
                  <th>브랜드</th>
                  <th>옵션</th>
                  <th>수량</th>
                  <th>가격</th>
                  <th>합계</th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 600 }}>{item.productName}</td>
                    <td>{item.brandName || '-'}</td>
                    <td>{item.optionName || '-'}</td>
                    <td>{item.quantity}개</td>
                    <td>{item.price ? item.price.toLocaleString() + '원' : '-'}</td>
                    <td>{item.price && item.quantity ? (item.price * item.quantity).toLocaleString() + '원' : '-'}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                {couponDiscount && (
                  <tr>
                    <td colSpan="5" className={styles.totalLabel}>쿠폰/할인</td>
                    <td className={styles.totalAmount}>- {couponDiscount.toLocaleString()}원</td>
                  </tr>
                )}
                {shippingFee && (
                  <tr>
                    <td colSpan="5" className={styles.totalLabel}>배송비</td>
                    <td className={styles.totalAmount}>{shippingFee.toLocaleString()}원</td>
                  </tr>
                )}
                <tr>
                  <td colSpan="5" className={styles.totalLabel}>총 결제금액</td>
                  <td className={styles.totalAmount}>{totalAmount ? totalAmount.toLocaleString() + '원' : '-'}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          {/* 상태 변경 버튼 */}
          <div className={styles.actionButtons}>
            {getStatusButton(orderStatus)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal; 