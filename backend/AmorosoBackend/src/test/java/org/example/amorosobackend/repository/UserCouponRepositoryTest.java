package org.example.amorosobackend.repository;

import org.example.amorosobackend.domain.Coupon;
import org.example.amorosobackend.domain.User;
import org.example.amorosobackend.domain.UserCoupon;
import org.example.amorosobackend.enums.UserRole;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class UserCouponRepositoryTest {

    @Autowired
    private UserCouponRepository userCouponRepository;

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void findByUser() {
        // given
        User user = User.builder()
                .email("test@example.com")
                .password("password")
                .name("테스트 유저")
                .role(UserRole.USER.name())
                .isActive(true)
                .build();
        userRepository.save(user);

        Coupon coupon = Coupon.builder()
                .name("5000원 할인 쿠폰")
                .discountType(Coupon.DiscountType.FIXED)
                .discountValue(5000)
                .minimumOrderAmount(30000)
                .validFrom(LocalDateTime.now())
                .validUntil(LocalDateTime.now().plusDays(10))
                .isActive(true)
                .build();
        couponRepository.save(coupon);

        UserCoupon userCoupon = UserCoupon.builder()
                .user(user)
                .coupon(coupon)
                .isAvailable(true)
                .build();
        userCouponRepository.save(userCoupon);

        // when
        List<UserCoupon> userCoupons = userCouponRepository.findByUser(user);

        // then
        assertThat(userCoupons).hasSize(1);
        assertThat(userCoupons.get(0).getCoupon().getName()).isEqualTo("5000원 할인 쿠폰");
    }
}