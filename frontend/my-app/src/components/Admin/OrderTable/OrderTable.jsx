import React, { useEffect, useState } from 'react';
import styles from './OrderTable.module.css';
import { FaChevronRight } from 'react-icons/fa';
import OrderDetailModal from './OrderDetailModal';
import MoreOrderListModal from './MoreOrderListModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const getStatusClass = (status) => {
  switch (status) {
    case '접수대기':
      return styles.statusPending;
    case '접수완료':
      return styles.statusConfirmed;
    case '배송중':
      return styles.statusShipping;
    case '발송완료':
      return styles.statusDelivered;
    case '주문취소':
      return styles.statusCanceled;
    default:
      return '';
  }
};

const getPaymentClass = (status) => {
  return status === '결제완료' ? styles.paymentComplete : styles.paymentFailed;
};

const OrderTable = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);
  const [showMoreOrderListModal, setShowMoreOrderListModal] = useState(false);
  const [orderList, setOrderList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/sellers/order-summary?page=0&size=5`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setOrderList(response.data.content || []);
      } catch (err) {
        setOrderList([]);
        console.error('OrderTable fetch error:', err);
      }
    };
    fetchOrders();
  }, []);

  const handleRowClick = (order) => {
    setSelectedOrder(order);
    setShowOrderDetailModal(true);
  };

  const handleMoreListClick = () => {
    navigate('/admin/order-list');
  };

  const handleCloseOrderDetailModal = () => {
    setShowOrderDetailModal(false);
    setSelectedOrder(null);
  };

  const handleCloseMoreOrderListModal = () => {
    setShowMoreOrderListModal(false);
  };

  const handleShippingComplete = async (id) => {
    try {
      const accessToken = localStorage.getItem('access_token');
      await axios.patch(
        `${API_BASE_URL}/api/v1/sellers/orders/${id}/deliver`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
      setOrderList((prev) =>
        prev.map((order) =>
          order.orderId === id ? { ...order, orderStatus: '발송완료' } : order
        )
      );
      alert('발송 완료 처리되었습니다.');
    } catch (err) {
      alert('발송 완료 처리에 실패했습니다.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleRow}>
        <h2 className={styles.title}>주문 현황</h2>
        <button className={styles.moreListBtn} onClick={handleMoreListClick}>
          <FaChevronRight />
        </button>
      </div>
      <table className={styles.orderTable}>
        <thead>
          <tr>
            <th>주문 코드</th>
            <th>주문 일시</th>
            <th>고객 성함</th>
            <th>고객 주소</th>
            <th>주문 상태</th>
            <th>결제 상태</th>
            <th>총 결제 금액</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {orderList.map((order) => (
            <tr key={order.orderId} onClick={() => handleRowClick(order)} style={{ cursor: 'pointer' }}>
              <td>{order.orderCode}</td>
              <td>{order.orderDate ? new Date(order.orderDate).toLocaleString() : '-'}</td>
              <td>{order.customerName}</td>
              <td>{order.fullAddress}</td>
              <td>
                <span
                  className={`${styles.statusTag} ${getStatusClass(
                    order.orderStatus
                  )}`}
                >
                  {order.orderStatus}
                </span>
              </td>
              <td>
                <span
                  className={`${styles.paymentStatus} ${getPaymentClass(
                    order.paymentStatus
                  )}`}
                >
                  {order.paymentStatus}
                </span>
              </td>
              <td>{order.totalPrice ? order.totalPrice.toLocaleString() + ' 원' : '-'}</td>
              <td onClick={e => e.stopPropagation()}>
                <button
                  className={styles.shippingBtn}
                  disabled={order.orderStatus === '발송완료' || order.orderStatus === '주문취소'}
                  onClick={() => handleShippingComplete(order.orderId)}
                >
                  발송 완료
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* 주문 상세 모달 */}
      {showOrderDetailModal && selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={handleCloseOrderDetailModal} />
      )}
      {/* 더 많은 주문 리스트 모달 */}
      {showMoreOrderListModal && (
        <MoreOrderListModal orderList={orderList} onClose={handleCloseMoreOrderListModal} />
      )}
    </div>
  );
};

export default OrderTable;
