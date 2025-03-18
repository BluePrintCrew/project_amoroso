package org.example.amorosobackend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

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
      //  private List<String> imageUrls;  // 리뷰 이미지 리스트
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        private int rating;
        private String content;
     //   private List<String> imageUrls;  // 리뷰 이미지 리스트
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
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReviewableProduct{
        private Long productId;
        private String productName;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime orderDate;
        private boolean isReviewable;
        private String mainImageUri;

    }
}