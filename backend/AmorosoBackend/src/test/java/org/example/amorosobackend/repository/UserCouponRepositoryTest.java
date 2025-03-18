package org.example.amorosobackend.repository;

import org.example.amorosobackend.domain.coupon.Coupon;
import org.example.amorosobackend.domain.User;
import org.example.amorosobackend.domain.coupon.UserCoupon;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
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
                .role("USER")
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
                .isUsed(true)
                .build();
        userCouponRepository.save(userCoupon);

        // when
        List<UserCoupon> userCoupons = userCouponRepository.findByUser(user);

        // then
        assertThat(userCoupons).hasSize(1);
        assertThat(userCoupons.get(0).getCoupon().getName()).isEqualTo("5000원 할인 쿠폰");
    }
}