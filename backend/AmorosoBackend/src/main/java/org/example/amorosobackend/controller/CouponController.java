package org.example.amorosobackend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.example.amorosobackend.dto.CouponDTO;
import org.example.amorosobackend.service.CouponService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/coupons")
@Tag(name = "쿠폰 등록(형식) API" , description = "쿠폰 양식 CRUD (실사용 X)" )
public class CouponController {
    private final CouponService couponService;

    public CouponController(CouponService couponService) {
        this.couponService = couponService;
    }

    @PostMapping
    @Operation(description = "쿠폰 형식 등록")
    public ResponseEntity<CouponDTO> createCoupon(@RequestBody CouponDTO request) {
        return ResponseEntity.ok(couponService.createCoupon(request));
    }

    @GetMapping
    @Operation(description = "쿠폰 형식 조회")
    public ResponseEntity<List<CouponDTO>> getAllCoupons() {
        return ResponseEntity.ok(couponService.getAllCoupons());
    }
}