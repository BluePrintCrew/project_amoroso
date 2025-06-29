import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderDetailModal from "./OrderDetailModal";
import "./OrderManagement.css";
import { ELEVATOR_RANGE_LABELS } from '../../constants/enums';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOrder, setModalOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          setError("로그인이 필요합니다.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/api/v1/orders/my-orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log("API 응답 데이터:", response.data); // API 응답 확인용 로그
        
        // API 응답 데이터를 컴포넌트에서 사용하는 형태로 변환
        const formattedOrders = response.data.map(order => {
          console.log("주문 데이터:", order); // 각 주문 데이터 확인용 로그
          console.log("주문 아이템:", order.orderItems); // 주문 아이템 확인용 로그
          
          return {
            orderId: order.orderId,
            orderDate: new Date(order.createdAt).toLocaleString('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            }).replace(/\./g, '.').replace(',', ''),
            totalAmount: order.totalPrice || order.totalAmount,
            sellerPhoneNumber: order.sellerPhoneNumber || "문의 필요",
            orderStatus: order.orderStatus,
            paymentStatus: order.paymentStatus,
            createdAt: order.createdAt,
            productInstallationAgreement: order.productInstallationAgreement,
            freeLoweringService: order.freeLoweringService,
            vehicleEntryPossible: order.vehicleEntryPossible,
            elevatorType: order.elevatorType,
            elevatorRange: order.elevatorRange,
            orderItems: order.orderItems || []
          };
        });
        
        setOrders(formattedOrders);
      } catch (err) {
        console.error("주문 내역 조회 오류:", err);
        if (err.response?.status === 401) {
          setError("로그인이 필요합니다.");
        } else if (err.response?.status === 404) {
          setError("주문 내역을 찾을 수 없습니다.");
        } else {
          setError("주문 내역을 불러오지 못했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleRowClick = (order) => {
    setModalOrder(order);
  };

  if (loading) return (
    <div className="order-list-container">
      <div className="order-list-title-row">
        <span className="order-list-title">구매 내역 &gt;</span>
      </div>
      <div className="order-list-title-divider"></div>
      <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
        주문 내역을 불러오는 중...
      </div>
    </div>
  );

  if (error) return (
    <div className="order-list-container">
      <div className="order-list-title-row">
        <span className="order-list-title">구매 내역 &gt;</span>
      </div>
      <div className="order-list-title-divider"></div>
      <div style={{ textAlign: 'center', padding: '40px', color: '#e74c3c' }}>
        오류: {error}
      </div>
    </div>
  );

  return (
    <div className="order-list-container">
      <div className="order-list-title-row">
        <span className="order-list-title">구매 내역 &gt;</span>
      </div>
      <div className="order-list-title-divider"></div>
      <table className="order-list-table">
        <thead>
          <tr>
            <th>주문번호</th>
            <th>주문일시</th>
            <th>상품명</th>
            <th>결제금액</th>
            <th>결제상태</th>
            <th>발송상태</th>
            <th>엘리베이터</th>
            <th>판매자 전화번호</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="8" className="no-orders-message">
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
                <td>
                  <span className={`payment-status-${order.paymentStatus?.toLowerCase()}`}>
                    {getPaymentStatusKR(order.paymentStatus)}
                  </span>
                </td>
                <td>
                  <span className={`order-status-${order.orderStatus?.toLowerCase()}`}>
                    {getOrderStatusKR(order.orderStatus)}
                  </span>
                </td>
                <td>
                  {ELEVATOR_RANGE_LABELS[order.elevatorRange] || '-'}
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

function getOrderStatusKR(status) {
  const ORDER_STATUS_KR = {
    PAYMENT_COMPLETED: "결제완료",
    PREPARING: "상품 준비중",
    DELIVERING: "배송중",
    DELIVERED: "배송완료",
    CANCELLED: "주문취소",
    // 필요시 추가
  };
  return ORDER_STATUS_KR[status] || status;
}

function getPaymentStatusKR(status) {
  const PAYMENT_STATUS_KR = {
    COMPLETED: "결제완료",
    PENDING: "결제대기",
    FAILED: "결제실패",
    // 필요시 추가
  };
  return PAYMENT_STATUS_KR[status] || status;
}

export default OrderList; 