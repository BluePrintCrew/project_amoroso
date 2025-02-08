package org.example.amorosobackend.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

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

    @Column(nullable = false, length = 100)
    private String brandName; // 브랜드명

    @Column(nullable = false, unique = true, length = 50)
    private String businessRegistrationNumber; // 사업자 등록번호

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