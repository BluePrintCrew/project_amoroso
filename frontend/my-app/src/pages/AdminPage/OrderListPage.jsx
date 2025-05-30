import React, { useState, useEffect } from 'react';
import styles from '../../components/Admin/ProductTable/ProductTable.module.css';
import OrderDetailModal from '../../components/Admin/OrderTable/OrderDetailModal';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const PAGE_SIZE = 10;
const accessToken = localStorage.getItem('access_token');

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/sellers/order-summary?page=${page - 1}&size=${PAGE_SIZE}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      
      setOrders(response.data.content);
      setTotalPages(response.data.totalPages);
      setCurrentPage(page);
    } catch (err) {
      console.error('주문 목록 조회 실패:', err);
      setError('주문 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, []);

  const handlePageChange = (newPage) => {
    fetchOrders(newPage);
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/v1/sellers/orders/${orderId}/deliver`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      
      // 상태 업데이트 후 목록 새로고침
      fetchOrders(currentPage);
    } catch (err) {
      console.error('주문 상태 업데이트 실패:', err);
      alert('주문 상태 업데이트에 실패했습니다.');
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'PAYMENT_COMPLETE':
        return styles.paymentComplete;
      case 'PAYMENT_FAILED':
        return styles.paymentFailed;
      case 'ORDER_PENDING':
        return styles.statusPending;
      case 'ORDER_CONFIRMED':
        return styles.statusConfirmed;
      case 'SHIPPING':
        return styles.statusShipping;
      case 'DELIVERED':
        return styles.statusDelivered;
      case 'CANCELED':
        return styles.statusCanceled;
      default:
        return '';
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
    return <div className={styles.container}>로딩 중...</div>;
  }

  if (error) {
    return <div className={styles.container}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.titleRow}>
        <h2 className={styles.title}>주문 관리</h2>
      </div>

      <table className={styles.orderTable}>
        <thead>
          <tr>
            <th>주문번호</th>
            <th>주문일시</th>
            <th>구매자</th>
            <th>배송지</th>
            <th>주문상태</th>
            <th>결제상태</th>
            <th>결제금액</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={8} style={{ textAlign: 'center', color: '#888', padding: '40px 0' }}>
                주문 내역이 없습니다.
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.orderId}>
                <td>{order.orderCode}</td>
                <td>{new Date(order.orderDate).toLocaleString()}</td>
                <td>{order.customerName}</td>
                <td>{order.fullAddress}</td>
                <td>
                  <span className={`${styles.statusTag} ${getStatusClass(order.orderStatus)}`}>
                    {getStatusText(order.orderStatus)}
                  </span>
                </td>
                <td>
                  <span className={`${styles.statusTag} ${getStatusClass(order.paymentStatus)}`}>
                    {getStatusText(order.paymentStatus)}
                  </span>
                </td>
                <td>{order.totalPrice.toLocaleString()}원</td>
                <td>
                  <button
                    className={styles.shippingBtn}
                    onClick={() => handleOrderClick(order)}
                  >
                    상세보기
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className={styles.pagination}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            className={`${styles.pageButton} ${
              currentPage === pageNum ? styles.activePage : ''
            }`}
          >
            {pageNum}
          </button>
        ))}
      </div>

      {isModalOpen && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={handleCloseModal}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
};

export default OrderListPage; 