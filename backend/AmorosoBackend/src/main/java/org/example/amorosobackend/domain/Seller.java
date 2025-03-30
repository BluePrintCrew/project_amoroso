package org.example.amorosobackend.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.example.amorosobackend.domain.product.Product;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "sellers")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Seller {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sellerId;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;  // 판매자 계정

    @Column(nullable = false, length = 100, unique = true)
    private String brandName; // 브랜드명

    @Column(nullable = false, unique = true, length = 50)
    private String businessRegistrationNumber; // 사업자 등록번호

    // 판매자가 등록한 상품 목록
    @OneToMany(mappedBy = "seller", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Product> products = new ArrayList<>();

    @OneToMany(mappedBy = "seller", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Order> orders = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Builder
    private Seller(User user, String brandName, String businessRegistrationNumber) {
        this.user = user;
        this.brandName = brandName;
        this.businessRegistrationNumber = businessRegistrationNumber;
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