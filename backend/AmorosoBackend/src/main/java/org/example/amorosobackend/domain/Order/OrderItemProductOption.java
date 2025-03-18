package org.example.amorosobackend.domain.Order;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.example.amorosobackend.domain.Cart.CartItem;
import org.example.amorosobackend.domain.product.ProductOption;

@Entity
@Table(name = "orderitem_product_options")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class OrderItemProductOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "order_item_id", nullable = false)
    private OrderItem orderItem;

    @ManyToOne
    @JoinColumn(name = "product_option_id", nullable = false)
    private ProductOption productOption;

    @Column(nullable = false)
    private String selectedValue; // 선택된 옵션 값 (예: "빨강", "대형")

    @Builder
    public OrderItemProductOption(OrderItem orderItem, ProductOption productOption, String selectedValue) {
        this.orderItem = orderItem;
        this.productOption = productOption;
        this.selectedValue = selectedValue;
    }
}
