package org.example.amorosobackend.repository;

import org.example.amorosobackend.domain.Coupon;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class CouponRepositoryTest {

    @Autowired
    private CouponRepository couponRepository;

    @Test
    void findByName() {
        // given
        Coupon coupon = Coupon.builder()
                .name("10% 할인 쿠폰")
                .discountType(Coupon.DiscountType.PERCENTAGE)
                .discountValue(10)
                .minimumOrderAmount(50000)
                .validFrom(LocalDateTime.now())
                .validUntil(LocalDateTime.now().plusDays(10))
                .isActive(true)
                .build();
        couponRepository.save(coupon);

        // when
        Optional<Coupon> foundCoupon = couponRepository.findByName("10% 할인 쿠폰");

        // then
        assertThat(foundCoupon).isPresent();
        assertThat(foundCoupon.get().getDiscountValue()).isEqualTo(10);
    }
}