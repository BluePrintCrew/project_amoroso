package org.example.amorosobackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class PhoneVerificationResponse {
    private String message;
    private boolean success;
} 