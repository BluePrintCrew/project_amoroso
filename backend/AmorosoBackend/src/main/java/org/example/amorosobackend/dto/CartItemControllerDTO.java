package org.example.amorosobackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.example.amorosobackend.domain.CartItem;
public class CartItemControllerDTO {

    @Data
    @RequiredArgsConstructor
    @AllArgsConstructor
    public static class CartItemResponseDTO{
        private Long cartItemId;
        private Long productId;
        private String productName;
        private int quantity;
        private int price;
        private int totalPrice;

        public CartItemResponseDTO(CartItem cartItem) {
            this.cartItemId = cartItem.getCartItemId();
            this.productId = cartItem.getProduct().getProductId();
            this.productName = cartItem.getProduct().getProductName();
            this.quantity = cartItem.getQuantity();
            this.price = cartItem.getProduct().getPrice();
            this.totalPrice = cartItem.getQuantity() * cartItem.getProduct().getPrice();
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
