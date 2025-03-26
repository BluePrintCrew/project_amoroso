package org.example.amorosobackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;


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
}