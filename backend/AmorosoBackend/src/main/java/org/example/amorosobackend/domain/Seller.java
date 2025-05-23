package org.example.amorosobackend.domain;

import java.time.LocalDate;
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

    @Column(nullable = false)
    private LocalDate businessStartDate; // 사업 시작일

    @Column(nullable = false, length = 200)
    private String businessAddress; // 사업장 주소

    @Column(length = 100)
    private String businessDetailAddress; // 상세 주소

    @Column(nullable = false, length = 50)
    private String taxationType; // 과세 유형 (일반과세자, 간이과세자 등)

    @Column(nullable = false, length = 50)
    private String businessStatus; // 사업자 상태 (계속사업자, 휴업자 등)

    @Column(length = 20)
    private String businessTel; // 사업장 전화번호

    @Column(length = 100)
    private String businessEmail; // 사업장 이메일

    // 통신판매업 관련 필드 추가
    @Column(length = 50)
    private String ecommerceRegistrationNumber; // 통신판매업 신고번호

    @Column
    private LocalDate ecommerceRegistrationDate; // 통신판매업 신고일자

    @Column(length = 50)
    private String ecommerceBusinessStatus; // 통신판매 영업상태

    @Column(length = 200)
    private String ecommerceDomain; // 통신판매 사이트 도메인

    @Column(length = 200)
    private String serverLocation; // 서버 설치 장소

    @Column(length = 100)
    private String salesMethod; // 통신판매 방법

    @Column(length = 500)
    private String productCategories; // 취급 품목

    // 판매자가 등록한 상품 목록
    @OneToMany(mappedBy = "seller", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Product> products = new ArrayList<>();

    @OneToMany(mappedBy = "seller", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Order> orders = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Builder
    private Seller(User user, String brandName, String businessRegistrationNumber,
                  LocalDate businessStartDate, String businessAddress, String businessDetailAddress,
                  String taxationType, String businessStatus, String businessTel, String businessEmail,
                  String ecommerceRegistrationNumber, LocalDate ecommerceRegistrationDate,
                  String ecommerceBusinessStatus, String ecommerceDomain, String serverLocation,
                  String salesMethod, String productCategories) {
        this.user = user;
        this.brandName = brandName;
        this.businessRegistrationNumber = businessRegistrationNumber;
        this.businessStartDate = businessStartDate;
        this.businessAddress = businessAddress;
        this.businessDetailAddress = businessDetailAddress;
        this.taxationType = taxationType;
        this.businessStatus = businessStatus;
        this.businessTel = businessTel;
        this.businessEmail = businessEmail;
        this.ecommerceRegistrationNumber = ecommerceRegistrationNumber;
        this.ecommerceRegistrationDate = ecommerceRegistrationDate;
        this.ecommerceBusinessStatus = ecommerceBusinessStatus;
        this.ecommerceDomain = ecommerceDomain;
        this.serverLocation = serverLocation;
        this.salesMethod = salesMethod;
        this.productCategories = productCategories;
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