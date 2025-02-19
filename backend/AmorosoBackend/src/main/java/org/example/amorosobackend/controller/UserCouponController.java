package org.example.amorosobackend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.example.amorosobackend.dto.UserCouponDTO;
import org.example.amorosobackend.service.UserCouponService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user-coupons")
@Tag(name = "쿠폰 발급(사용자 실사용) API" , description = "사용자에게 쿠폰을 발급한다.")
public class UserCouponController {
    private final UserCouponService userCouponService;

    public UserCouponController(UserCouponService userCouponService) {
        this.userCouponService = userCouponService;
    }

    @PostMapping("/{userId}/{couponId}") //
    public ResponseEntity<UserCouponDTO> issueCoupon(@PathVariable Long userId, @PathVariable Long couponId) {
        return ResponseEntity.ok(userCouponService.issueCouponToUser(userId, couponId));
    }

    @PutMapping("/{userCouponId}")
    public ResponseEntity<Void> useCoupon(@PathVariable Long userCouponId) {
        userCouponService.useCoupon(userCouponId);
        return ResponseEntity.noContent().build();
    }
}