package org.example.amorosobackend.domain.cart;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.example.amorosobackend.domain.product.ProductOption;

@Entity
@Table(name = "cart_product_options")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CartProductOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "cart_item_id", nullable = false)
    private CartItem cartItem;

    @ManyToOne
    @JoinColumn(name = "product_option_id", nullable = false)
    private ProductOption productOption;

    @Column(nullable = false)
    private String selectedValue; // 선택된 옵션 값 (예: "빨강", "대형")

    @Builder
    public CartProductOption(CartItem cartItem, ProductOption productOption, String selectedValue) {
        this.cartItem = cartItem;
        this.productOption = productOption;
        this.selectedValue = selectedValue;
    }
}
