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
        private boolean isInWishlist;
        // -> 이부분을 추가해야함
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
        private Integer discountRate;
        private Boolean outOfStock;
        private Integer stockNotificationThreshold;
        private String mainImageURL;
        private List<ImageSequenceInfoDTO> subImagesURL;
        private List<ImageSequenceInfoDTO> detailDescriptionImageURL;
        private List<ProductReviewDTO> reviews;

        private List<AdditionalOptionResponse> additionalOptionResponses;
        private List<ProductOptionResponse> productOptionResponses;


    }
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ImageSequenceInfoDTO {
        private String imageURL;
        private Integer imageNum;
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

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductOptionResponse {
        private Long ProductOptionId;
        private String optionName;
        private List<String> optionValues;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AdditionalOptionResponse{
        private Long AdditionalOptionId;
        private String optionName;
        private Integer additionalPrice;
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
        private String categoryCode;            // 카테고리 코드 (상품이 속한 카테고리의 식별 코드)
        private String productName;             // 상품명
        private String description;             // 상품의 간단한 설명
        private Integer stock;                  // 재고 (현재 남아있는 상품의 수량)

        private String productCode;             // 해당 제품 코드 (상품을 구별하기 위한 고유 코드)
        private String manufacturer;            // 생산지 (상품을 제조한 회사 또는 제조 지역)
        private String origin;                  // 원산지 (상품의 주요 재료 또는 생산 국가)
        private String brand;                   // 브랜드 (상품의 브랜드명)
        private Boolean couponApplicable;       // 쿠폰 적용 가능 여부 (쿠폰 사용 가능 여부를 나타내는 값)
        private String color;                   // 색상 (상품의 색상 정보)
        private String components;              // 구성품 (상품이 포함하는 구성 요소들)
        private String material;                // 소재 (상품의 주된 재료)
        private String size;                    // 크기 (상품의 크기 또는 규격)
        private Integer shippingInstallationFee;// 배송 및 설치 비용 (추가적인 배송 및 설치 비용)

        private String asPhoneNumber;           // A/S 전화번호 (상품의 A/S를 위한 고객 지원 전화번호)
        private Integer costPrice;              // 원가 (상품의 제조 또는 도매 가격)
        private Integer marketPrice;            // 시중 가격 (상품이 시장에서 판매되는 가격)
        private Boolean outOfStock;             // 품절 여부 (상품이 품절되었는지 여부)
        private Integer stockNotificationThreshold; // 재고 알림 임계값 (해당 수량 이하로 재고가 줄어들면 알림을 보내기 위한 기준)
        private Integer discountRate;           // 할인율 (상품의 할인 비율)

        // 옵션들
        private List<ProductOptionRequest> productOptions;    // 상품 기본 옵션 목록 (색상, 크기 등의 기본적인 옵션)
        private List<AdditionalOptionRequest> additionalOptions; // 추가 옵션 목록 (추가 선택 가능한 부가 옵션)

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
        private List<ProductOptionRequest> productOptions;
        private List<AdditionalOptionRequest> additionalOptions;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductOptionRequest {
        private String optionName;
        private List<String> optionValues;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AdditionalOptionRequest{
        private String optionName;
        private Integer additionalPrice;
    }
}
