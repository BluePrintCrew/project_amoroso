package org.example.amorosobackend.service;

import org.example.amorosobackend.domain.OrderItem;
import org.example.amorosobackend.domain.Product;
import org.example.amorosobackend.repository.OrderItemRepository;
import org.example.amorosobackend.repository.ProductRepository;
import org.example.amorosobackend.enums.OrderStatus;
import org.example.amorosobackend.enums.PaymentStatus;
import org.springframework.stereotype.Service;



import lombok.RequiredArgsConstructor;
import org.example.amorosobackend.domain.Order;
import org.example.amorosobackend.domain.User;
import org.example.amorosobackend.repository.OrderRepository;
import org.example.amorosobackend.repository.UserRepository;
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
    private final ProductRepository productRepository;
    private final OrderItemRepository orderItemRepository;


    // 주문 생성
    public OrderResponseDTO createOrder(String email, OrderRequestDTO requestDTO) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Order order = Order.builder()
                .user(user)
                .orderStatus(OrderStatus. PAYMENT_PENDING)
                .paymentStatus(PaymentStatus.WAITING)
                .build();

        final Order savedOrder = orderRepository.save(order); // 해결: order를 final로 선언

        List<OrderItem> orderItems = requestDTO.getOrderItems().stream().map(itemDTO -> {
            Product product = productRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다."));

            return OrderItem.builder()
                    .order(savedOrder) // ✅ 해결: final 변수를 사용
                    .product(product)
                    .quantity(itemDTO.getQuantity())
                    .unitPrice(product.getPrice())
                    .mainImageUri(product.getMainImageUri())
                    .build();
        }).collect(Collectors.toList());

        orderItemRepository.saveAll(orderItems);

        double totalPrice = orderItems.stream().mapToDouble(item -> item.getQuantity() * item.getUnitPrice()).sum();
        savedOrder.setTotalPrice(totalPrice);
        orderRepository.save(savedOrder);

        return new OrderResponseDTO(savedOrder);
    }

    // 특정 주문 조회 (로그인한 사용자 기준)
    public OrderResponseDTO getOrderById(String email, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다."));

        if (!order.getUser().getEmail().equals(email)) {
            throw new SecurityException("해당 주문에 접근할 권한이 없습니다.");
        }

        return new OrderResponseDTO(order);
    }

    // 사용자의 모든 주문 조회
    public List<OrderResponseDTO> getOrdersByUserEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        List<Order> orders = orderRepository.findByUser(user);
        return orders.stream().map(OrderResponseDTO::new).collect(Collectors.toList());
    }

    // 주문 취소 (본인만 가능)
    public void cancelOrder(String email, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다."));

        if (!order.getUser().getEmail().equals(email)) {
            throw new SecurityException("해당 주문을 취소할 권한이 없습니다.");
        }

        orderItemRepository.deleteAll(order.getOrderItems());
        orderRepository.delete(order);
    }

    // 주문 상태 변경 (관리자만 가능하도록 설정 가능)
    public OrderResponseDTO updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다."));


        order.setOrderStatus(fromString(status));
        Order updatedOrder = orderRepository.save(order);
        return new OrderResponseDTO(updatedOrder);
    }

    public static OrderStatus fromString(String status) {
        try {
            return OrderStatus.valueOf(status.toUpperCase()); // 대소문자 무시 처리
        } catch (IllegalArgumentException | NullPointerException e) {
            return null; // 잘못된 값이면 null 반환
        }
    }
}
