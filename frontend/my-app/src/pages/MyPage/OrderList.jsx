import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderDetailModal from "./OrderDetailModal";
import "./OrderManagement.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// 목데이터 예시
const MOCK_ORDERS = [
  {
    orderId: 1001,
    orderDate: "2024.06.19 12:34",
    totalAmount: 3306000,
    sellerPhoneNumber: "010-1234-5678",
    orderStatus: "PAYMENT_COMPLETED",
    paymentStatus: "COMPLETED",
    createdAt: "2024.06.19 12:34",
    productInstallationAgreement: true,
    freeLoweringService: true,
    vehicleEntryPossible: true,
    elevatorType: "승객용",
    orderItems: [
      { 
        productName: "상품명이 들어갑니다. 최대 2줄까지 출력되며 길어지면 .. 처리됩니다.", 
        productOptionName: "옵션: 블랙, XL",
        selectedOptionValue: "블랙",
        additionalOptionName: "추가 옵션",
        quantity: 1,
        finalPrice: 3306000,
        mainImageUri: "https://via.placeholder.com/48x48"
      }
    ]
  },
  {
    orderId: 1002,
    orderDate: "2024.06.19 12:34",
    totalAmount: 3306000,
    sellerPhoneNumber: "010-5678-1234",
    orderStatus: "PREPARING",
    paymentStatus: "COMPLETED",
    createdAt: "2024.06.18 15:20",
    productInstallationAgreement: false,
    freeLoweringService: false,
    vehicleEntryPossible: true,
    elevatorType: "화물용",
    orderItems: [
      { 
        productName: "상품명이 들어갑니다. 최대 2줄까지 출력되며 길어지면 .. 처리됩니다.", 
        productOptionName: "옵션: 화이트, L",
        selectedOptionValue: "화이트",
        additionalOptionName: null,
        quantity: 2,
        finalPrice: 1653000,
        mainImageUri: "https://via.placeholder.com/48x48"
      },
      { 
        productName: "다른 상품명입니다.", 
        productOptionName: "옵션: 그레이, M",
        selectedOptionValue: "그레이",
        additionalOptionName: "설치 서비스",
        quantity: 1,
        finalPrice: 1653000,
        mainImageUri: "https://via.placeholder.com/48x48"
      }
    ]
  }
];

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOrder, setModalOrder] = useState(null);

  useEffect(() => {
    // 실제 API 호출 대신 목데이터 사용
    setOrders(MOCK_ORDERS);
    setLoading(false);
    
    // 실제 API 연동 시 아래 주석 해제
    /*
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_BASE_URL}/api/v1/orders/my-orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data);
      } catch (err) {
        setError("주문 내역을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
    */
  }, []);

  const handleRowClick = (order) => {
    setModalOrder(order);
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;

  return (
    <div className="order-list-container">
      <div className="order-list-title-row">
        <span className="order-list-title">구매 내역</span>
      </div>
      <table className="order-list-table">
        <thead>
          <tr>
            <th>주문번호</th>
            <th>주문일시</th>
            <th>상품명</th>
            <th>결제금액</th>
            <th>판매자 전화번호</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="5" className="no-orders-message">
                주문 내역이 없습니다.
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.orderId} onClick={() => handleRowClick(order)}>
                <td>{order.orderId}</td>
                <td>{order.orderDate}</td>
                <td>
                  <div style={{ fontWeight: 600 }}>
                    {order.orderItems[0]?.productName || "상품명 없음"}
                  </div>
                  {order.orderItems.length > 1 && (
                    <span>외 {order.orderItems.length - 1}개</span>
                  )}
                </td>
                <td style={{ color: "#e74c3c", fontWeight: 700 }}>
                  {order.totalAmount?.toLocaleString()}원
                </td>
                <td>{order.sellerPhoneNumber}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div style={{ marginTop: 16, color: '#666', fontSize: '1rem', textAlign: 'right', fontFamily: 'Pretendard, sans-serif' }}>
        판매자 전화번호로 문의해보세요
      </div>
      
      {/* 주문 상세 모달 */}
      {modalOrder && (
        <OrderDetailModal
          order={modalOrder}
          onClose={() => setModalOrder(null)}
        />
      )}
    </div>
  );
}

export default OrderList; 