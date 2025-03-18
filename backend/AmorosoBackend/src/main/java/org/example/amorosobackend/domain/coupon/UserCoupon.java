package org.example.amorosobackend.domain.coupon;

import jakarta.persistence.*;
import lombok.*;
import org.example.amorosobackend.domain.Order.OrderItem;
import org.example.amorosobackend.domain.User;

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

    @OneToOne
    @JoinColumn(name = "order_item_id")
    private OrderItem orderItem;

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
        this.isUsed = true;
    }
    public void updateAvailability() {
        // 만료된 경우 사용됨으로 표시
        if (expiredAt != null && expiredAt.isBefore(LocalDateTime.now())) {
            this.isUsed = true;
        }
    }
}