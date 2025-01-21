package org.example.amorosobackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserUpdateRequest {
        private String name;
        private String phoneNumber;
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
