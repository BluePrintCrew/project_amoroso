package org.example.amorosobackend.domain.order;


import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.example.amorosobackend.domain.product.AdditionalOption;

@Entity
@Table(name = "orderitem_additional_options")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class OrderItemAdditionalOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "order_item_id", nullable = false)
    private OrderItem orderItem;

    @ManyToOne
    @JoinColumn(name = "additional_option_id", nullable = false)
    private AdditionalOption additionalOption;

    @Column(nullable = false)
    private Integer additionalPrice; // 추가 옵션 선택 시 가격

    @Builder
    public OrderItemAdditionalOption(OrderItem orderItem, AdditionalOption additionalOption) {
        this.orderItem = orderItem;
        this.additionalOption = additionalOption;
        this.additionalPrice = additionalOption.getAdditionalPrice();
    }
}
