package org.example.amorosobackend.domain.Cart;


import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.example.amorosobackend.domain.product.AdditionalOption;

@Entity
@Table(name = "cart_additional_options")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CartAdditionalOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "cart_item_id", nullable = false)
    private CartItem cartItem;

    @ManyToOne
    @JoinColumn(name = "additional_option_id", nullable = false)
    private AdditionalOption additionalOption;

    @Column(nullable = false)
    private Integer additionalPrice; // 추가 옵션 선택 시 가격

    @Builder
    public CartAdditionalOption(CartItem cartItem, AdditionalOption additionalOption) {
        this.cartItem = cartItem;
        this.additionalOption = additionalOption;
        this.additionalPrice = additionalOption.getAdditionalPrice();
    }
}
