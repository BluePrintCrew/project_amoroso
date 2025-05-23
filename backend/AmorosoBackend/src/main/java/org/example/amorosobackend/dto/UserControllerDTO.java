package org.example.amorosobackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;

public class UserControllerDTO {


    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserRegistrationRequest {
        private String email;
        private String password;
        private String name;
        private String phoneNumber;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OAuth2LoginRequest {
        private String accessToken;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserProfileResponse {
        private String email;
        private String name;
        private String phoneNumber;
        private String role;
        private String nickname;

        private int availableCoupons;      // 사용 가능한 쿠폰 수
        private int pendingReviews;        // 작성해야 하는 리뷰 수
        private int wishlistCount;         // 위시리스트에 담긴 상품 수
        private int orderCount;            // 총 주문 개수
        private int cartItemCount;         // 장바구니에 담긴 아이템 수

        private OrderStatusSummary orderStatusSummary; // 주문 상태 요약

        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public static class OrderStatusSummary {
            private int paymentPending;    // 입금 확인 중 (7)
            private int paymentCompleted;  // 결제 완료 (5)
            private int preparingShipment; // 배송 준비 중 (4)
            private int shipping;          // 배송 중 (1)
            private int delivered;         // 배송 완료 (0)

            private int cancelled;         // 취소 (1)
            private int returned;          // 반품 (0)
            private int exchanged;         // 교환 (0)
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserUpdateOrRegisterRequest {
        private String name;
        private String email;
        private String birthDate; // YYYY-MM-DD 형식의 문자열로 저장 (프론트에서 변환)
        private String phoneNumber;
        private String nickname;

        // 주소 정보
        private String postalCode;
        private String address;
        private String detailAddress;

        // 마케팅 동의 관련 필드
        private Boolean emailConsent;
        private Boolean smsConsent;
        private Boolean dmConsent;
        private Boolean locationConsent;

        public LocalDateTime getBirthDateTime() {
            try {
                if (birthDate == null || birthDate.trim().isEmpty()) {
                    return null;
                }
                return LocalDateTime.parse(birthDate + "T00:00:00");
            } catch (DateTimeParseException e) {
                throw new IllegalArgumentException("Invalid date format. Please use YYYY-MM-DD format.", e);
            }
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ApiResponse {
        private String message;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginResponse {
        private String accessToken;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OAuth2LoginResponse {
        private String accessToken;
        private String refreshToken;
        private boolean isNewUser;
    }

}
