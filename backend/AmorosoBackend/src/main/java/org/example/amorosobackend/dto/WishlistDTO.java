package org.example.amorosobackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.example.amorosobackend.domain.Wishlist;
import org.example.amorosobackend.domain.product.Product;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;
import java.util.List;

public class WishlistDTO {

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WishlistPageResponse {

        private List<WishlistResponse> content;
        private int currentPage;
        private int totalPages;
        private long totalElements;
        private int size;
        private boolean first;
        private boolean last;
        private boolean empty;

        public static WishlistPageResponse from(Page<WishlistResponse> page) {
            return WishlistPageResponse.builder()
                    .content(page.getContent())
                    .currentPage(page.getNumber())
                    .totalPages(page.getTotalPages())
                    .totalElements(page.getTotalElements())
                    .size(page.getSize())
                    .first(page.isFirst())
                    .last(page.isLast())
                    .empty(page.isEmpty())
                    .build();
        }
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WishlistResponse {

        private Long wishlistId;
        private Long productId;
        private String productName;
        private String productCode;
        private String description;
        private String mainImageUri;
        private String brand;
        private String manufacturer;
        private String color;
        private String size;
        private String material;
        private Integer marketPrice;
        private Integer discountPrice;
        private Integer stock;
        private String categoryName;
        private String sellerName;
        private LocalDateTime addedAt;

        public static WishlistResponse from(Wishlist wishlist) {
            Product product = wishlist.getProduct();

            return WishlistResponse.builder()
                    .wishlistId(wishlist.getWishlistId())
                    .productId(product.getProductId())
                    .productName(product.getProductName())
                    .productCode(product.getProductCode())
                    .description(product.getDescription())
                    .mainImageUri(product.getMainImageUri())
                    .brand(product.getBrand())


                    .marketPrice(product.getMarketPrice())
                    .discountPrice(product.getDiscountPrice())
                    .stock(product.getStock())

                    .addedAt(wishlist.getCreatedAt())
                    .build();
        }
    }
}