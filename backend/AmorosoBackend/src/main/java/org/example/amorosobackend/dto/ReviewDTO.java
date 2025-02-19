package org.example.amorosobackend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

public class ReviewDTO {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        private Long productId;
        private int rating;
        private String content;
        private List<String> imageUrls;  // 리뷰 이미지 리스트
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        private int rating;
        private String content;
        private List<String> imageUrls;  // 리뷰 이미지 리스트
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class Response {
        private Long reviewId;
        private String userName;
        private int rating;
        private String content;
        private List<String> imageUrls;
        private LocalDateTime createdAt;
    }
}