package org.example.amorosobackend.enums;

public enum OrderStatus {
    PAYMENT_PENDING,       // 주문 접수됨 (결제 대기)
    PAYMENT_COMPLETED,          // 결제 완료됨
    PREPARING_SHIPMENT,       // 배송 준비중
    SHIPPING,     // 배송 중
    DELIVERED,       // 배송 완료

    CANCELLED, // 주문 취소
    RETURNED,
    EXCHANGED
}