package org.example.amorosobackend.controller;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.example.amorosobackend.domain.Seller;
import org.example.amorosobackend.domain.User;
import org.example.amorosobackend.domain.UserAddress;
import org.example.amorosobackend.domain.category.Category;
import org.example.amorosobackend.domain.product.Product;
import org.example.amorosobackend.enums.CategoryCode;
import org.example.amorosobackend.enums.ElevatorType;
import org.example.amorosobackend.enums.UserRole;
import org.example.amorosobackend.repository.CategoryRepository;
import org.example.amorosobackend.repository.SellerRepository;
import org.example.amorosobackend.repository.UserAddressRepository;
import org.example.amorosobackend.repository.UserRepository;
import org.example.amorosobackend.repository.product.ProductRepository;
import org.example.amorosobackend.security.JwtProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/Test-User")
@Tag(name = "test 계정을 생성 및 JWT를 발급받기 위한 테스트용 API")
@RequiredArgsConstructor
public class TestUserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final SellerRepository sellerRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final UserAddressRepository userAddressRepository;

    private static final String TEST_EMAIL = "test@testEmail.com";
    private static final String TEST_PASSWORD = "test1234";

    @PostMapping("/setup/SELLER")
    @Operation(description = "SELLER 등급의 테스트 계정 생성 및 토큰 발급")
    public ResponseEntity<?> setupTestSeller() {
        // 1. User 생성
        User testUser = userRepository.findByEmail(TEST_EMAIL).orElseGet(() -> {
            User newUser = User.builder()
                    .email(TEST_EMAIL)
                    .password(passwordEncoder.encode(TEST_PASSWORD))
                    .name("Test Seller")
                    .phoneNumber("010-1234-5678")
                    .role(UserRole.ROLE_SELLER.name())
                    .isActive(true)
                    .build();
            return userRepository.save(newUser);
        });

        // 2. Seller 생성
        Seller testSeller = sellerRepository.findByUser(testUser).orElseGet(() -> {
            Seller newSeller = Seller.builder()
                    .user(testUser)
                    .brandName("Test Brand")
                    .businessRegistrationNumber(UUID.randomUUID().toString().substring(0, 12))
                    .build();
            return sellerRepository.save(newSeller);
        });

        // 5. 기본 배송지 저장 (없을 경우)
        if (testUser.getAddresses().isEmpty()) {
            UserAddress address = UserAddress.builder()
                    .user(testUser)
                    .recipientName("홍길동")
                    .phoneNumber("010-1234-5678")
                    .postalCode("12345")
                    .address("서울특별시 강남구 테헤란로 123")
                    .detailAddress("101동 1001호")
                    .isDefault(true)
                    .build();

            // 필수 배송 정보 추가
            address.setFreeLoweringService(true);
            address.setProductInstallationAgreement(true);
            address.setVehicleEntryPossible(true);
            address.setElevatorType(ElevatorType.ONE_TO_SEVEN);

            userAddressRepository.save(address);
        }

        String token = jwtProvider.createToken(TEST_EMAIL, "ROLE_SELLER");
        return ResponseEntity.ok(Map.of("access_token", token));
    }

    @PostMapping("/setup/USER")
    @Operation(description = "User 등급의 계정 생성 및 토큰 발급")
    public ResponseEntity<?> setupTestUser() {
        User testUser = userRepository.findByEmail(TEST_EMAIL).orElseGet(() -> {
            User newUser = User.builder()
                    .email(TEST_EMAIL)
                    .password(passwordEncoder.encode(TEST_PASSWORD))
                    .name("Test User")
                    .phoneNumber("010-1234-5678")
                    .role(UserRole.ROLE_USER.name())
                    .isActive(true)
                    .build();
            return userRepository.save(newUser);
        });

        // 기본 배송지 저장
        if (testUser.getAddresses().isEmpty()) {
            UserAddress address = UserAddress.builder()
                    .user(testUser)
                    .recipientName("홍길동")
                    .phoneNumber("010-1234-5678")
                    .postalCode("12345")
                    .address("서울특별시 강남구 테헤란로 123")
                    .detailAddress("101동 1001호")
                    .isDefault(true)
                    .build();

            address.setFreeLoweringService(true);
            address.setProductInstallationAgreement(true);
            address.setVehicleEntryPossible(true);
            address.setElevatorType(ElevatorType.ONE_TO_SEVEN);

            userAddressRepository.save(address);
        }

        String token = jwtProvider.createToken(TEST_EMAIL, "ROLE_USER");
        return ResponseEntity.ok(Map.of("access_token", token));
    }

    @PostMapping("/setup/ADMIN")
    @Operation(description = "ADMIN 등급의 테스트 계정생성 및 토큰 발급")
    public ResponseEntity<?> setupTestAdmin() {
        if (!userRepository.existsByEmail(TEST_EMAIL)) {
            User testUser = User.builder()
                    .email(TEST_EMAIL)
                    .password(passwordEncoder.encode(TEST_PASSWORD))
                    .name("Test Admin")
                    .phoneNumber("010-1234-5678")
                    .role(UserRole.ROLE_ADMIN.name())
                    .isActive(true)
                    .build();
            userRepository.save(testUser);
        }

        String token = jwtProvider.createToken(TEST_EMAIL, "ROLE_ADMIN");
        return ResponseEntity.ok(Map.of("access_token", token));
    }

    @DeleteMapping("/reset")
    public ResponseEntity<?> resetTestUser() {
        userRepository.findByEmail(TEST_EMAIL).ifPresent(user -> {
            sellerRepository.findByUser(user).ifPresent(sellerRepository::delete);
            userRepository.delete(user);
        });
        return ResponseEntity.ok("Test user deleted");
    }
}
