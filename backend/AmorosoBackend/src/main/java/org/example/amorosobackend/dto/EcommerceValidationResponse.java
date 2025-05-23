package org.example.amorosobackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EcommerceValidationResponse {
    private String registrationNumber;
    private LocalDate registrationDate;
    private String businessStatus;
    private String domain;
    private String serverLocation;
    private String salesMethod;
    private String productCategories;
    private boolean isValid;
    private String message;
} 