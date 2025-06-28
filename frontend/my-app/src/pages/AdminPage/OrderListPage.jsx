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

  const handleShippingComplete = async (orderId) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/api/v1/sellers/orders/${orderId}/deliver`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
      
      // 상태 업데이트 후 목록 새로고침
      fetchOrders(currentPage);
      alert('발송 완료 처리되었습니다.');
    } catch (err) {
      console.error('발송 완료 처리 실패:', err);
      alert('발송 완료 처리에 실패했습니다.');
    }
  };

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
      case '결제완료':
        return styles.paymentComplete;
      case '결제실패':
        return styles.paymentFailed;
      default:
        return '';
    }
  };

  const getPaymentClass = (status) => {
    return status === '결제완료' ? styles.paymentComplete : styles.paymentFailed;
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
        <h2 className={styles.orderPageTitle}>주문 관리</h2>
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
                    {order.orderStatus}
                  </span>
                </td>
                <td>
                  <span className={`${styles.statusTag} ${getPaymentClass(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td>{order.totalPrice ? order.totalPrice.toLocaleString() + '원' : '-'}</td>
                <td>
                  <div className={styles.actionButtons}>
                    {order.orderStatus === '발송완료' || order.orderStatus === 'DELIVERED' ? (
                      <span className={styles.shippingDoneBadge}>발송완료</span>
                    ) : (
                      <button
                        className={styles.shippingBtn}
                        disabled={order.orderStatus === '주문취소'}
                        onClick={() => handleShippingComplete(order.orderId)}
                      >
                        발송완료 처리
                      </button>
                    )}
                    <button
                      className={styles.detailBtn}
                      onClick={() => handleOrderClick(order)}
                    >
                      상세보기
                    </button>
                  </div>
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
            className={`${styles.pageButton} ${currentPage === pageNum ? styles.activePage : ''}`}
          >
            {pageNum}
          </button>
        ))}
      </div>

      {isModalOpen && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default OrderListPage; 