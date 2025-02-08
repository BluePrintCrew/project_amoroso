package org.example.amorosobackend.service;

import org.example.amorosobackend.domain.Coupon;
import org.example.amorosobackend.dto.CouponDTO;
import org.example.amorosobackend.repository.CouponRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CouponService {
    private final CouponRepository couponRepository;

    public CouponService(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    @Transactional
    public CouponDTO createCoupon(CouponDTO request) {
        Coupon coupon = Coupon.builder()
                .name(request.getName())
                .discountType(request.getDiscountType())
                .discountValue(request.getDiscountValue())
                .minimumOrderAmount(request.getMinimumOrderAmount())
                .validFrom(request.getValidFrom())
                .validUntil(request.getValidUntil())
                .isActive(request.isActive())
                .build();

        couponRepository.save(coupon);
        return new CouponDTO(coupon);
    }

    public List<CouponDTO> getAllCoupons() {
        return couponRepository.findAll().stream()
                .map(CouponDTO::new)
                .collect(Collectors.toList());
    }
}