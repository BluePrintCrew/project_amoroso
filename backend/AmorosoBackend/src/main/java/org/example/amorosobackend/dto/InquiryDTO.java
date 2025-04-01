package org.example.amorosobackend.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

public class InquiryDTO {

    @Getter
    public static class InquiryRequestDto {
        private String inquiryTitle;
        private String inquiryDescription;
        private Long productId;
    }

    @Getter
    public static class InquiryResponseDto {
        private Long inquiryId;
        private String inquiryTitle;
        private String inquiryDescription;
        private String authorUsername;
        private boolean isAnswered;
        private LocalDateTime createdAt;

        @Builder
        public InquiryResponseDto(Long inquiryId, String inquiryTitle, String inquiryDescription,
                                  String authorUsername, boolean isAnswered, LocalDateTime createdAt) {
            this.inquiryId = inquiryId;
            this.inquiryTitle = inquiryTitle;
            this.inquiryDescription = inquiryDescription;
            this.authorUsername = authorUsername;
            this.isAnswered = isAnswered;
            this.createdAt = createdAt;
        }
    }
}
