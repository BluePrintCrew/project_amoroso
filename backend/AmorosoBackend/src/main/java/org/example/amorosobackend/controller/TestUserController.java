package org.example.amorosobackend.controller;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.example.amorosobackend.domain.User;
import org.example.amorosobackend.enums.UserRole;
import org.example.amorosobackend.repository.UserRepository;
import org.example.amorosobackend.security.JwtProvider;
import org.example.amorosobackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController("/api/v1/Test-User")
@Tag(name = "test 계정을 생성 및 JWT를 발급받기 위한 테스트용 API")
@RequiredArgsConstructor
public class TestUserController {


    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

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
                    .role(UserRole.USER.name())
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
                    .role(UserRole.ADMIN.name())
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
            User testUser = User.builder()
                    .email(TEST_EMAIL)
                    .password(passwordEncoder.encode(TEST_PASSWORD))
                    .name("Test User")
                    .phoneNumber("010-1234-5678")
                    .role(UserRole.SELLER.name())
                    .isActive(true)
                    .build();
            userRepository.save(testUser);
        }

        String token = jwtProvider.createToken(TEST_EMAIL, "ROLE_USER");
        return ResponseEntity.ok(Map.of("token", token));
    }

    // 테스트 계정 삭제 (필요할 경우)
    @DeleteMapping("/reset")
    public ResponseEntity<?> resetTestUser() {
        userRepository.findByEmail(TEST_EMAIL).ifPresent(userRepository::delete);
        return ResponseEntity.ok("Test user deleted");
    }
}
