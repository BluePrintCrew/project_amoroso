package org.example.amorosobackend.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_coupons")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserCoupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userCouponId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "coupon_id", nullable = false)
    private Coupon coupon;

    private boolean isUsed; // 쿠폰 사용 여부

    private LocalDateTime issuedAt; // 쿠폰 발급일
    private LocalDateTime expiredAt; // 쿠폰 만료일
    @Builder
    public UserCoupon(User user, Coupon coupon, boolean isUsed) {
        this.user = user;
        this.coupon = coupon;
        this.isUsed = isUsed;
        this.issuedAt = LocalDateTime.now();
    }

    public void useCoupon() {
        this.isUsed = false;
    }
    public void updateAvailability() {
        // 만료되었거나 사용된 경우 false, 그렇지 않으면 true
        this.isUsed = expiredAt == null || expiredAt.isAfter(LocalDateTime.now());
    }
}