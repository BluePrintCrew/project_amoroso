package org.example.amorosobackend.service;

import org.springframework.stereotype.Service;



import lombok.RequiredArgsConstructor;
import org.example.amorosobackend.domain.Order;
import org.example.amorosobackend.domain.User;
import org.example.amorosobackend.repository.OrderRepository;
import org.example.amorosobackend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import static org.example.amorosobackend.dto.OrderControllerDTO.*;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    // 주문 생성
    public OrderResponseDTO createOrder(String email, OrderRequestDTO requestDTO) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Order order = Order.builder()
                .user(user)
                .totalPrice(requestDTO.getTotalPrice())
                .orderStatus("PENDING")
                .paymentStatus("WAITING")
                .build();

        Order savedOrder = orderRepository.save(order);
        return new OrderResponseDTO(savedOrder);
    }

    // 📦 특정 주문 조회 (로그인한 사용자 기준)
    public OrderResponseDTO getOrderById(String email, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다."));

        if (!order.getUser().getEmail().equals(email)) {
            throw new SecurityException("해당 주문에 접근할 권한이 없습니다.");
        }

        return new OrderResponseDTO(order);
    }

    // 🛍 사용자의 모든 주문 조회
    public List<OrderResponseDTO> getOrdersByUserEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        List<Order> orders = orderRepository.findByUser(user);
        return orders.stream().map(OrderResponseDTO::new).collect(Collectors.toList());
    }

    //  주문 취소 (본인만 가능)
    public void cancelOrder(String email, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다."));

        if (!order.getUser().getEmail().equals(email)) {
            throw new SecurityException("해당 주문을 취소할 권한이 없습니다.");
        }

        orderRepository.delete(order);
    }

    // 🚚 주문 상태 변경 (관리자만 가능하도록 설정 가능)
    public OrderResponseDTO updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다."));

        order.setOrderStatus(status);
        Order updatedOrder = orderRepository.save(order);
        return new OrderResponseDTO(updatedOrder);
    }
}
