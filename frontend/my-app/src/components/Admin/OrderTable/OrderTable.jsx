import React from 'react';
import styles from './OrderTable.module.css';

const orders = [
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
    orderStatus: '배송완료',
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
];

const getStatusClass = (status) => {
  switch (status) {
    case '접수대기':
      return styles.statusPending;
    case '접수완료':
      return styles.statusConfirmed;
    case '배송중':
      return styles.statusShipping;
    case '배송완료':
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
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>주문 현황</h2>

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
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.orderCode}</td>
              <td>{order.orderDate}</td>
              <td>{order.customerName}</td>
              <td>{order.customerAddress}</td>
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
              <td>{order.totalAmount.toLocaleString()} 원</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
