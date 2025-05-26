package org.example.amorosobackend.controller;

import lombok.RequiredArgsConstructor;
import org.example.amorosobackend.dto.PhoneVerificationConfirmRequest;
import org.example.amorosobackend.dto.PhoneVerificationRequest;
import org.example.amorosobackend.dto.PhoneVerificationResponse;
import org.example.amorosobackend.service.PhoneVerificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/phone-verification")
@RequiredArgsConstructor
public class PhoneVerificationController {
    private final PhoneVerificationService phoneVerificationService;

    @PostMapping("/send")
    public ResponseEntity<PhoneVerificationResponse> sendVerificationCode(
            @RequestBody PhoneVerificationRequest request) {
        phoneVerificationService.sendVerificationCode(request.getPhoneNumber());
        return ResponseEntity.ok(PhoneVerificationResponse.builder()
                .message("Verification code has been sent.")
                .success(true)
                .build());
    }

    @PostMapping("/verify")
    public ResponseEntity<PhoneVerificationResponse> verifyCode(
            @RequestBody PhoneVerificationConfirmRequest request) {
        boolean isValid = phoneVerificationService.verifyCode(
                request.getPhoneNumber(),
                request.getVerificationCode()
        );

        return ResponseEntity.ok(PhoneVerificationResponse.builder()
                .message(isValid ? "Verification completed successfully." : "Verification code does not match.")
                .success(isValid)
                .build());
    }
} 