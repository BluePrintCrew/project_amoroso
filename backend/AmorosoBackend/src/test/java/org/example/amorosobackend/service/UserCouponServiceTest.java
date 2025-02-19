package org.example.amorosobackend.service;

import org.example.amorosobackend.domain.Coupon;
import org.example.amorosobackend.domain.User;
import org.example.amorosobackend.domain.UserCoupon;
import org.example.amorosobackend.dto.UserCouponDTO;
import org.example.amorosobackend.enums.UserRole;
import org.example.amorosobackend.repository.CouponRepository;
import org.example.amorosobackend.repository.UserCouponRepository;
import org.example.amorosobackend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;


class UserCouponServiceTest {

    @InjectMocks
    private UserCouponService userCouponService;

    @Mock
    private UserCouponRepository userCouponRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CouponRepository couponRepository;

    private User user;
    private Coupon coupon;
    private UserCoupon userCoupon;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        user = User.builder()
                .email("test@example.com")
                .password("password")
                .name("테스트 유저")
                .role(UserRole.USER.name())
                .isActive(true)
                .build();

        coupon = Coupon.builder()
                .name("1000원 할인 쿠폰")
                .discountType(Coupon.DiscountType.FIXED)
                .discountValue(1000)
                .minimumOrderAmount(5000)
                .validFrom(LocalDateTime.now())
                .validUntil(LocalDateTime.now().plusDays(10))
                .isActive(true)
                .build();

        userCoupon = UserCoupon.builder()
                .user(user)
                .coupon(coupon)
                .isUsed(false)
                .build();
    }

    @Test
    void issueCouponToUser() {
        // given
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(couponRepository.findById(1L)).thenReturn(Optional.of(coupon));
        when(userCouponRepository.save(any(UserCoupon.class))).thenReturn(userCoupon);

        // when
        UserCouponDTO issuedCoupon = userCouponService.issueCouponToUser(1L, 1L);

        // then
        assertThat(issuedCoupon.getCouponName()).isEqualTo("1000원 할인 쿠폰");
        assertThat(issuedCoupon.isUsed()).isFalse();
        verify(userCouponRepository, times(1)).save(any(UserCoupon.class));
    }

    @Test
    void getUserCoupons() {
        // given
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userCouponRepository.findByUser(user)).thenReturn(List.of(userCoupon));

        // when
        List<UserCouponDTO> userCoupons = userCouponService.getUserCoupons(1L);

        // then
        assertThat(userCoupons).hasSize(1);
        assertThat(userCoupons.get(0).getCouponName()).isEqualTo("1000원 할인 쿠폰");
        verify(userCouponRepository, times(1)).findByUser(user);
    }

    @Test
    void useCoupon() {
        // given
        when(userCouponRepository.findById(1L)).thenReturn(Optional.of(userCoupon));

        // when
        userCouponService.useCoupon(1L);

        // then
        assertThat(userCoupon.isUsed()).isTrue();
        verify(userCouponRepository, times(1)).save(userCoupon);
    }

    @Test
    void useCoupon_ThrowsException_WhenAlreadyUsed() {
        // given
        userCoupon.useCoupon(); // 이미 사용한 쿠폰으로 설정
        when(userCouponRepository.findById(1L)).thenReturn(Optional.of(userCoupon));

        // when & then
        assertThrows(IllegalStateException.class, () -> userCouponService.useCoupon(1L));
        verify(userCouponRepository, never()).save(any(UserCoupon.class));
    }
}