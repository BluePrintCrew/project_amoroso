package org.example.amorosobackend.controller;

import lombok.RequiredArgsConstructor;
import org.example.amorosobackend.dto.*;
import org.example.amorosobackend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.example.amorosobackend.dto.UserControllerDTO.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> registerUser(@RequestBody UserRegistrationRequest request) {
        userService.registerUser(request);
        return ResponseEntity.status(201).body(new ApiResponse("User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginUser(@RequestBody LoginRequest request) {
        LoginResponse response = userService.loginUser(request);
        return ResponseEntity.ok(response);
    }



//    @PostMapping("/oauth2/{provider}")
//    public ResponseEntity<OAuth2LoginResponse> socialLogin(@PathVariable String provider, @RequestBody OAuth2LoginRequest request) {
//        OAuth2LoginResponse response = userService.socialLogin(provider, request);
//        return ResponseEntity.ok(response);
//    }

    @GetMapping("/users/me")
    public ResponseEntity<UserProfileResponse> getCurrentUser() {
        UserProfileResponse response = userService.getCurrentUserProfile();
        return ResponseEntity.ok(response);
    }


    @PutMapping("/users/me")
    public ResponseEntity<ApiResponse> updateUserProfile(@RequestBody UserUpdateRequest request) {
        userService.updateUserProfile(request);
        ApiResponse profileUpdatedSuccessfully = new ApiResponse("Profile updated successfully");
        return ResponseEntity.ok(profileUpdatedSuccessfully);
    }

    @DeleteMapping("/users/me")
    public ResponseEntity<UserControllerDTO.ApiResponse> deleteUserAccount() {
        userService.deleteCurrentUser();
        return ResponseEntity.ok(new UserControllerDTO.ApiResponse("Account deleted successfully"));
    }
}