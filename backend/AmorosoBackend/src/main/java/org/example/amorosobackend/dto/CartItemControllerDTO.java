package org.example.amorosobackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.example.amorosobackend.domain.cart.CartAdditionalOption;
import org.example.amorosobackend.domain.cart.CartItem;
import org.example.amorosobackend.domain.cart.CartProductOption;


public class CartItemControllerDTO {

    @Data
    @RequiredArgsConstructor
    @AllArgsConstructor
    public static class CartItemResponseDTO {
        private Long cartItemId;
        private Long productId;
        private String productName;
        private int quantity;
        private Integer discountPrice; // 현재가 (할인 등 적용 가격)
        private int MarketPrice; // 원가
        private int totalPrice;

        private Long additionalOptionId;
        private String additionalOptionName;
        private Integer additionalPrice;

        private Long productOptionId;
        private String productOptionName;
        private String selectedOptionValue;

        public CartItemResponseDTO(CartItem cartItem) {
            this.cartItemId = cartItem.getCartItemId();
            this.productId = cartItem.getProduct().getProductId();
            this.productName = cartItem.getProduct().getProductName();
            this.quantity = cartItem.getQuantity();
            this.MarketPrice = cartItem.getProduct().getMarketPrice();

            this.discountPrice = cartItem.getProduct().getDiscountPrice();

            int basePrice = (this.discountPrice > 0 ? this.discountPrice : this.MarketPrice);
            this.totalPrice = basePrice * this.quantity;

            if (cartItem.getCartAdditionalOption() != null) {
                CartAdditionalOption additionalOption = cartItem.getCartAdditionalOption();
                this.additionalOptionId = additionalOption.getAdditionalOption().getId();
                this.additionalOptionName = additionalOption.getAdditionalOption().getOptionName();
                this.additionalPrice = additionalOption.getAdditionalPrice();
                this.totalPrice += this.quantity * this.additionalPrice; // 추가 옵션 가격 포함
            }

            if (cartItem.getCartProductOption() != null) {
                CartProductOption productOption = cartItem.getCartProductOption();
                this.productOptionId = productOption.getProductOption().getId();
                this.productOptionName = productOption.getProductOption().getOptionName();
                this.selectedOptionValue = productOption.getSelectedValue();
            }
        }
    }

    @Data
    @RequiredArgsConstructor
    @AllArgsConstructor
    public static class CartItemRequestDTO {
        private Long productId;
        private int quantity;
        private Long additionalOptionId; // 선택 가능 (없으면 null)
        private Long productOptionId; // 선택 가능 (없으면 null)
        private String selectedOptionValue; // 옵션이 있다면 값 전달 (예: "빨강", "대형")
    }
}
