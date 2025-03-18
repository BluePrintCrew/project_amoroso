package org.example.amorosobackend.domain.coupon;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "coupons")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long couponId;

    @Column(nullable = false, length = 100)
    private String name;  // 쿠폰 이름 (ex. "10% 할인 쿠폰")

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DiscountType discountType; // 정액 할인 (FIXED) or 정률 할인 (PERCENTAGE)

    @Column(nullable = false)
    private int discountValue; // 할인 금액 (ex. 10% or 5000원)

    @Column(nullable = false)
    private int minimumOrderAmount; // 최소 주문 금액 (ex. 30000원 이상 주문 시 적용 가능)

    @Column(nullable = false)
    private LocalDateTime validFrom; // 쿠폰 사용 가능 시작일

    @Column(nullable = false)
    private LocalDateTime validUntil; // 쿠폰 사용 기한

    @Column(nullable = false)
    private boolean isActive; // 쿠폰 활성화 여부

    @Builder
    public Coupon(String name, DiscountType discountType, int discountValue, int minimumOrderAmount,
                  LocalDateTime validFrom, LocalDateTime validUntil, boolean isActive) {
        this.name = name;
        this.discountType = discountType;
        this.discountValue = discountValue;
        this.minimumOrderAmount = minimumOrderAmount;
        this.validFrom = validFrom;
        this.validUntil = validUntil;
        this.isActive = isActive;
    }

    public enum DiscountType {
        FIXED,        // 고정 금액 할인 (ex. 5000원 할인)
        PERCENTAGE    // 퍼센트 할인 (ex. 10% 할인)
    }
}