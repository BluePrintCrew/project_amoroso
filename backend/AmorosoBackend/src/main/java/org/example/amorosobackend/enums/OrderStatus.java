package org.example.amorosobackend.enums;

public enum OrderStatus {
    PENDING,       // 주문 접수됨 (결제 대기)
    PAID,          // 결제 완료됨
    SHIPPED,       // 배송 시작됨 (택배사 인계 완료)
    DELIVERED,     // 배송 완료됨 (고객 수령 완료)
    CANCELED       // 주문 취소됨
}