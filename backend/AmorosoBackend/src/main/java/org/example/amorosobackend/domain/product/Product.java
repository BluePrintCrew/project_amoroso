package org.example.amorosobackend.domain.product;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.example.amorosobackend.domain.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false, length = 200)
    private String productName; // 상품명

    private String productCode; // 상품 코드

    @Lob
    @Basic(fetch = FetchType.LAZY)
    private String description;  // 상품 설명 (대용량)

    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    private Seller seller;



    private String mainImageUri; // 대표 이미지 Uri

    @Column(nullable = false)
    private Integer stock; // 재고 수량

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @OneToOne
    @JoinColumn(name = "product_image_Id")
    private ProductImage primaryImage;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImage> productImages = new ArrayList<>(); // 상품 이미지 리스트

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>(); // 리뷰 리스트

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Wishlist> wishlists = new ArrayList<>(); // 위시리스트

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> cartItems = new ArrayList<>(); // 장바구니 아이템 리스트

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>(); // 주문 아이템 리스트

    @ManyToMany
    @JoinTable(
            name = "product_tags",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private List<Tag> tags = new ArrayList<>(); // 다대다 태그

    // 새로 추가한 필드들
    private String manufacturer;
    private String origin;
    private String brand;
    private Boolean couponApplicable;
    private String color;
    private String components;
    private String material;
    private String size;
    private Integer shippingInstallationFee;
    private String asPhoneNumber;
    private Integer costPrice; // 원가
    @Column(nullable = false)
    private Integer marketPrice; // 판매가
    private Boolean outOfStock;
    private Integer stockNotificationThreshold;
    @Column(precision = 5, scale = 2, nullable = false)
    private Integer discountRate; // 0 ~ 9
    private Integer discountPrice; // discountRate에 따라 바뀜.

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductOption> productOptions = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AdditionalOption> additionalOptions = new ArrayList<>();

    /**
     * 모든 필드를 포함한 Builder
     */
    @Builder
    public Product(
            Category category,
            String productName,
            String productCode,
            String description,
            Seller seller,
            String mainImageUri,
            Integer stock,
            String manufacturer,
            String origin,
            String brand,
            Boolean couponApplicable,
            String color,
            String components,
            String material,
            String size,
            Integer shippingInstallationFee,
            String asPhoneNumber,
            Integer costPrice,
            Integer marketPrice,
            Boolean outOfStock,
            Integer stockNotificationThreshold,
            LocalDateTime createdAt,
            Integer discountRate
    ) {
        this.category = category;
        this.productName = productName;
        this.productCode = productCode;
        this.description = description;
        this.seller = seller;
        this.mainImageUri = mainImageUri;
        this.stock = stock != null ? stock : 0;
        this.manufacturer = manufacturer;
        this.origin = origin;
        this.brand = brand;
        this.couponApplicable = couponApplicable;
        this.color = color;
        this.components = components;
        this.material = material;
        this.size = size;
        this.shippingInstallationFee = shippingInstallationFee;
        this.asPhoneNumber = asPhoneNumber;
        this.costPrice = costPrice;
        this.marketPrice = marketPrice != null ? marketPrice : 0;
        this.outOfStock = outOfStock;
        this.stockNotificationThreshold = stockNotificationThreshold;
        this.createdAt = createdAt;
        this.discountRate = discountRate;
    }

    @PrePersist
    public void onPrePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.outOfStock == null) {
            this.outOfStock = false;
        }
    }

    @PreUpdate
    public void onPreUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // --- Setter 혹은 Update 메서드들 ---
    public void updateCategory(Category category) {
        this.category = category;
    }
    public void updateProductName(String productName) {
        this.productName = productName;
    }
    public void updateDescription(String description) {
        this.description = description;
    }
    public void updateStock(Integer stock) {
        this.stock = stock != null ? stock : 0;
    }


    public Integer getDiscountPrice() {
        if (this.marketPrice == null || this.discountRate == null) {
            return this.marketPrice; // 가격 또는 할인율이 없으면 원래 가격 반환
        }

        Integer discountPrice = (int) Math.ceil((this.marketPrice * (this.discountRate / 100.0)) / 10.0) * 10;
        return discountPrice;
    }

    public void setMainImageUri(String mainImageUri) {
        this.mainImageUri = mainImageUri;
    }

    public void updateProductCode(String productCode) { this.productCode = productCode; }
    public void updateManufacturer(String manufacturer) { this.manufacturer = manufacturer; }
    public void updateOrigin(String origin) { this.origin = origin; }
    public void updateBrand(String brand) { this.brand = brand; }
    public void updateCouponApplicable(Boolean couponApplicable) { this.couponApplicable = couponApplicable; }
    public void updateColor(String color) { this.color = color; }
    public void updateComponents(String components) { this.components = components; }
    public void updateMaterial(String material) { this.material = material; }
    public void updateSize(String size) { this.size = size; }
    public void updateShippingInstallationFee(Integer fee) { this.shippingInstallationFee = fee; }
    public void updateAsPhoneNumber(String asPhoneNumber) { this.asPhoneNumber = asPhoneNumber; }
    public void updateCostPrice(Integer costPrice) { this.costPrice = costPrice; }
    public void updateMarketPrice(Integer marketPrice) { this.marketPrice = marketPrice; }
    public void updateOutOfStock(Boolean outOfStock) { this.outOfStock = outOfStock; }
    public void updateStockNotificationThreshold(Integer threshold) { this.stockNotificationThreshold = threshold; }
    public void updateDiscountRate( Integer discountRate) { this.discountRate = discountRate; }
}
