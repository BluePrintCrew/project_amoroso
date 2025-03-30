package org.example.amorosobackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;


public class SellerDTO {

    @Getter
    @AllArgsConstructor
    public static class SellerStatsResponse {
        private Long paidOrders;
        private Long readyShipments;
        private Long inTransitOrders;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TotalSaleRequset {
        private int year;
        private int month;
    }

    @Getter
    @AllArgsConstructor
    public static class TotalSaleResponse {
        private int totalSale;        // 이번 달 총 매출
        private double growthRate;    // 전달 대비 증가율 (+/- %), 소수점 1자리
    }

    @Getter
    @AllArgsConstructor
    public static class TotalOrderResponse {
        private int orderCount;     // 현재 주문 수
        private double growthRate;  // 전달 or 전년 대비 증가율 (소수점 1자리)
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TotalOrderRequest {
        private int year;
        private Integer month; // null 허용
    }

    @Getter
    @AllArgsConstructor
    public static class TotalProductResponse {
        private int totalProducts;   // 전체 상품 수
        private double growthRate;   // 올해 들어 몇 % 증가했는지
    }

    @Getter
    @AllArgsConstructor
    public static class MonthlySalesResponse {
        private List<Integer> monthlySales; // 1월부터 12월까지 총 12개의 매출 금액
    }

    @Getter
    @AllArgsConstructor
    public static class PopularProductDto {
        private Long productId;
        private String productName;
        private String productCode;
        private String salesCount;
        private String marketPrice;
        private String categoryName;

    }

    @Getter
    @AllArgsConstructor
    public static class SellerOrderSummaryDto {
        private Long orderId;
        private String orderCode;
        private LocalDateTime orderDate;
        private String customerName;
        private String fullAddress; // ex) 서울시 강남구 xxx로 12, 102호
        private String orderStatus;
        private String paymentStatus;
        private int totalPrice;
    }

}