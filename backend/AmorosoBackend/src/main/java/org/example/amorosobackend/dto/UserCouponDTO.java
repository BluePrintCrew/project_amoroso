package org.example.amorosobackend.dto;


import lombok.Getter;
import lombok.Setter;
import org.example.amorosobackend.domain.UserCoupon;

import java.time.LocalDateTime;

@Getter
@Setter
public class UserCouponDTO {
    private Long userCouponId;
    private String couponName;
    private boolean isUsed;
    private int discountValue;
    private String discountType;
    private LocalDateTime issuedAt;

    public UserCouponDTO(UserCoupon userCoupon) {
        this.userCouponId = userCoupon.getUserCouponId();
        this.couponName = userCoupon.getCoupon().getName();
        this.isUsed = userCoupon.isUsed();
        this.issuedAt = userCoupon.getIssuedAt();
        this.discountValue = userCoupon.getCoupon().getDiscountValue();;
        this.discountType = userCoupon.getCoupon().getDiscountType().name();
    }
}