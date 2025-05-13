package org.example.amorosobackend.controller;

import org.example.amorosobackend.service.BusinessValidationService;
import lombok.RequiredArgsConstructor;

import org.example.amorosobackend.dto.BusinessValidationRequest;
import org.example.amorosobackend.dto.BusinessValidationResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/business")
@RequiredArgsConstructor
public class BusinessValidationController {

    private final BusinessValidationService businessValidationService;

    @PostMapping("/validate")
    public ResponseEntity<BusinessValidationResponse> validateBusiness(@RequestBody BusinessValidationRequest request) {
        BusinessValidationResponse response = businessValidationService.validateBusiness(request);
        return ResponseEntity.ok(response);
    }
} 