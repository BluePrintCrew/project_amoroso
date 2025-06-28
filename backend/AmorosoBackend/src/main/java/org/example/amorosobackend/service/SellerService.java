package org.example.amorosobackend.service;

import lombok.RequiredArgsConstructor;
import org.example.amorosobackend.domain.Order;
import org.example.amorosobackend.domain.OrderItem;
import org.example.amorosobackend.domain.Seller;
import org.example.amorosobackend.domain.User;
import org.example.amorosobackend.domain.product.Product;
import org.example.amorosobackend.dto.*;
import org.example.amorosobackend.enums.OrderStatus;
import org.example.amorosobackend.enums.PaymentStatus;
import org.example.amorosobackend.repository.*;
import org.example.amorosobackend.repository.product.ProductRepository;
import org.springframework.data.domain.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SellerService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final OrderItemRepository orderItemRepository;
    private final SellerRepository sellerRepository;
    private final ProductRepository productRepository;
    private final BusinessValidationService businessValidationService;
    private final PasswordEncoder passwordEncoder;
    private final EcommerceValidationService ecommerceValidationService;

    public SellerDTO.SellerStatsResponse getSellerStats() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Seller seller = getSellerByEmail(email); // 수정: 공통 메서드 사용

        // 수정: PaymentGroup 상태를 고려한 통계 (모든 메서드 Seller 타입 사용)
        Long paidOrders = orderRepository.countOrdersBySellerAndPaymentGroupStatus(
                seller, PaymentStatus.COMPLETED, OrderStatus.PAYMENT_COMPLETED);
        Long readyShipments = orderRepository.countOrdersBySellerAndStatus(
                seller, OrderStatus.PAYMENT_COMPLETED);
        Long inTransitOrders = orderRepository.countOrdersBySellerAndStatus(
                seller, OrderStatus.DELIVERED);

        return new SellerDTO.SellerStatsResponse(paidOrders, readyShipments, inTransitOrders);
    }

    public SellerDTO.TotalSaleResponse getTotalSales(int year, int month) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Seller seller = getSellerByEmail(email); // 수정: 공통 메서드 사용

        YearMonth currentMonth = YearMonth.of(year, month);
        YearMonth previousMonth = currentMonth.minusMonths(1);

        LocalDateTime currentStart = currentMonth.atDay(1).atStartOfDay();
        LocalDateTime currentEnd = currentMonth.atEndOfMonth().atTime(23, 59, 59);
        LocalDateTime prevStart = previousMonth.atDay(1).atStartOfDay();
        LocalDateTime prevEnd = previousMonth.atEndOfMonth().atTime(23, 59, 59);

        // 수정: PaymentGroup 상태를 고려한 Order 조회로 변경
        List<Order> currentOrders = orderRepository.findOrdersBySellerAndPaymentGroupStatusAndDateBetween(
                seller, PaymentStatus.COMPLETED, currentStart, currentEnd);
        List<Order> previousOrders = orderRepository.findOrdersBySellerAndPaymentGroupStatusAndDateBetween(
                seller, PaymentStatus.COMPLETED, prevStart, prevEnd);

        // 수정: Order의 totalPrice 합계로 계산 (기존: OrderItem 개별 합계)
        int currentTotal = currentOrders.stream()
                .mapToInt(Order::getTotalPrice)
                .sum();
        int previousTotal = previousOrders.stream()
                .mapToInt(Order::getTotalPrice)
                .sum();

        // 기존 성장률 계산 로직 유지
        double growthRate = 0.0;
        if (previousTotal > 0) {
            BigDecimal current = new BigDecimal(currentTotal);
            BigDecimal previous = new BigDecimal(previousTotal);

            growthRate = current.subtract(previous)
                    .divide(previous, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .setScale(1, RoundingMode.HALF_UP)
                    .doubleValue();
        }

        return new SellerDTO.TotalSaleResponse(currentTotal, growthRate);
    }

    public SellerDTO.TotalOrderResponse getTotalOrders(int year, Integer month) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Seller seller = getSellerByEmail(email); // 수정: 공통 메서드 사용

        LocalDateTime currentStart, currentEnd, prevStart, prevEnd;

        if (month == null) {
            // 연 기준
            currentStart = LocalDateTime.of(year, 1, 1, 0, 0);
            currentEnd = LocalDateTime.of(year, 12, 31, 23, 59, 59);
            prevStart = LocalDateTime.of(year - 1, 1, 1, 0, 0);
            prevEnd = LocalDateTime.of(year - 1, 12, 31, 23, 59, 59);
        } else {
            YearMonth currentMonth = YearMonth.of(year, month);
            YearMonth previousMonth = currentMonth.minusMonths(1);

            currentStart = currentMonth.atDay(1).atStartOfDay();
            currentEnd = currentMonth.atEndOfMonth().atTime(23, 59, 59);

            prevStart = previousMonth.atDay(1).atStartOfDay();
            prevEnd = previousMonth.atEndOfMonth().atTime(23, 59, 59);
        }

        // 수정: PaymentGroup 상태를 고려한 Order 조회로 변경
        List<Order> currentOrders = orderRepository.findOrdersBySellerAndPaymentGroupStatusAndDateBetween(
                seller, PaymentStatus.COMPLETED, currentStart, currentEnd);
        List<Order> previousOrders = orderRepository.findOrdersBySellerAndPaymentGroupStatusAndDateBetween(
                seller, PaymentStatus.COMPLETED, prevStart, prevEnd);

        // 수정: Order 개수 직접 계산 (기존: OrderItem에서 distinct Order 계산)
        int currentCount = currentOrders.size();
        int previousCount = previousOrders.size();

        // 기존 성장률 계산 로직 유지
        double growthRate = 0.0;
        if (previousCount > 0) {
            BigDecimal current = new BigDecimal(currentCount);
            BigDecimal previous = new BigDecimal(previousCount);
            growthRate = current.subtract(previous)
                    .divide(previous, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .setScale(1, RoundingMode.HALF_UP)
                    .doubleValue();
        }

        return new SellerDTO.TotalOrderResponse(currentCount, growthRate);
    }

    public SellerDTO.TotalProductResponse getTotalProducts() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Seller seller = getSellerByEmail(email); // 수정: 공통 메서드 사용

        // 기존 로직 유지 (Product 통계는 PaymentGroup과 무관)
        int total = productRepository.countBySeller(seller);

        LocalDateTime startOfYear = LocalDateTime.of(LocalDateTime.now().getYear(), 1, 1, 0, 0);
        int addedThisYear = productRepository.countBySellerAndCreatedAtAfter(seller, startOfYear);

        int previousTotal = total - addedThisYear;

        double growthRate = 0.0;
        if (previousTotal > 0) {
            BigDecimal current = new BigDecimal(addedThisYear);
            BigDecimal previous = new BigDecimal(previousTotal);
            growthRate = current.divide(previous, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .setScale(1, RoundingMode.HALF_UP)
                    .doubleValue();
        }

        return new SellerDTO.TotalProductResponse(total, growthRate);
    }

    public SellerDTO.MonthlySalesResponse getMonthlySales(int year) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Seller seller = getSellerByEmail(email); // 수정: 공통 메서드 사용

        List<Integer> monthlySales = new ArrayList<>();

        for (int month = 1; month <= 12; month++) {
            YearMonth ym = YearMonth.of(year, month);
            LocalDateTime start = ym.atDay(1).atStartOfDay();
            LocalDateTime end = ym.atEndOfMonth().atTime(23, 59, 59);

            // 수정: PaymentGroup 상태를 고려한 Order 조회로 변경
            List<Order> orders = orderRepository.findOrdersBySellerAndPaymentGroupStatusAndDateBetween(
                    seller, PaymentStatus.COMPLETED, start, end);

            // 수정: Order의 totalPrice 합계로 계산 (기존: OrderItem 개별 합계)
            int sum = orders.stream().mapToInt(Order::getTotalPrice).sum();
            monthlySales.add(sum);
        }

        return new SellerDTO.MonthlySalesResponse(monthlySales);
    }

    public List<SellerDTO.PopularProductDto> getTop5PopularProducts() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Seller seller = getSellerByEmail(email); // 수정: 공통 메서드 사용

        // 기존 로직 유지 (Product 인기도는 PaymentGroup과 무관)
        List<Product> topProducts = productRepository
                .findTop5BySellerOrderBySalesCountDesc(seller);

        return topProducts.stream()
                .map(product -> new SellerDTO.PopularProductDto(
                        product.getProductId(),
                        product.getProductName(),
                        product.getProductCode(),
                        String.valueOf(product.getSalesCount()),
                        String.valueOf(product.getMarketPrice()),
                        product.getCategory().getCategoryName()
                ))
                .toList();
    }

    public Page<SellerDTO.SellerOrderSummaryDto> getSellerOrderSummaries(int page, int size) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Seller seller = getSellerByEmail(email); // 수정: 공통 메서드 사용

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        // 수정: 통일된 Seller 기반 메서드 사용 (시간순 정렬)
        Page<Order> orderPage = orderRepository.findBySeller(seller, pageable);

        List<SellerDTO.SellerOrderSummaryDto> dtoList = orderPage.getContent().stream()
                .map(order -> new SellerDTO.SellerOrderSummaryDto(
                        order.getOrderId(),
                        order.getOrderCode(),
                        order.getCreatedAt(),
                        order.getUser().getName(),
                        order.getUserAddress().getAddress() + " " + order.getUserAddress().getDetailAddress(),
                        getOrderStatusKorean(order.getOrderStatus()), // 한국어로 변환
                        getPaymentStatusKorean(order.getPaymentStatus()), // 결제상태도 한국어로
                        order.getTotalPrice()
                ))
                .toList();

        return new PageImpl<>(dtoList, pageable, orderPage.getTotalElements());
    }

    @Transactional
    public SellerRegistrationDTO.Response registerSeller(SellerRegistrationDTO.Request request) {
        // 1. 기본 중복 검사만 수행
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }

        // 사업자등록번호 중복 검사 (같은 사업자번호로 이미 가입된 셀러가 있는지)
        if (sellerRepository.existsByBusinessRegistrationNumber(request.getBusinessNumber())) {
            throw new IllegalArgumentException("Business registration number already registered");
        }

        // 2. User 생성 및 저장
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .phoneNumber(request.getPhoneNumber())
                .role("ROLE_SELLER")
                .emailConsent(request.getEmailConsent())
                .smsConsent(request.getSmsConsent())
                .dmConsent(request.getDmConsent())
                .locationConsent(request.getLocationConsent())
                .build();

        userRepository.save(user);

        // 3. Seller 정보는 프론트엔드에서 검증된 데이터 그대로 사용
        Seller seller = Seller.builder()
                .user(user)
                .brandName(request.getBrandName())
                .businessRegistrationNumber(request.getBusinessNumber())
                .businessStartDate(request.getBusinessStartDate())
                .businessAddress(request.getBusinessAddress())
                .businessDetailAddress(request.getBusinessDetailAddress())
                .businessTel(request.getBusinessTel())
                .taxationType(request.getTaxationType())
                .businessStatus(request.getBusinessStatus())
                .businessEmail(request.getBusinessEmail())
                        .build();


        sellerRepository.save(seller);

        return SellerRegistrationDTO.Response.builder()
                .email(user.getEmail())
                .name(user.getName())
                .brandName(seller.getBrandName())
                .businessNumber(seller.getBusinessRegistrationNumber())
                .businessStartDate(seller.getBusinessStartDate())
                .businessAddress(seller.getBusinessAddress())
                .businessDetailAddress(seller.getBusinessDetailAddress())
                .taxationType(seller.getTaxationType())
                .businessStatus(seller.getBusinessStatus())
                .message("Seller registration completed")
                .build();
    }
    // 삭제: getSellerIdByEmail 메서드 (Long 반환 방식 제거)
    // private Long getSellerIdByEmail(String email) { ... }

    @Transactional
    public void markOrderAsDelivered(Long orderId) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Seller seller = getSellerByEmail(email); // 수정: 공통 메서드 사용

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("주문을 찾을 수 없습니다."));

        if (!order.getSeller().equals(seller)) {
            throw new RuntimeException("해당 주문에 대한 권한이 없습니다.");
        }

        // 수정: PaymentGroup 상태도 확인
        if (order.getOrderStatus() != OrderStatus.PAYMENT_COMPLETED ||
                order.getPaymentGroup().getPaymentStatus() != PaymentStatus.COMPLETED) {
            throw new RuntimeException("결제가 완료된 주문만 배송 완료 처리할 수 있습니다.");
        }

        order.setOrderStatus(OrderStatus.DELIVERED);
        orderRepository.save(order);
    }

    public Page<SellerDTO.SellerProductDto> getSellerProducts(int page, int size, String sortBy, String order) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Seller seller = getSellerByEmail(email); // 수정: 공통 메서드 사용

        // 기존 로직 유지 (Product 조회는 PaymentGroup과 무관)
        Sort.Direction direction = "asc".equalsIgnoreCase(order) ? Sort.Direction.ASC : Sort.Direction.DESC;

        String sortField = "createdAt";
        if ("productName".equals(sortBy)) {
            sortField = "productName";
        } else if ("marketPrice".equals(sortBy)) {
            sortField = "marketPrice";
        } else if ("stock".equals(sortBy)) {
            sortField = "stock";
        } else if ("salesCount".equals(sortBy)) {
            sortField = "salesCount";
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortField));

        Page<Product> productPage = productRepository.findBySeller(seller, pageable);

        List<SellerDTO.SellerProductDto> dtoList = productPage.getContent().stream()
                .map(product -> new SellerDTO.SellerProductDto(
                        product.getProductId(),
                        product.getProductName(),
                        product.getProductCode(),
                        product.getCategory().getCategoryName(),
                        product.getMarketPrice(),
                        product.getDiscountPrice(),
                        product.getStock(),
                        product.getSalesCount(),
                        product.getOutOfStock(),
                        product.getMainImageUri(),
                        product.getCreatedAt()
                ))
                .toList();

        return new PageImpl<>(dtoList, pageable, productPage.getTotalElements());
    }

    public SellerDTO.SellerOrderDetailDto getSellerOrderDetail(Long orderId) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Seller seller = getSellerByEmail(email);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("주문을 찾을 수 없습니다."));

        if (!order.getSeller().equals(seller)) {
            throw new RuntimeException("해당 주문에 대한 권한이 없습니다.");
        }

        List<SellerDTO.OrderItemDto> orderItems = order.getOrderItems().stream()
                .map(item -> new SellerDTO.OrderItemDto(
                        item.getOrderItemId(),
                        item.getProduct().getProductName(),
                        item.getQuantity(),
                        item.getFinalPrice()
                ))
                .toList();

        return new SellerDTO.SellerOrderDetailDto(
                order.getOrderId(),
                order.getOrderCode(),
                order.getCreatedAt(),
                order.getOrderStatus().name(),
                order.getPaymentStatus().name(),
                order.getUser().getName(),
                order.getUser().getPhoneNumber(),
                order.getUserAddress().getAddress() + " " + order.getUserAddress().getDetailAddress(),
                orderItems,
                order.getTotalPrice()
        );
    }

    // 추가: 공통 Seller 조회 메서드
    private Seller getSellerByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isSeller()) {
            throw new RuntimeException("해당 유저는 판매자가 아닙니다.");
        }

        return sellerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Seller 정보가 없습니다."));
    }

    private String getOrderStatusKorean(OrderStatus status) {
        return switch (status) {
            case PAYMENT_PENDING -> "결제 대기";
            case PAYMENT_COMPLETED -> "결제 완료";
            case PREPARING_SHIPMENT -> "배송 준비중";
            case SHIPPING -> "배송중";
            case DELIVERED -> "배송 완료";
            case CANCELLED -> "주문 취소";
            case RETURNED -> "반품";
            case EXCHANGED -> "교환";
        };
    }
    private String getPaymentStatusKorean(PaymentStatus status) {
        return switch (status) {
            case WAITING -> "결제 대기";
            case COMPLETED -> "결제 완료";
            case CANCELED -> "결제 취소";
        };
    }


}