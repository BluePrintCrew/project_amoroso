package org.example.amorosobackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

public class SellerRegistrationDTO {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {

        private String email;
        private String password;
        private String name;
        private String phoneNumber;
        

        private Boolean emailConsent;
        private Boolean smsConsent;
        private Boolean dmConsent;
        private Boolean locationConsent;
        

        private String brandName;
        private String businessNumber;
        private LocalDate businessStartDate;
        private String businessAddress;
        private String businessDetailAddress;
        private String taxationType;
        private String businessStatus;
        private String businessTel;
        private String businessEmail;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private String email;
        private String name;
        private String brandName;
        private String businessNumber;
        private LocalDate businessStartDate;
        private String businessAddress;
        private String businessDetailAddress;
        private String taxationType;
        private String businessStatus;
        private String message;
    }
} 