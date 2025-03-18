package org.example.amorosobackend.controller;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.example.amorosobackend.domain.UserAddress;
import org.example.amorosobackend.dto.UserAddressDto;
import org.example.amorosobackend.service.UserAddressService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/UserAddress")
@RequiredArgsConstructor
@Tag(name = "배송지 관련 API")
public class UserAddressController {

    private final UserAddressService userAddressService;

    /**
     *  기본 배송지 조회 API
     */
    @Operation(description = "기본 배송지 조회")
    @GetMapping("/default")
    public ResponseEntity<UserAddressDto.GetAddress> getDefaultAddress() {
        UserAddressDto.GetAddress defaultAddress = userAddressService.getDefaultAddress();
        return ResponseEntity.ok(defaultAddress);
    }

    /**
     *  배송지 업데이트 API
     *  마이페이지 내부 User 정보 조회에서 진행.
     */


    /**
     * 모든 배송지 조회 API
     */
    @Operation(description = "모든 배송지 조회")
    @GetMapping
    public ResponseEntity<List<UserAddressDto.GetAddress>> getAllAddresses() {
        List<UserAddressDto.GetAddress> addresses = userAddressService.getAllAddresses();
        return ResponseEntity.ok(addresses);
    }
}
