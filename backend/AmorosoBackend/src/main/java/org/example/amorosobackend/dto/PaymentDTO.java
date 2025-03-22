package org.example.amorosobackend.dto;

import lombok.Data;

public class PaymentDTO {

    @Data
    public class PaymentCompleteRequest {
        private Long orderId;
        private String payment_imp_uid; // PortOne에서 반환받은 결제 고유 ID (예: imp_uid와 유사한 값)
    }
}
