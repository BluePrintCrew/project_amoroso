package org.example.amorosobackend.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.amorosobackend.domain.Order;
import org.example.amorosobackend.domain.OrderItem;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class OrderControllerDTO {

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
        private List<OrderItemDTO> orderItems;

        public OrderResponseDTO(Order order) {
            this.orderId = order.getOrderId();
            this.userEmail = order.getUser().getEmail();
            this.totalPrice = order.getTotalPrice();
            this.orderStatus = order.getOrderStatus().name();
            this.paymentStatus = order.getPaymentStatus().name();
            this.createdAt = order.getCreatedAt();
            this.orderItems = order.getOrderItems().stream()
                    .map(OrderItemDTO::new)
                    .collect(Collectors.toList());
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderRequestDTO {
        private Double totalPrice;
        private List<OrderItemRequestDTO> orderItems;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemDTO {
        private Long productId;
        private String productName;
        private String mainImageUri;
        private Integer quantity;
        private Double unitPrice;


        public OrderItemDTO(OrderItem orderItem) {
            this.productId = orderItem.getProduct().getProductId();
            this.productName = orderItem.getProduct().getProductName();
            this.mainImageUri = orderItem.getMainImageUri();
            this.quantity = orderItem.getQuantity();
            this.unitPrice = orderItem.getUnitPrice();
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemRequestDTO {
        private Long productId;
        private Integer quantity;
    }


}
