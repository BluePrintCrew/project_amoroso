package org.example.amorosobackend.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.amorosobackend.domain.Order;
import org.example.amorosobackend.domain.OrderItem;
import org.example.amorosobackend.domain.OrderItemAdditionalOption;
import org.example.amorosobackend.domain.OrderItemProductOption;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class OrderControllerDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderResponseDTO {
        private Long orderId;
        private Long UserCouponId;
        private String userEmail;
        private Integer totalPrice;
        private String orderStatus;
        private String paymentStatus;
        private LocalDateTime createdAt;
        private List<OrderItemResponseDTO> orderItems;
        private Boolean freeLoweringService;
        private Boolean productInstallationAgreement;
        private Boolean vehicleEntryPossible;
        private String elevatorType;
        private String sellerPhoneNumber;

        public OrderResponseDTO(Order order) {
            this.orderId = order.getOrderId();
            this.userEmail = order.getUser().getEmail();
            this.totalPrice = order.getTotalPrice();
            this.orderStatus = order.getOrderStatus().getKoreanName();
            this.paymentStatus = order.getPaymentStatus().getKoreanName();
            this.createdAt = order.getCreatedAt();
            this.orderItems = order.getOrderItems().stream()
                    .map(OrderItemResponseDTO::new)
                    .collect(Collectors.toList());
            this.productInstallationAgreement = order.getProductInstallationAgreement();
            this.vehicleEntryPossible = order.getVehicleEntryPossible();
            this.elevatorType = order.getElevatorType().name();
            this.freeLoweringService = order.getFreeLoweringService();
            this.sellerPhoneNumber = order.getSeller().getBusinessTel();
        }
    }


    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemResponseDTO {
        private Long productId;
        private String productName;
        private String mainImageUri;
        private Integer quantity;
        private Integer finalPrice;

        private Long additionalOptionId;
        private String additionalOptionName;
        private Integer additionalPrice;

        private Long productOptionId;
        private String productOptionName;
        private String selectedOptionValue;

        public OrderItemResponseDTO(OrderItem orderItem) {
            this.productId = orderItem.getProduct() != null ? orderItem.getProduct().getProductId() : null;
            this.productName = orderItem.getProduct() != null && orderItem.getProduct().getProductName() != null 
                ? orderItem.getProduct().getProductName() : "상품명 없음";
            this.mainImageUri = orderItem.getMainImageUri();
            this.quantity = orderItem.getQuantity();
            this.finalPrice = orderItem.getFinalPrice();

            if (orderItem.getOrderItemAdditionalOption() != null) {
                OrderItemAdditionalOption additionalOption = orderItem.getOrderItemAdditionalOption();
                this.additionalOptionId = additionalOption.getAdditionalOption().getId();
                this.additionalOptionName = additionalOption.getAdditionalOption().getOptionName();
                this.additionalPrice = additionalOption.getAdditionalPrice();
                this.finalPrice += this.quantity * this.additionalPrice; // 추가 옵션 가격 포함
            }

            if (orderItem.getOrderItemProductOption() != null) {
                OrderItemProductOption productOption = orderItem.getOrderItemProductOption();
                this.productOptionId = productOption.getProductOption().getId();
                this.productOptionName = productOption.getProductOption().getOptionName();
                this.selectedOptionValue = productOption.getSelectedValue();
            }
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderRequestDTO {
        private Integer totalPrice;
        private List<OrderItemRequestDTO> orderItems;
        private Long userAddressId;  // 추가: 배송지 ID
        private String deliveryRequest; // 추가: 배송 요청사항

        private Boolean freeLoweringService;
        private Boolean productInstallationAgreement;
        private Boolean vehicleEntryPossible;
        private String elevatorType;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemRequestDTO {
        private Long productId;
        private Integer quantity;
        private Long userCouponId;
        private Long additionalOptionId; // 선택 가능 (없으면 null)
        private Long productOptionId; // 선택 가능 (없으면 null)
        private String selectedOptionValue; // 옵션이 있다면 값 전달 (예: "빨강", "대형")
    }


}
