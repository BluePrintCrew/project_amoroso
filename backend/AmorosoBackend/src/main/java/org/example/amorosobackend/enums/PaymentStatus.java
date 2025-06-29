package org.example.amorosobackend.enums;

public enum PaymentStatus {
    WAITING, COMPLETED, CANCELED;

    public String getKoreanName() {
        return switch (this) {
            case WAITING -> "결제 대기";
            case COMPLETED -> "결제 완료";
            case CANCELED -> "결제 취소";
        };
    }
}
