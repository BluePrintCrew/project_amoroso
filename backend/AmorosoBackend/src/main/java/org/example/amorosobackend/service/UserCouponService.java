package org.example.amorosobackend.service;


import org.example.amorosobackend.domain.Coupon;
import org.example.amorosobackend.domain.User;
import org.example.amorosobackend.domain.UserCoupon;
import org.example.amorosobackend.dto.UserCouponDTO;
import org.example.amorosobackend.repository.CouponRepository;
import org.example.amorosobackend.repository.UserCouponRepository;
import org.example.amorosobackend.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
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
    /*
    사용자에게 쿠폰 발행
    추상적으로 존재하는 Coupon 객체를 먼저 선언한 뒤, 이를 발행해야한다.
     */

    @Transactional
    public UserCouponDTO issueCouponToUser(Long UserCouponId) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Coupon coupon = couponRepository.findById(UserCouponId)
                .orElseThrow(() -> new IllegalArgumentException("Coupon not found"));

        UserCoupon userCoupon = UserCoupon.builder()
                .user(user)
                .coupon(coupon)
                .isUsed(false)
                .build();

        userCouponRepository.save(userCoupon);
        return new UserCouponDTO(userCoupon);
    }

     /*
    해당 유저가 가지고 있는 쿠폰 목록 조회
     */
    public List<UserCouponDTO> getUserCoupons() {
        String userEmail = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return userCouponRepository.findAvailableCoupons(user).stream()
                .map(UserCouponDTO::new)
                .collect(Collectors.toList());
    }
    /*
    쿠폰 사용시, 처리 로직.

    이때 쿠폰 사용은 order 생성 시에만 사용되므로, OrderController에서 사용됨.
     */

    @Transactional
    public void useCoupon(Long userCouponId) {
        UserCoupon userCoupon = userCouponRepository.findById(userCouponId)
                .orElseThrow(() -> new IllegalArgumentException("UserCoupon not found"));

        if (userCoupon.isUsed()) {
            throw new IllegalStateException("Coupon has already been used.");
        }

        userCoupon.useCoupon();
        userCouponRepository.save(userCoupon);
    }


}
