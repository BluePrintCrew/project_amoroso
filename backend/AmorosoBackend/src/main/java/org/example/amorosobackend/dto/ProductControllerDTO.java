package org.example.amorosobackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.amorosobackend.domain.Product;
import org.example.amorosobackend.domain.Review;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class ProductControllerDTO {


    // 조회
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ProductListResponse{
        Long productId;
        int totalPages;
        int totalItems;
        List<ProductInfoDTO> products= new ArrayList<>();
    }


    // DTO 두개로작성
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ProductInfoDTO {
        Long productId;
        String productName;
        int price;
        String category;
        String primaryImageURL;
        String createdAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductInfoDetailDTO {
        Long productId;
        String productName;
        String description;
        int price;
        int stock;
        List<String> imagesURL;
        List<ProductReviewDTO> reviews;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductReviewDTO{
        Long reviewId;
        String userName;
        int rating;
        String content;
        String createdAt;
    }

    public static ProductInfoDTO toProductInfoDTO(Product product) {
        // DateTimeFormatter 정의 (원하는 포맷으로 설정)
        String formattedCreatedAt = dateToString(product.getCreatedAt());

        return new ProductInfoDTO(
                product.getProductId(),
                product.getProductName(),
                product.getPrice(),
                product.getCategory().getCategoryCode(),
                product.getPrimaryImage().getImageUrl(),
                formattedCreatedAt // 변환된 문자열 값
        );
    }

    public static String dateToString(LocalDateTime dateTime){
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        // createdAt을 문자열로 변환
        return dateTime.format(formatter);

    }

}
