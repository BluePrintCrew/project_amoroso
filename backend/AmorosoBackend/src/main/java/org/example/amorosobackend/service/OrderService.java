package org.example.amorosobackend.service;

import lombok.RequiredArgsConstructor;
import org.example.amorosobackend.domain.*;

import org.example.amorosobackend.domain.coupon.Coupon;
import org.example.amorosobackend.domain.coupon.UserCoupon;
import org.example.amorosobackend.domain.Order;
import org.example.amorosobackend.domain.OrderItem;
import org.example.amorosobackend.domain.OrderItemAdditionalOption;
import org.example.amorosobackend.domain.OrderItemProductOption;
import org.example.amorosobackend.domain.product.AdditionalOption;
import org.example.amorosobackend.domain.product.Product;
import org.example.amorosobackend.domain.product.ProductOption;
import org.example.amorosobackend.dto.OrderControllerDTO.*;
import org.example.amorosobackend.dto.ReviewDTO;
import org.example.amorosobackend.enums.ElevatorType;
import org.example.amorosobackend.enums.OrderStatus;
import org.example.amorosobackend.enums.PaymentStatus;
import org.example.amorosobackend.repository.*;
import org.example.amorosobackend.repository.product.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final UserCouponRepository userCouponRepository;
    private final OrderItemRepository orderItemRepository;
    private final ShipmentRepository shipmentRepository;
    private final UserAddressRepository userAddressRepository;
    private final ReviewRepository reviewRepository;

    /**
     * 주문 생성 - 결제 전에 미리 생성 (PAYMENT_PENDING 상태)
     */
    public OrderResponseDTO createOrder(String email, OrderRequestDTO requestDTO) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        UserAddress address = userAddressRepository.findById(requestDTO.getUserAddressId())
                .orElseThrow(() -> new IllegalArgumentException("배송지를 찾을 수 없습니다."));


        Order order = Order.builder()
                .user(user)
                .orderStatus(OrderStatus.PAYMENT_PENDING)
                .paymentStatus(PaymentStatus.WAITING)
                .elevatorType(ElevatorType.valueOf(requestDTO.getElevatorType()))
                .freeLoweringService(requestDTO.getFreeLoweringService())
                .vehicleEntryPossible(requestDTO.getVehicleEntryPossible())
                .productInstallationAgreement(requestDTO.getProductInstallationAgreement())
                .build();

        Order savedOrder = orderRepository.save(order);

        List<OrderItem> orderItems = requestDTO.getOrderItems().stream()
                .map(itemDTO -> createOrderItem(savedOrder, itemDTO))
                .collect(Collectors.toList());

        orderItemRepository.saveAll(orderItems);

        Integer totalPrice = orderItems.stream()
                .mapToInt(item -> item.getQuantity() * item.getFinalPrice()).sum();


        order.setTotalPrice(totalPrice);
        orderRepository.save(order);

        createShipment(order, address, requestDTO.getDeliveryRequest());

        return new OrderResponseDTO(order);
    }

    private OrderItem createOrderItem(Order order, OrderItemRequestDTO itemDTO) {
        Product product = productRepository.findById(itemDTO.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다."));

        UserCoupon userCoupon = null;
        Integer discountByCouponPrice = null;
        if (itemDTO.getUserCouponId() != null) {
            userCoupon = userCouponRepository.findById(itemDTO.getUserCouponId())
                    .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 쿠폰입니다."));
            if (userCoupon.isUsed()) {
                throw new IllegalArgumentException("이미 사용된 쿠폰입니다.");
            }

            discountByCouponPrice = applyCouponDiscount(userCoupon, product.getDiscountPrice() != null
                    ? product.getDiscountPrice() : product.getMarketPrice());
       }



        OrderItem orderItem = OrderItem.builder()
                .order(order)
                .product(product)
                .quantity(itemDTO.getQuantity())
                .finalPrice(
                        discountByCouponPrice != null ? discountByCouponPrice :
                        (product.getDiscountPrice() != null ? product.getDiscountPrice() :
                                product.getMarketPrice())
                )
                .mainImageUri(product.getMainImageUri())
                .build();

        if (itemDTO.getAdditionalOptionId() != null) {
            AdditionalOption additionalOption = product.getAdditionalOptions().stream()
                    .filter(opt -> opt.getId().equals(itemDTO.getAdditionalOptionId()))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("추가 옵션이 존재하지 않습니다."));

            OrderItemAdditionalOption additionalOrderOption = OrderItemAdditionalOption.builder()
                    .orderItem(orderItem)
                    .additionalOption(additionalOption)
                    .build();

            orderItem.setOrderItemAdditionalOption(additionalOrderOption);
        }

        if (itemDTO.getProductOptionId() != null) {
            ProductOption productOption = product.getProductOptions().stream()
                    .filter(opt -> opt.getId().equals(itemDTO.getProductOptionId()))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("상품 옵션이 존재하지 않습니다."));

            OrderItemProductOption productOrderOption = OrderItemProductOption.builder()
                    .orderItem(orderItem)
                    .productOption(productOption)
                    .selectedValue(itemDTO.getSelectedOptionValue())
                    .build();

            orderItem.setOrderItemProductOption(productOrderOption);

        }

        return orderItem;
    }

    private int applyCouponDiscount(UserCoupon userCoupon, int price) {
        Coupon coupon = userCoupon.getCoupon();
        if (!coupon.isActive()) {
            throw new IllegalArgumentException("쿠폰이 활성화 상태가 아닙니다.");
        }
        if (price < coupon.getMinimumOrderAmount()) {
            throw new IllegalArgumentException("최소 주문 금액 조건을 충족하지 않습니다.");
        }
        return coupon.getDiscountType() == Coupon.DiscountType.PERCENTAGE
                ? (price * coupon.getDiscountValue()) / 100
                : (price - coupon.getDiscountValue());
    }

    private void createShipment(Order order, UserAddress address, String deliveryRequest) {
        Shipment shipment = Shipment.builder()
                .order(order)
                .shipmentStatus("READY")
                .build();
        shipmentRepository.save(shipment);
    }

    /**
     * 특정 주문 조회 (사용자 기준)
     */
    public OrderResponseDTO getOrderById(String email, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다."));

        if (!order.getUser().getEmail().equals(email)) {
            throw new SecurityException("해당 주문에 접근할 권한이 없습니다.");
        }

        return new OrderResponseDTO(order);
    }

    /**
     * 사용자의 모든 주문 조회
     */
    public List<OrderResponseDTO> getOrdersByUserEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        List<Order> orders = orderRepository.findByUser(user);
        return orders.stream().map(OrderResponseDTO::new).collect(Collectors.toList());
    }

    /**
     * 주문 취소 (본인만 가능)
     */
    public void cancelOrder(String email, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다."));

        if (!order.getUser().getEmail().equals(email)) {
            throw new SecurityException("해당 주문을 취소할 권한이 없습니다.");
        }

        orderItemRepository.deleteAll(order.getOrderItems());
        orderRepository.delete(order);
    }

    public Page<ReviewDTO.ReviewableProduct> getAllReviewableProducts(String email, Pageable pageable) {
        // 사용자를 이메일로 조회
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 사용자가 리뷰를 남기지 않은 주문 아이템만 조회
        Page<OrderItem> orderItems = orderItemRepository.findReviewableOrderItemsByUserId(user.getUserId(), pageable);

        // 각 OrderItem을 ReviewableProduct DTO로 매핑
        return orderItems.map(orderItem -> new ReviewDTO.ReviewableProduct(
                orderItem.getProduct().getProductId(),
                orderItem.getProduct().getProductName(),
                orderItem.getOrder().getCreatedAt(), // 주문 일자
                true, // 여기서는 이미 리뷰 없는 항목만 조회했으므로 항상 true
                orderItem.getMainImageUri() // 상품 이미지 URI
        ));
    }
}
