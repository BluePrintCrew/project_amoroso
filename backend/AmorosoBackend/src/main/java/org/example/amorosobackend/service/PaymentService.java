package org.example.amorosobackend.service;

import org.example.amorosobackend.domain.Order;
import org.example.amorosobackend.domain.Payment;
import org.example.amorosobackend.enums.OrderStatus;
import org.example.amorosobackend.repository.OrderRepository;
import org.example.amorosobackend.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PaymentService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    // 주문 번호로 주문 조회
    public Order getOrder(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 주문번호: " + orderId));
    }

    // 주문 상태 업데이트
    @Transactional
    public void updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = getOrder(orderId);
        order.setOrderStatus(status);
        orderRepository.save(order);
    }

    // 결제 정보 저장
    @Transactional
    public Payment savePayment(Payment payment) {
        return paymentRepository.save(payment);
    }
}
