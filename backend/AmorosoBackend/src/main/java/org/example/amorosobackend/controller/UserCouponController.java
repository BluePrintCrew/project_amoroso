package org.example.amorosobackend.controller;

import org.example.amorosobackend.dto.UserCouponDTO;
import org.example.amorosobackend.service.UserCouponService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user-coupons")
public class UserCouponController {
    private final UserCouponService userCouponService;

    public UserCouponController(UserCouponService userCouponService) {
        this.userCouponService = userCouponService;
    }

    @PostMapping("/{userId}/{couponId}")
    public ResponseEntity<UserCouponDTO> issueCoupon(@PathVariable Long userId, @PathVariable Long couponId) {
        return ResponseEntity.ok(userCouponService.issueCouponToUser(userId, couponId));
    }

    @PutMapping("/{userCouponId}")
    public ResponseEntity<Void> useCoupon(@PathVariable Long userCouponId) {
        userCouponService.useCoupon(userCouponId);
        return ResponseEntity.noContent().build();
    }
}