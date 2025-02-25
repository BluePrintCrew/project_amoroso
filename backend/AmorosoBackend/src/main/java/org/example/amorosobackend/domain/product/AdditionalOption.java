package org.example.amorosobackend.domain.product;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "additional_options")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AdditionalOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product; // 어떤 상품의 추가 옵션인지 연결

    @Column(nullable = false)
    private String optionName; // 추가 옵션 이름 (예: 선물 포장, 추가 부품)

    @Column(nullable = false)
    private Integer additionalPrice; // 해당 옵션의 추가 비용

    @Builder
    public AdditionalOption(Product product, String optionName, Integer additionalPrice) {
        this.product = product;
        this.optionName = optionName;
        this.additionalPrice = additionalPrice;
    }
}
