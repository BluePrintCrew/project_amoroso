package org.example.amorosobackend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.example.amorosobackend.dto.UserCouponDTO;
import org.example.amorosobackend.service.UserCouponService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-coupons")
@Tag(name = "쿠폰 발급(사용자 실사용) API" , description = "사용자에게 쿠폰을 발급한다.")
public class UserCouponController {
    private final UserCouponService userCouponService;

    public UserCouponController(UserCouponService userCouponService) {
        this.userCouponService = userCouponService;
    }

    @PostMapping("/{CouponId}") //
    @Operation(description = "사용자에게 쿠폰 발행 UserCoupon, Coupon 이 두가지의 차이를 명확하게 인지해야한다")
    public ResponseEntity<UserCouponDTO> issueCoupon( @PathVariable Long CouponId) {
        return ResponseEntity.ok(userCouponService.issueCouponToUser(CouponId));
    }

    @GetMapping("/userCounpons")
    @Operation(description = "해당 유저가 가지고 있는 쿠폰의 목록을 조회할 수 있다")
    public ResponseEntity<List<UserCouponDTO>> getUserCoupons() {
        List<UserCouponDTO> userCoupons = userCouponService.getUserCoupons();

        return ResponseEntity.ok(userCoupons);
    }

    @PutMapping("/{userCouponId}")
    public ResponseEntity<Void> useCoupon(@PathVariable Long userCouponId) {
        userCouponService.useCoupon(userCouponId);
        return ResponseEntity.noContent().build();
    }


}