import React, { useState } from 'react';
import styles from '../ProductTable/ProductTable.module.css';

const PAGE_SIZE = 10;

const MoreOrderListModal = ({ orderList, onClose }) => {
  const [page, setPage] = useState(1);
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

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        padding: '40px 40px 32px 40px', minWidth: 700, maxWidth: '90vw', minHeight: 320, position: 'relative',
        animation: 'modalShow 0.2s'
      }}>
        <button style={{position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888'}} onClick={onClose}>&times;</button>
        <div className={styles.title} style={{marginBottom: 24}}>주문 전체 리스트</div>
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
            </tr>
          </thead>
          <tbody>
            {currentList.map((order) => (
              <tr key={order.id}>
                <td>{order.orderCode}</td>
                <td>{order.orderDate}</td>
                <td>{order.customerName}</td>
                <td>{order.customerAddress}</td>
                <td>{order.orderStatus}</td>
                <td>{order.paymentStatus}</td>
                <td>{order.totalAmount.toLocaleString()} 원</td>
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
      </div>
    </div>
  );
};

export default MoreOrderListModal; 