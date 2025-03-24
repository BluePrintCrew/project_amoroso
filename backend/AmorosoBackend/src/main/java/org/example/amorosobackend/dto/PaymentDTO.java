package org.example.amorosobackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class PaymentDTO {

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PaymentVerifyRequest {
        private Long orderId;
        private String impUid; // PortOne에서 반환받은 결제 고유 ID (예: imp_uid와 유사한 값)
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PaymentVerifyResponse {
        private boolean success;
        private String message;
        //private T data;
    }
}
