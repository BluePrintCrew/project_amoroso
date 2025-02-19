package org.example.amorosobackend.service;

import org.example.amorosobackend.domain.Coupon;
import org.example.amorosobackend.dto.CouponDTO;
import org.example.amorosobackend.repository.CouponRepository;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class CouponServiceTest {

    @InjectMocks
    private CouponService couponService;

    @Mock
    private CouponRepository couponRepository;

    public CouponServiceTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void 쿠폰_생성() {
        // given
        CouponDTO request = new CouponDTO();
        request.setName("테스트 쿠폰");
        request.setDiscountType(Coupon.DiscountType.FIXED);
        request.setDiscountValue(5000);
        request.setMinimumOrderAmount(30000);
        request.setValidFrom(LocalDateTime.now());
        request.setValidUntil(LocalDateTime.now().plusDays(10));
        request.setActive(true);

        Coupon savedCoupon = Coupon.builder()
                .name("테스트 쿠폰")
                .discountType(Coupon.DiscountType.FIXED)
                .discountValue(5000)
                .minimumOrderAmount(30000)
                .validFrom(LocalDateTime.now())
                .validUntil(LocalDateTime.now().plusDays(10))
                .isActive(true)
                .build();

        when(couponRepository.save(savedCoupon)).thenReturn(savedCoupon);

        // when
        CouponDTO createdCoupon = couponService.createCoupon(request);

        // then
        assertThat(createdCoupon.getName()).isEqualTo("테스트 쿠폰");
    }
}