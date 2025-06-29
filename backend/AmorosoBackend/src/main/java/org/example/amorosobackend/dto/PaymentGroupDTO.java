package org.example.amorosobackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.amorosobackend.domain.PaymentGroup;
import org.example.amorosobackend.dto.OrderControllerDTO.OrderResponseDTO;
import org.example.amorosobackend.enums.PaymentStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class PaymentGroupDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentGroupResponseDTO {
        private Long paymentGroupId;
        private String paymentGroupCode;
        private Integer totalAmount;
        private String paymentStatus;
        private List<OrderResponseDTO> orders;
        private LocalDateTime createdAt;

        public PaymentGroupResponseDTO(PaymentGroup paymentGroup) {
            this.paymentGroupId = paymentGroup.getPaymentGroupId();
            this.paymentGroupCode = paymentGroup.getPaymentGroupCode();
            this.totalAmount = paymentGroup.getTotalAmount();
            this.paymentStatus = paymentGroup.getPaymentStatus().getKoreanName();
            this.createdAt = paymentGroup.getCreatedAt();
            this.orders = paymentGroup.getOrders().stream()
                    .map(OrderResponseDTO::new)
                    .collect(Collectors.toList());
        }
    }
}