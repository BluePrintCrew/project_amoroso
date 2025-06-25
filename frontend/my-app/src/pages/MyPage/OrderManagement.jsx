import React, { useState, useEffect } from "react";
import axios from "axios";
import "./OrderManagement.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

function OrderManagement() {
  const [statusData, setStatusData] = useState({
    depositConfirm: 0,     // 입금 확인중
    paymentComplete: 0,    // 결제완료
    prepareShipping: 0,    // 배송준비중
    shipping: 0,           // 배송중
    shippingComplete: 0,   // 배송완료
    cancelCount: 0,        // 취소
    returnCount: 0,        // 반품
    exchangeCount: 0       // 교환
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderStatusSummary = async () => {
      try {
        const token = localStorage.getItem('access_token');
        
        if (!token) {
          setError("로그인이 필요합니다");
          setLoading(false);
          return;
        }

        // 두 가지 API 호출 방법이 있습니다.
        // 방법 1: 사용자 프로필 API에서 주문 요약 정보를 가져오기
        const userProfileResponse = await axios.get(`${API_BASE_URL}/api/v1/auth/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log("사용자 프로필 응답:", userProfileResponse.data);

        // 주문 상태 요약 정보가 있는지 확인
        if (userProfileResponse.data.orderStatusSummary) {
          // API 응답에서 주문 상태 요약 정보 추출
          const orderSummary = userProfileResponse.data.orderStatusSummary;
          
          setStatusData({
            depositConfirm: orderSummary.paymentPending || 0,
            paymentComplete: orderSummary.paymentCompleted || 0,
            prepareShipping: orderSummary.preparingShipment || 0,
            shipping: orderSummary.shipping || 0,
            shippingComplete: orderSummary.delivered || 0,
            cancelCount: orderSummary.cancelled || 0,
            returnCount: orderSummary.returned || 0,
            exchangeCount: orderSummary.exchanged || 0
          });
          
          setLoading(false);
          return;
        }

        // 방법 2: 주문 목록 API를 호출하여 상태별로 집계
        const ordersResponse = await axios.get(`${API_BASE_URL}/api/v1/orders/my-orders`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log("주문 목록 응답:", ordersResponse.data);

        // 주문 목록이 있을 경우 상태별로 집계
        if (Array.isArray(ordersResponse.data)) {
          // 각 상태별로 주문 개수 계산
          const summary = {
            depositConfirm: 0,
            paymentComplete: 0,
            prepareShipping: 0,
            shipping: 0,
            shippingComplete: 0,
            cancelCount: 0,
            returnCount: 0,
            exchangeCount: 0
          };

          ordersResponse.data.forEach(order => {
            // API 응답의 주문 상태 필드명에 따라 수정 필요
            switch (order.orderStatus) {
              case 'PAYMENT_PENDING':
                summary.depositConfirm++;
                break;
              case 'PAYMENT_COMPLETED':
                summary.paymentComplete++;
                break;
              case 'PREPARING_SHIPMENT':
                summary.prepareShipping++;
                break;
              case 'SHIPPING':
                summary.shipping++;
                break;
              case 'DELIVERED':
                summary.shippingComplete++;
                break;
              case 'CANCELLED':
                summary.cancelCount++;
                break;
              case 'RETURNED':
                summary.returnCount++;
                break;
              case 'EXCHANGED':
                summary.exchangeCount++;
                break;
              default:
                break;
            }
          });

          setStatusData(summary);
        }
      } catch (error) {
        console.error("주문 상태 요약 데이터 로딩 오류:", error);
        setError("주문 상태 정보를 불러오는데 실패했습니다");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStatusSummary();
  }, []);

  if (loading) {
    return (
      <div className="order-management-container loading">
        <div className="order-management-title">
          <h2>주문 관리 &gt;</h2>
        </div>
        <p>주문 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-management-container error">
        <div className="order-management-title">
          <h2>주문 관리 &gt;</h2>
        </div>
        <p>{error}</p>
      </div>
    );
  }

  // 전체 주문 건수 합계
  const totalOrders = 
    statusData.depositConfirm + 
    statusData.paymentComplete + 
    statusData.prepareShipping + 
    statusData.shipping + 
    statusData.shippingComplete;

  return (
    <div className="order-management-container">
      <div className="order-management-title">
        <h2>주문 관리 &gt;</h2>
        {totalOrders === 0 && (
          <span className="no-orders-message">주문 내역이 없습니다</span>
        )}
      </div>
      {/* Main row with each status in a separate item */}
      <div className="order-steps">
        {/* 1) 입금확인중 */}
        <div className="status-item">
          <div className="status-num">{statusData.depositConfirm}</div>
          <div className="status-label">입금 확인중</div>
        </div>
        <span className="divider">&gt;</span>
        {/* 2) 결제완료 */}
        <div className="status-item">
          <div className="status-num">{statusData.paymentComplete}</div>
          <div className="status-label">결제완료</div>
        </div>
        <span className="divider">&gt;</span>
        {/* 3) 배송준비중 */}
        <div className="status-item">
          <div className="status-num">{statusData.prepareShipping}</div>
          <div className="status-label">배송준비중</div>
        </div>
        <span className="divider">&gt;</span>
        {/* 4) 배송중 */}
        <div className="status-item">
          <div className="status-num">{statusData.shipping}</div>
          <div className="status-label">배송중</div>
        </div>
        <span className="divider">&gt;</span>
        {/* 5) 배송완료 */}
        <div className="status-item">
          <div className="status-num">{statusData.shippingComplete}</div>
          <div className="status-label">배송완료</div>
        </div>
      </div>
      {/* Sub-row for 취소, 반품, 교환 */}
      <div className="order-steps-sub">
        <span className="cancel-text" onClick={() => window.location.href = '/orders?status=cancel'}>
          취소 <strong>{statusData.cancelCount}</strong>
        </span>
        <span onClick={() => window.location.href = '/orders?status=return'}>
          반품 <strong>{statusData.returnCount}</strong>
        </span>
        <span onClick={() => window.location.href = '/orders?status=exchange'}>
          교환 <strong>{statusData.exchangeCount}</strong>
        </span>
      </div>
    </div>
  );
}

export default OrderManagement;