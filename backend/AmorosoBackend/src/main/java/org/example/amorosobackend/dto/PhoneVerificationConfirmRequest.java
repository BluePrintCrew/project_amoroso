package org.example.amorosobackend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PhoneVerificationConfirmRequest {
    private String phoneNumber;
    private String verificationCode;
} 