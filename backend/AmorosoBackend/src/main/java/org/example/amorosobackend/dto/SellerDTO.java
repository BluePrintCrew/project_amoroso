package org.example.amorosobackend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;


public class SellerDTO {

    @Getter
    @AllArgsConstructor
    public static class SellerStatsResponse {
        private Long paidOrders;
        private Long readyShipments;
        private Long inTransitOrders;
    }
}