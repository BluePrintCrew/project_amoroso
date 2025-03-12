package org.example.amorosobackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.example.amorosobackend.domain.Cart.CartItem;
public class CartItemControllerDTO {

    @Data
    @RequiredArgsConstructor
    @AllArgsConstructor
    public static class CartItemResponseDTO{
        private Long cartItemId;
        private Long productId;
        private String productName;
        private int quantity;
        private int discountPrice; // 현재가 (할인 , 행사 등등)
        private int originalPrice; // 원가 (판매자가 초기 설정한 가격)
        private int totalPrice;

        public CartItemResponseDTO(CartItem cartItem) {
            this.cartItemId = cartItem.getCartItemId();
            this.productId = cartItem.getProduct().getProductId();
            this.productName = cartItem.getProduct().getProductName();
            this.quantity = cartItem.getQuantity();
//            int price = cartItem.getProduct().getDiscountPrice() != 0
//                    ? cartItem.getProduct().getDiscountPrice()
//                    : cartItem.getProduct().getMarketPrice();

            this.discountPrice = cartItem.getProduct().getDiscountPrice();
            this.originalPrice = cartItem.getProduct().getMarketPrice(); // 원가를 전달
            this.totalPrice = this.quantity * (cartItem.getProduct().getDiscountPrice() != null
                        ? cartItem.getProduct().getDiscountPrice()
                        : cartItem.getProduct().getMarketPrice());

        }
    }

    @Data
    @RequiredArgsConstructor
    @AllArgsConstructor
    public static class CartItemRequestDTO{
        private Long productId;
        private int quantity;

    }
}
