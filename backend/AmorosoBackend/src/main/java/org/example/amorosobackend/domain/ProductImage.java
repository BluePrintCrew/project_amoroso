package org.example.amorosobackend.domain;



import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.example.amorosobackend.domain.product.Product;
import org.example.amorosobackend.enums.ImageType;

import java.time.LocalDateTime;

@Entity
@Table(name = "product_images")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProductImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productImageId;

    @Enumerated(EnumType.STRING)
    ImageType imageType;
    Integer imageOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false, length = 255)
    private String imageUrl;

    private LocalDateTime createdAt;

    @Builder
    private ProductImage(Product product, String imageUrl,
                         Integer imageOrder,ImageType imageType ) {
        this.product = product;
        this.imageUrl = imageUrl;
        this.imageType = imageType;
        this.imageOrder = imageOrder;
    }

    @PrePersist
    public void onPrePersist() {
        this.createdAt = LocalDateTime.now();
    }
}

