package org.example.amorosobackend.domain;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
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
    private Product product;

    @Column(nullable = false)
    private Integer quantity = 1;

    @Column(nullable = false)
    private Integer priceSnapshot; // 장바구니 추가 당시 가격 저장

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

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
        this.priceSnapshot = product.getPrice(); // 장바구니 추가 시점의 가격 저장
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
