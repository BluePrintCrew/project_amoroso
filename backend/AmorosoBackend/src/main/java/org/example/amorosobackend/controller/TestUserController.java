package org.example.amorosobackend.controller;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.example.amorosobackend.domain.Seller;
import org.example.amorosobackend.domain.User;
import org.example.amorosobackend.enums.UserRole;
import org.example.amorosobackend.repository.SellerRepository;
import org.example.amorosobackend.repository.UserRepository;
import org.example.amorosobackend.security.JwtProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/Test-User")  //
@Tag(name = "test 계정을 생성 및 JWT를 발급받기 위한 테스트용 API")
@RequiredArgsConstructor
public class TestUserController {



    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final SellerRepository sellerRepository;

    private static final String TEST_EMAIL = "test@testEmail.com";
    private static final String TEST_PASSWORD = "test1234";

    //테스트 계정을 자동 생성하고 JWT 발급
    @PostMapping("/setup/USER")
    @Operation(description = "User 등급의 계정 생성 및 토큰 발급")
    public ResponseEntity<?> setupTestUser() {
        if (!userRepository.existsByEmail(TEST_EMAIL)) {
            User testUser = User.builder()
                    .email(TEST_EMAIL)
                    .password(passwordEncoder.encode(TEST_PASSWORD))
                    .name("Test User")
                    .phoneNumber("010-1234-5678")
                    .role(UserRole.ROLE_USER.name())
                    .isActive(true)
                    .build();
            userRepository.save(testUser);
        }

        String token = jwtProvider.createToken(TEST_EMAIL, "ROLE_USER");
        return ResponseEntity.ok(Map.of("token", token));
    }

    @PostMapping("/setup/ADMIN")
    @Operation(description = "ADMIN 등급의 테스트 계정생성 및 토큰 발급")
    public ResponseEntity<?> setupTestAdmin() {
        if (!userRepository.existsByEmail(TEST_EMAIL)) {
            User testUser = User.builder()
                    .email(TEST_EMAIL)
                    .password(passwordEncoder.encode(TEST_PASSWORD))
                    .name("Test User")
                    .phoneNumber("010-1234-5678")
                    .role(UserRole.ROLE_ADMIN.name())
                    .isActive(true)
                    .build();
            userRepository.save(testUser);
        }

        String token = jwtProvider.createToken(TEST_EMAIL, "ROLE_USER");
        return ResponseEntity.ok(Map.of("token", token));
    }

    @PostMapping("/setup/SELLER")
    @Operation(description = "SELLER 등급의 테스트 계정 생성 및 토큰 발급")
    public ResponseEntity<?> setupTestSeller() {
        if (!userRepository.existsByEmail(TEST_EMAIL)) {
            // 1. User 생성 및 저장
            User testUser = User.builder()
                    .email(TEST_EMAIL)
                    .password(passwordEncoder.encode(TEST_PASSWORD))
                    .name("Test Seller")
                    .phoneNumber("010-1234-5678")
                    .role(UserRole.ROLE_SELLER.name())
                    .isActive(true)
                    .build();
            userRepository.save(testUser);

            // 2. Seller 생성 및 저장 (User와 연결)
            Seller testSeller = Seller.builder()
                    .user(testUser)
                    .brandName("Test Brand")
                    .businessRegistrationNumber(UUID.randomUUID().toString().substring(0, 12)) // 랜덤 사업자번호 생성
                    .build();
            sellerRepository.save(testSeller);
        }

        // 3. JWT 발급
        String token = jwtProvider.createToken(TEST_EMAIL, "ROLE_SELLER");
        return ResponseEntity.ok(Map.of("token", token));
    }
    // 테스트 계정 삭제 (SELLER 포함)
    @DeleteMapping("/reset")
    public ResponseEntity<?> resetTestUser() {
        userRepository.findByEmail(TEST_EMAIL).ifPresent(user -> {
            sellerRepository.findByUser(user).ifPresent(sellerRepository::delete); // Seller 삭제
            userRepository.delete(user); // User 삭제
        });
        return ResponseEntity.ok("Test user deleted");
    }
}
