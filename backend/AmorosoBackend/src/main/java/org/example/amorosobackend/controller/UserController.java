package org.example.amorosobackend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.example.amorosobackend.dto.*;
import org.example.amorosobackend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.example.amorosobackend.dto.UserControllerDTO.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Login 관련 API", description = "소셜로그인 제외, 소셜로그인은 노션에 올렸던 것 대로 진행")
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    @Operation(description = "소셜로그인 아님 - 추후 필요 시 적용")
    public ResponseEntity<ApiResponse> registerUser(@RequestBody UserRegistrationRequest request) {
        userService.registerUser(request);
        return ResponseEntity.status(201).body(new ApiResponse("User registered successfully"));
    }

    @PostMapping("/login")
    @Operation(description = "소셜 로그인 아님 - 추후 필요시 적용")
    public ResponseEntity<LoginResponse> loginUser(@RequestBody LoginRequest request) {
        LoginResponse response = userService.loginUser(request);
        return ResponseEntity.ok(response);
    }



//    @PostMapping("/oauth2/{provider}")
//    public ResponseEntity<OAuth2LoginResponse> socialLogin(@PathVariable String provider, @RequestBody OAuth2LoginRequest request) {
//        OAuth2LoginResponse response = userService.socialLogin(provider, request);
//        return ResponseEntity.ok(response);
//    }

    @Operation(description = "유저 프로필 조회")
    @GetMapping("/users/me")
    public ResponseEntity<UserProfileResponse> getCurrentUser() {
        UserProfileResponse response = userService.getCurrentUserProfile();
        return ResponseEntity.ok(response);
    }


    @Operation(description = "유저 프로필 업데이트")
    @PutMapping("/users/me")
    public ResponseEntity<ApiResponse> updateUserProfile(@RequestBody UserUpdateRequest request) {
        userService.updateUserProfile(request);
        ApiResponse profileUpdatedSuccessfully = new ApiResponse("Profile updated successfully");
        return ResponseEntity.ok(profileUpdatedSuccessfully);
    }


    @Operation(description = "유저 정보 삭제")
    @DeleteMapping("/users/me")
    public ResponseEntity<UserControllerDTO.ApiResponse> deleteUserAccount() {
        userService.deleteCurrentUser();
        return ResponseEntity.ok(new UserControllerDTO.ApiResponse("Account deleted successfully"));
    }
}