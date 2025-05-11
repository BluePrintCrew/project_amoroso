import React, { useState } from 'react';
import styles from '../../components/Admin/ProductTable/ProductTable.module.css';
import OrderDetailModal from '../../components/Admin/OrderTable/OrderDetailModal';

// 임시 주문 데이터 (OrderTable과 동일하게 사용)
const initialOrders = [
  {
    id: 1,
    orderCode: '202501201749',
    orderDate: '2025.01.20 17:49',
    customerName: '황길동',
    customerAddress: '서울특별시 종로구 수리연로 44',
    orderStatus: '접수대기',
    paymentStatus: '결제완료',
    totalAmount: 356900,
  },
  {
    id: 2,
    orderCode: '202501201749-1',
    orderDate: '2025.01.20 17:49',
    customerName: '황길동',
    customerAddress: '서울특별시 종로구 삼일대로 454',
    orderStatus: '접수완료',
    paymentStatus: '결제완료',
    totalAmount: 1657900,
  },
  {
    id: 3,
    orderCode: '202501201749-1',
    orderDate: '2025.01.20 17:49',
    customerName: '황길동',
    customerAddress: '서울특별시 종로구 사직로6길 16',
    orderStatus: '배송중',
    paymentStatus: '결제완료',
    totalAmount: 787400,
  },
  {
    id: 4,
    orderCode: '202501201749-1',
    orderDate: '2025.01.20 17:49',
    customerName: '황길동',
    customerAddress: '서울특별시 종로구 이마빌딩',
    orderStatus: '발송완료',
    paymentStatus: '결제완료',
    totalAmount: 2787400,
  },
  {
    id: 5,
    orderCode: '202501201749-1',
    orderDate: '2025.01.20 17:49',
    customerName: '황길동',
    customerAddress: '서울특별시 성동구 상원길 278-17',
    orderStatus: '주문취소',
    paymentStatus: '결제취소',
    totalAmount: 156200,
  },
  // ...더미 데이터 추가 가능
];

const PAGE_SIZE = 10;

const OrderListPage = () => {
  const [page, setPage] = useState(1);
  const [orderList, setOrderList] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);
  const totalPages = Math.ceil(orderList.length / PAGE_SIZE);
  const startIdx = (page - 1) * PAGE_SIZE;
  const endIdx = startIdx + PAGE_SIZE;
  const currentList = orderList.slice(startIdx, endIdx);

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };
  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  // 발송 완료 버튼 클릭 시 상태 변경
  const handleShippingComplete = (id) => {
    setOrderList((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, orderStatus: '발송완료' } : order
      )
    );
  };

  // 주문 행 클릭 시 상세 모달 오픈
  const handleRowClick = (order) => {
    setSelectedOrder(order);
    setShowOrderDetailModal(true);
  };
  const handleCloseOrderDetailModal = () => {
    setShowOrderDetailModal(false);
    setSelectedOrder(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.topContent}>
        <h2 className={styles.title}>주문 전체 리스트</h2>
      </div>
      <table className={styles.productTable}>
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
          {currentList.map((order) => (
            <tr key={order.id} onClick={() => handleRowClick(order)} style={{ cursor: 'pointer' }}>
              <td>{order.orderCode}</td>
              <td>{order.orderDate}</td>
              <td>{order.customerName}</td>
              <td>{order.customerAddress}</td>
              <td>{order.orderStatus}</td>
              <td>{order.paymentStatus}</td>
              <td>{order.totalAmount.toLocaleString()} 원</td>
              <td onClick={e => e.stopPropagation()}>
                <button
                  className={styles.shippingBtn}
                  disabled={order.orderStatus === '발송완료' || order.orderStatus === '주문취소'}
                  onClick={() => handleShippingComplete(order.id)}
                >
                  발송 완료
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* 페이지네이션 UI */}
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 24, gap: 8}}>
        <button onClick={handlePrev} disabled={page === 1} style={{padding: '6px 14px', borderRadius: 5, border: '1px solid #ccc', background: page === 1 ? '#eee' : '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer'}}>이전</button>
        {Array.from({length: totalPages}, (_, i) => (
          <button
            key={i+1}
            onClick={() => setPage(i+1)}
            style={{
              padding: '6px 12px', borderRadius: 5, border: '1px solid #ccc',
              background: page === i+1 ? '#766e68' : '#fff', color: page === i+1 ? '#fff' : '#222', fontWeight: page === i+1 ? 700 : 400,
              cursor: 'pointer'
            }}
          >
            {i+1}
          </button>
        ))}
        <button onClick={handleNext} disabled={page === totalPages} style={{padding: '6px 14px', borderRadius: 5, border: '1px solid #ccc', background: page === totalPages ? '#eee' : '#fff', cursor: page === totalPages ? 'not-allowed' : 'pointer'}}>다음</button>
      </div>
      {/* 주문 상세 모달 */}
      {showOrderDetailModal && selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={handleCloseOrderDetailModal} />
      )}
    </div>
  );
};

export default OrderListPage; 