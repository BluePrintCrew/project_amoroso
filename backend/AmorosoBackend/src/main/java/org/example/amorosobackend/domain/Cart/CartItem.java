package org.example.amorosobackend.domain.Cart;

import lombok.*;
import jakarta.persistence.*;
import org.example.amorosobackend.domain.User;
import org.example.amorosobackend.domain.product.Product;

import java.time.LocalDateTime;

@Entity
@Table(name = "cart_items")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cartItemId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product; // 즉시로딩으로 가져옴

    @Column(nullable = false)
    private Integer quantity = 1;

    @Column(nullable = false)
    private Integer priceSnapshot; // 장바구니 추가 당시 가격 저장

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private String mainImageURL; // 해당 카트아이템에서 확인 할 수 있어야함

    @Setter
    @OneToOne(mappedBy = "cartItem", cascade = CascadeType.ALL, orphanRemoval = true)
    private CartAdditionalOption cartAdditionalOption;

    @Setter
    @OneToOne(mappedBy = "cartItem", cascade = CascadeType.ALL, orphanRemoval = true)
    private CartProductOption cartProductOption;


    public void updateQuantity(Integer quantity) {
        if (quantity == null || quantity < 1) {
            throw new IllegalArgumentException("장바구니 수량은 1 이상이어야 합니다.");
        }
        this.quantity = quantity;
    }

    public void removeProduct() {
        this.product = null;
    }

    @Builder
    private CartItem(User user, Product product, Integer quantity) {
        this.user = user;
        this.product = product;
        this.quantity = (quantity != null && quantity > 0) ? quantity : 1;
        this.priceSnapshot = product.getDiscountPrice() != null ? product.getDiscountPrice() : product.getMarketPrice(); // 장바구니 추가 시점의 가격 저장
    }

    @PrePersist
    public void onPrePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onPreUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CartItem cartItem = (CartItem) o;
        return cartItemId != null && cartItemId.equals(cartItem.cartItemId);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

}
