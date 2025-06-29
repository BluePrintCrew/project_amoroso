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
import org.example.amorosobackend.dto.PaymentGroupDTO;
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

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final PaymentGroupRepository paymentGroupRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final UserCouponRepository userCouponRepository;
    private final OrderItemRepository orderItemRepository;
    private final ShipmentRepository shipmentRepository;
    private final UserAddressRepository userAddressRepository;
    private final ReviewRepository reviewRepository;

    /**
     * PaymentGroup과 함께 주문 생성
     */
    public PaymentGroupDTO.PaymentGroupResponseDTO createOrdersWithPaymentGroup(String email, OrderRequestDTO requestDTO) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        UserAddress address = userAddressRepository.findById(requestDTO.getUserAddressId())
                .orElseThrow(() -> new IllegalArgumentException("배송지를 찾을 수 없습니다"));

        // PaymentGroup 생성
        PaymentGroup paymentGroup = PaymentGroup.builder()
                .paymentGroupCode(generatePaymentGroupCode())
                .user(user)
                .paymentStatus(PaymentStatus.WAITING)
                .totalAmount(0)
                .build();

        paymentGroupRepository.save(paymentGroup);

        // 판매자별 아이템 그룹핑 (기존 로직)
        Map<Seller, List<OrderItemRequestDTO>> sellerItemMap = groupItemsBySeller(requestDTO.getOrderItems());

        int totalAmount = 0;

        for(Map.Entry<Seller, List<OrderItemRequestDTO>> entry : sellerItemMap.entrySet()) {
            Seller seller = entry.getKey();
            List<OrderItemRequestDTO> sellerOrderItems = entry.getValue();

            // 주문 생성 (기존 로직과 동일)
            Order order = Order.builder()
                    .user(user)
                    .seller(seller)
                    .orderCode(generateOrderCode())
                    .orderStatus(OrderStatus.PAYMENT_PENDING)
                    .paymentStatus(PaymentStatus.WAITING)
                    .userAddress(address)
                    .elevatorType(ElevatorType.valueOf(requestDTO.getElevatorType()))
                    .freeLoweringService(requestDTO.getFreeLoweringService())
                    .vehicleEntryPossible(requestDTO.getVehicleEntryPossible())
                    .deliveryRequest(requestDTO.getDeliveryRequest())
                    .productInstallationAgreement(requestDTO.getProductInstallationAgreement())
                    .build();

            // PaymentGroup과 연결
            order.setPaymentGroup(paymentGroup);
            orderRepository.save(order);

            // OrderItem 생성 및 총 가격 계산
            int orderPrice = 0;
            for(OrderItemRequestDTO itemRequestDTO : sellerOrderItems) {
                OrderItem orderItem = createOrderItem(order, itemRequestDTO);
                orderPrice += orderItem.getFinalPrice() * orderItem.getQuantity();
            }

            order.setTotalPrice(orderPrice);
            totalAmount += orderPrice;
            orderRepository.save(order);

            createShipment(order, address, requestDTO.getDeliveryRequest());
            paymentGroup.addOrder(order);
        }

        // PaymentGroup 총 금액 설정
        paymentGroup.setTotalAmount(totalAmount);
        paymentGroupRepository.save(paymentGroup);

        return new PaymentGroupDTO.PaymentGroupResponseDTO(paymentGroup);
    }

    private Map<Seller, List<OrderItemRequestDTO>> groupItemsBySeller(List<OrderItemRequestDTO> orderItems) {
        Map<Seller, List<OrderItemRequestDTO>> sellerItemMap = new HashMap<>();

        for(OrderItemRequestDTO itemRequestDTO : orderItems) {
            Product product = productRepository.findById(itemRequestDTO.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("해당 id의 상품을 찾을 수 없습니다."));

            Seller seller = product.getSeller();
            sellerItemMap.computeIfAbsent(seller, k -> new ArrayList<>()).add(itemRequestDTO);
        }

        return sellerItemMap;
    }

    private String generatePaymentGroupCode() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        String timestamp = LocalDateTime.now().format(formatter);
        int randomNum = (int) (Math.random() * 10000);
        String randomPart = String.format("%04d", randomNum);
        return "PG" + timestamp + randomPart;
    }
    /**
     * 주문 생성 - 결제 전에 미리 생성 (PAYMENT_PENDING 상태)
     */
    public List<OrderResponseDTO> createOrder(String email, OrderRequestDTO requestDTO) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        UserAddress address = userAddressRepository.findById(requestDTO.getUserAddressId())
                .orElseThrow(() -> new IllegalArgumentException("배송지를 찾을 수 없습니다"));

        // 판매자별 아이템 찾기
        Map<Seller, List<OrderItemRequestDTO>> sellerItemMap = new HashMap<>();

        for( OrderItemRequestDTO itemRequestDTO : requestDTO.getOrderItems() ) {
            Product product = productRepository.findById(itemRequestDTO.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("해당 id의 상품을 찾을 수 없습니다."));

            Seller seller = product.getSeller();

            sellerItemMap.computeIfAbsent(seller, k-> new ArrayList<>()).add(itemRequestDTO);
        }

        List<OrderResponseDTO> resultOrders = new ArrayList<>();

        for(Map.Entry<Seller, List<OrderItemRequestDTO>> entry : sellerItemMap.entrySet()) {
            Seller seller = entry.getKey();
            List<OrderItemRequestDTO> sellerOrderItems  = entry.getValue();

            // 주문 생성
            Order order = Order.builder()
                    .user(user)
                    .seller(seller)
                    .orderCode(generateOrderCode())
                    .orderStatus(OrderStatus.PAYMENT_PENDING)
                    .paymentStatus(PaymentStatus.WAITING)
                    .userAddress(address)
                    .elevatorType(ElevatorType.valueOf(requestDTO.getElevatorType()))
                    .freeLoweringService(requestDTO.getFreeLoweringService())
                    .vehicleEntryPossible(requestDTO.getVehicleEntryPossible())
                    .deliveryRequest(requestDTO.getDeliveryRequest())
                    .productInstallationAgreement(requestDTO.getProductInstallationAgreement())
                    .deliveryRequest(requestDTO.getDeliveryRequest())
                    .build();

            orderRepository.save(order);

            int totalPrice = 0;
            List<OrderItem> orderitems = new ArrayList<>();
            for(OrderItemRequestDTO itemRequestDTO : sellerOrderItems ) {
                OrderItem orderItem = createOrderItem(order, itemRequestDTO);
                totalPrice += orderItem.getFinalPrice() * orderItem.getQuantity();
                orderitems.add(orderItem);
            }

            order.setTotalPrice(totalPrice);
            orderRepository.save(order);

            createShipment(order,address,requestDTO.getDeliveryRequest());

            resultOrders.add(new OrderResponseDTO(order));
        }
        return resultOrders;
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

        increaseProductSales(orderItem);

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
        // 이 부분이 빠져있었습니다!
        orderItemRepository.save(orderItem);

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
    public Order getOrderById(Long orderId){
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다."));

        return order;
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
        
        // 사용자가 리뷰를 남기지 않은 주문 아이템만 조회 (PaymentGroup 기준으로 결제 완료된 것만)
        Page<OrderItem> orderItems = orderItemRepository.findReviewableOrderItemsByUserId(user.getUserId(), PaymentStatus.COMPLETED, pageable);

        // 각 OrderItem을 ReviewableProduct DTO로 매핑
        return orderItems.map(orderItem -> new ReviewDTO.ReviewableProduct(
                orderItem.getProduct().getProductId(),
                orderItem.getProduct().getProductName(),
                orderItem.getOrder().getCreatedAt(), // 주문 일자
                true, // 여기서는 이미 리뷰 없는 항목만 조회했으므로 항상 true
                orderItem.getMainImageUri() // 상품 이미지 URI
        ));
    }

    // 상품 판매량 증가
    public void increaseProductSales(OrderItem item) {
        Product product = item.getProduct();
        product.increaseSales(item.getQuantity()); // 또는 1
        productRepository.save(product);
    }

    private String generateOrderCode() {
        String orderCode;
        int maxAttempts = 10;
        int attempt = 0;
        
        do {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS");
            String timestamp = LocalDateTime.now().format(formatter);
            
            // ThreadLocalRandom을 사용하여 더 안전한 랜덤 값 생성
            int randomNum = ThreadLocalRandom.current().nextInt(10000, 99999); // 5자리 랜덤 숫자
            String randomPart = String.valueOf(randomNum);
            
            orderCode = "ORD" + timestamp + randomPart;
            attempt++;
            
            // 최대 10번까지 시도
            if (attempt >= maxAttempts) {
                throw new RuntimeException("주문 코드 생성에 실패했습니다. 다시 시도해주세요.");
            }
            
        } while (orderRepository.existsByOrderCode(orderCode)); // 중복 확인
        
        return orderCode;
    }


    public void updateOrderStatus(Order order, OrderStatus orderStatus) {
        order.setOrderStatus(orderStatus);
    }

    public void updatePaymentStatus(Order order, PaymentStatus paymentStatus) {
        order.setPaymentStatus(paymentStatus);
    }
}
