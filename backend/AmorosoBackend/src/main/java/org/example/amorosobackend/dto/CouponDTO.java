package org.example.amorosobackend.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.amorosobackend.domain.Coupon;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class CouponDTO {
    private Long couponId;
    private String name;
    private Coupon.DiscountType discountType;
    private int discountValue;
    private int minimumOrderAmount;
    private LocalDateTime validFrom;
    private LocalDateTime validUntil;
    private boolean isActive;

    public CouponDTO(Coupon coupon) {
        this.couponId = coupon.getCouponId();
        this.name = coupon.getName();
        this.discountType = coupon.getDiscountType();
        this.discountValue = coupon.getDiscountValue();
        this.minimumOrderAmount = coupon.getMinimumOrderAmount();
        this.validFrom = coupon.getValidFrom();
        this.validUntil = coupon.getValidUntil();
        this.isActive = coupon.isActive();
    }
}