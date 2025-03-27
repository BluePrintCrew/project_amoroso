package org.example.amorosobackend.service;

import lombok.RequiredArgsConstructor;
import org.example.amorosobackend.domain.OrderItem;
import org.example.amorosobackend.domain.Seller;
import org.example.amorosobackend.domain.User;
import org.example.amorosobackend.domain.product.Product;
import org.example.amorosobackend.dto.SellerDTO;
import org.example.amorosobackend.enums.OrderStatus;
import org.example.amorosobackend.enums.PaymentStatus;
import org.example.amorosobackend.repository.OrderItemRepository;
import org.example.amorosobackend.repository.OrderRepository;
import org.example.amorosobackend.repository.SellerRepository;
import org.example.amorosobackend.repository.UserRepository;
import org.example.amorosobackend.repository.product.ProductRepository;
import org.springframework.security.core.context.SecurityContextHolder;
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

    public SellerDTO.SellerStatsResponse getSellerStats() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long sellerId = getSellerIdByEmail(email);

        Long paidOrders = orderRepository.countPaidOrdersBySeller(sellerId, PaymentStatus.COMPLETED, OrderStatus.PAYMENT_COMPLETED);
        Long readyShipments = orderRepository.countOrdersBySellerAndStatus(sellerId, OrderStatus.PAYMENT_COMPLETED);
        Long inTransitOrders = orderRepository.countOrdersBySellerAndStatus(sellerId, OrderStatus.DELIVERED);

        return new SellerDTO.SellerStatsResponse(paidOrders, readyShipments, inTransitOrders);
    }
    private Long getSellerIdByEmail(String email) {
        // Seller 엔티티를 통해 이메일 기반으로 sellerId 조회하는 로직 구현 필요
        return 1L; // 예제이므로 1L을 반환 (실제 구현 시 Repository 활용)
    }


    public SellerDTO.TotalSaleResponse getTotalSales(int year, int month) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isSeller()) {
            throw new RuntimeException("해당 유저는 판매자가 아닙니다.");
        }

        Seller seller = sellerRepository.findByUser(user).orElseThrow(() -> new RuntimeException("Seller 정보가 없습니다."));

        YearMonth currentMonth = YearMonth.of(year, month);
        YearMonth previousMonth = currentMonth.minusMonths(1);

        LocalDateTime currentStart = currentMonth.atDay(1).atStartOfDay();
        LocalDateTime currentEnd = currentMonth.atEndOfMonth().atTime(23, 59, 59);

        LocalDateTime prevStart = previousMonth.atDay(1).atStartOfDay();
        LocalDateTime prevEnd = previousMonth.atEndOfMonth().atTime(23, 59, 59);

        List<OrderItem> currentItems = orderItemRepository.findBySellerProductAndCreatedAtBetweenAndOrderPaymentStatus(
                seller, currentStart, currentEnd, PaymentStatus.COMPLETED);
        List<OrderItem> previousItems = orderItemRepository.findBySellerProductAndCreatedAtBetweenAndOrderPaymentStatus(
                seller, prevStart, prevEnd, PaymentStatus.COMPLETED);

        int currentTotal = currentItems.stream().mapToInt(OrderItem::getFinalPrice).sum();
        int previousTotal = previousItems.stream().mapToInt(OrderItem::getFinalPrice).sum();

        double growthRate = 0.0;
        if (previousTotal > 0) {
            BigDecimal current = new BigDecimal(currentTotal); // 이번 달 매출
            BigDecimal previous = new BigDecimal(previousTotal); // 전달 매출

            growthRate = current.subtract(previous)               // 증가액
                    .divide(previous, 4, RoundingMode.HALF_UP)    // 증가율 계산
                    .multiply(BigDecimal.valueOf(100))            // 백분율 변환
                    .setScale(1, RoundingMode.HALF_UP)            // 소수점 첫째자리 반올림
                    .doubleValue();                               // double로 반환
        }

        return new SellerDTO.TotalSaleResponse(currentTotal, growthRate);
    }

    public SellerDTO.TotalOrderResponse getTotalOrders(int year, Integer month) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isSeller()) {
            throw new RuntimeException("해당 유저는 판매자가 아닙니다.");
        }

        Seller seller = sellerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Seller 정보가 없습니다."));

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

        List<OrderItem> currentItems = orderItemRepository.findBySellerProductAndCreatedAtBetweenAndOrderPaymentStatus(
                seller, currentStart, currentEnd, PaymentStatus.COMPLETED);
        List<OrderItem> previousItems = orderItemRepository.findBySellerProductAndCreatedAtBetweenAndOrderPaymentStatus(
                seller, prevStart, prevEnd, PaymentStatus.COMPLETED);

        int currentCount = (int) currentItems.stream()
                .map(OrderItem::getOrder)
                .distinct()
                .count();

        int previousCount = (int) previousItems.stream()
                .map(OrderItem::getOrder)
                .distinct()
                .count();

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
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isSeller()) {
            throw new RuntimeException("해당 유저는 판매자가 아닙니다.");
        }

        Seller seller = sellerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Seller 정보가 없습니다."));

        // 전체 상품 수 (판매자가 등록한 모든 상품)
        int total = productRepository.countBySeller(seller);

        // 올해 등록된 상품 수
        LocalDateTime startOfYear = LocalDateTime.of(LocalDateTime.now().getYear(), 1, 1, 0, 0);
        int addedThisYear = productRepository.countBySellerAndCreatedAtAfter(seller, startOfYear);

        // 작년까지 등록된 상품 수
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
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isSeller()) {
            throw new RuntimeException("해당 유저는 판매자가 아닙니다.");
        }

        Seller seller = sellerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Seller 정보가 없습니다."));

        List<Integer> monthlySales = new ArrayList<>();

        for (int month = 1; month <= 12; month++) {
            YearMonth ym = YearMonth.of(year, month);
            LocalDateTime start = ym.atDay(1).atStartOfDay();
            LocalDateTime end = ym.atEndOfMonth().atTime(23, 59, 59);

            List<OrderItem> items = orderItemRepository.findBySellerProductAndCreatedAtBetweenAndOrderPaymentStatus(
                    seller, start, end, PaymentStatus.COMPLETED
            );

            int sum = items.stream().mapToInt(OrderItem::getFinalPrice).sum();
            monthlySales.add(sum); // 매출 없으면 0으로 자동 처리됨
        }

        return new SellerDTO.MonthlySalesResponse(monthlySales);
    }

    public List<SellerDTO.PopularProductDto> getTop5PopularProducts() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isSeller()) {
            throw new RuntimeException("해당 유저는 판매자가 아닙니다.");
        }

        Seller seller = sellerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("판매자 정보가 없습니다."));

        // 판매자가 등록한 제품 중 salesCount 기준으로 내림차순 정렬한 Top 5
        List<Product> topProducts = productRepository
                .findTop5BySellerOrderBySalesCountDesc(seller);

        // DTO 변환
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

}
