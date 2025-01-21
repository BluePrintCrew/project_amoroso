package org.example.amorosobackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

public class ProductControllerDTO {


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
        String image;
        String createdAt;
    }
}
