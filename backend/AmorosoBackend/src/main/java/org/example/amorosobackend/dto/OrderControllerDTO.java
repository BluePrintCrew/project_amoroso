package org.example.amorosobackend.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.amorosobackend.domain.Order;

import java.time.LocalDateTime;

public class OrderControllerDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderRequestDTO {
        private Double totalPrice;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderResponseDTO {
        private Long orderId;
        private String userEmail;
        private Double totalPrice;
        private String orderStatus;
        private String paymentStatus;
        private LocalDateTime createdAt;

        public OrderResponseDTO(Order order) {
            this.orderId = order.getOrderId();
            this.userEmail = order.getUser().getEmail();
            this.totalPrice = order.getTotalPrice();
            this.orderStatus = order.getOrderStatus();
            this.paymentStatus = order.getPaymentStatus();
            this.createdAt = order.getCreatedAt();
        }
    }


}
