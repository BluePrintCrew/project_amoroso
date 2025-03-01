package org.example.amorosobackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

/**
 * 상품 관련 DTO 모음
 */
public class ProductDTO {

    // ---------------------------
    // 1) 조회용 DTO
    // ---------------------------
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ProductListResponse {
        private int totalPages;
        private int totalItems;
        private List<ProductInfoDTO> products = new ArrayList<>();
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ProductInfoDTO {
        private Long productId;
        private String productName;
        private Integer marketPrice;
        private Integer discountPrice;
        private Integer discountRate;
        private String category;
        private String primaryImageURL;
        private String createdAt;
    }

    /**
     * 단일 상품 상세 정보 DTO
     * 기존 필드 + 새 필드들을 모두 포함
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductInfoDetailDTO {
        private Long productId;
        private String productName;
        private String description;
        private int stock;

        private String productCode;
        private String manufacturer;
        private String origin;
        private String brand;
        private Boolean couponApplicable;
        private String color;
        private String components;
        private String material;
        private String size;
        private Integer shippingInstallationFee;
        private String asPhoneNumber;
        private Integer marketPrice;
        private Integer discountPrice;
        private Boolean outOfStock;
        private Integer stockNotificationThreshold;

        private List<String> imagesURL;
        private List<ProductReviewDTO> reviews;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductReviewDTO {
        private Long reviewId;
        private String userName;
        private int rating;
        private String content;
        private String createdAt;
    }

    // 필요하다면 유틸 메서드 (dateTime -> String 변환 등)도 여기에 넣을 수 있음.
    private static String dateToString(LocalDateTime dateTime) {
        if (dateTime == null) return null;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        return dateTime.format(formatter);
    }

    // ---------------------------
    // 2) 등록/수정용 DTO
    // ---------------------------
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Create {
        private String categoryCode;            // 카테고리 코드를 문자열로 전달받음
        private String productName;
        private String description;
        private Integer stock;

        private String productCode;
        private String manufacturer;
        private String origin;
        private String brand;
        private Boolean couponApplicable;
        private String color;
        private String components;
        private String material;
        private String size;
        private Integer shippingInstallationFee;
        private String asPhoneNumber;
        private Integer costPrice;
        private Integer marketPrice;
        private Boolean outOfStock;
        private Integer stockNotificationThreshold;
        private Integer discountRate;

        // 옵션들
        private List<ProductOptionDto> productOptions;
        private List<AdditionalOptionDto> additionalOptions;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Update {
        private Long productId;                // 어떤 상품을 수정할지 식별
        private String categoryCode;           // 수정 시 카테고리도 변경 가능
        private String productName;
        private String description;
        private Integer stock;

        private String productCode;
        private String manufacturer;
        private String origin;
        private String brand;
        private Boolean couponApplicable;
        private String color;
        private String components;
        private String material;
        private String size;
        private Integer shippingInstallationFee;
        private String asPhoneNumber;
        private Integer costPrice;
        private Integer marketPrice;
        private Boolean outOfStock;
        private Integer stockNotificationThreshold;
        private Integer discountRate;

        // 옵션들
        private List<ProductOptionDto> productOptions;
        private List<AdditionalOptionDto> additionalOptions;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductOptionDto {
        private String optionName;
        private List<String> optionValues;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AdditionalOptionDto {
        private String optionName;
        private Integer additionalPrice;
    }
}
