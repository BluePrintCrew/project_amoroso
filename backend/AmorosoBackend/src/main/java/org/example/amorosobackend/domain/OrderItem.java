package org.example.amorosobackend.domain;



import lombok.*;
import jakarta.persistence.*;
import org.example.amorosobackend.domain.coupon.UserCoupon;
import org.example.amorosobackend.domain.product.Product;

import java.time.LocalDateTime;

@Entity
@Table(name = "order_items")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderItemId;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private Integer quantity;
    private Integer finalPrice;      // 최종 결제 금액
    private String mainImageUri; // 대표 이미지

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @OneToOne(mappedBy = "orderItem", cascade = CascadeType.ALL, orphanRemoval = true)
    private UserCoupon userCoupon;

    @Setter
    @OneToOne(mappedBy = "orderItem", cascade = CascadeType.ALL, orphanRemoval = true)
    private OrderItemAdditionalOption orderItemAdditionalOption;

    @Setter
    @OneToOne(mappedBy = "orderItem", cascade = CascadeType.ALL, orphanRemoval = true)
    private OrderItemProductOption orderItemProductOption;


    @Builder
    private OrderItem(Order order, Product product, Integer quantity, String mainImageUri, Integer finalPrice) {
        this.order = order;
        this.product = product;
        this.quantity = quantity;
        this.mainImageUri = mainImageUri;
        this.finalPrice = finalPrice;
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
}
