import React from "react";
import "../MyPage/OrderManagement.css";

// 목데이터 예시
const MOCK_ORDER_DETAIL = {
  orderId: 1001,
  orderDate: "2024.06.19 12:34",
  totalAmount: 3306000,
  sellerPhoneNumber: "010-1234-5678",
  orderItems: [
    { productName: "상품명이 들어갑니다. 최대 2줄까지 출력되며 길어지면 .. 처리됩니다.", productOptionName: "옵션: 블랙, XL" }
  ]
};

function OrderDetail() {
  const order = MOCK_ORDER_DETAIL;
  return (
    <div className="order-list-container">
      <div className="order-list-title-row">
        <span className="order-list-title">주문 상세</span>
      </div>
      <table className="order-list-table">
        <tbody>
          <tr>
            <th style={{ width: 120 }}>주문번호</th>
            <td>{order.orderId}</td>
          </tr>
          <tr>
            <th>주문일</th>
            <td>{order.orderDate}</td>
          </tr>
          <tr>
            <th>상품명</th>
            <td>{order.orderItems[0].productName}</td>
          </tr>
          <tr>
            <th>옵션</th>
            <td>{order.orderItems[0].productOptionName}</td>
          </tr>
          <tr>
            <th>결제금액</th>
            <td style={{ color: "#e74c3c", fontWeight: 700 }}>{order.totalAmount.toLocaleString()}원</td>
          </tr>
          <tr>
            <th>판매자 전화번호</th>
            <td>{order.sellerPhoneNumber}</td>
          </tr>
        </tbody>
      </table>
      <div style={{ marginTop: 16, color: '#666', fontSize: '1rem', textAlign: 'right', fontFamily: 'Pretendard, sans-serif' }}>
        배송 정보는 판매자 전화번호로 문의 바랍니다.
      </div>
    </div>
  );
}

export default OrderDetail; 