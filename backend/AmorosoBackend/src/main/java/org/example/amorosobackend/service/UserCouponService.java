package org.example.amorosobackend.service;


import org.example.amorosobackend.domain.Coupon;
import org.example.amorosobackend.domain.User;
import org.example.amorosobackend.domain.UserCoupon;
import org.example.amorosobackend.dto.UserCouponDTO;
import org.example.amorosobackend.repository.CouponRepository;
import org.example.amorosobackend.repository.UserCouponRepository;
import org.example.amorosobackend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserCouponService {
    private final UserCouponRepository userCouponRepository;
    private final UserRepository userRepository;
    private final CouponRepository couponRepository;

    public UserCouponService(UserCouponRepository userCouponRepository, UserRepository userRepository, CouponRepository couponRepository) {
        this.userCouponRepository = userCouponRepository;
        this.userRepository = userRepository;
        this.couponRepository = couponRepository;
    }

    @Transactional
    public UserCouponDTO issueCouponToUser(Long userId, Long couponId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new IllegalArgumentException("Coupon not found"));

        UserCoupon userCoupon = UserCoupon.builder()
                .user(user)
                .coupon(coupon)
                .isAvailable(true)
                .build();

        userCouponRepository.save(userCoupon);
        return new UserCouponDTO(userCoupon);
    }

    public List<UserCouponDTO> getUserCoupons(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return userCouponRepository.findByUser(user).stream()
                .map(UserCouponDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public void useCoupon(Long userCouponId) {
        UserCoupon userCoupon = userCouponRepository.findById(userCouponId)
                .orElseThrow(() -> new IllegalArgumentException("UserCoupon not found"));

        if (userCoupon.isAvailable()) {
            throw new IllegalStateException("Coupon has already been used.");
        }

        userCoupon.useCoupon();
        userCouponRepository.save(userCoupon);
    }
}
