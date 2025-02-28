package org.example.amorosobackend.domain.product;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "product_options")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProductOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product; // 어떤 상품의 옵션인지 연결

    @Column(nullable = false)
    private String optionName; // 옵션 이름 (예: 색상, 크기 등)

    @ElementCollection
    @CollectionTable(name = "product_option_values", joinColumns = @JoinColumn(name = "product_option_id"))
    @Column(name = "option_value")
    private List<String> optionValues = new ArrayList<>(); // 옵션 값 목록 (예: 빨강, 파랑, 검정)

    @Builder
    public ProductOption(Product product, String optionName, List<String> optionValues) {
        this.product = product;
        this.optionName = optionName;
        this.optionValues = optionValues;
    }
}
