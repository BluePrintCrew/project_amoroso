package org.example.amorosobackend.controller;

import org.example.amorosobackend.service.BusinessValidationService;
import lombok.RequiredArgsConstructor;

import org.example.amorosobackend.dto.BusinessValidationRequest;
import org.example.amorosobackend.dto.BusinessValidationResponse;
import org.example.amorosobackend.dto.BusinessStatusResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/status/{businessNumber}")
    public ResponseEntity<BusinessStatusResponse> checkBusinessStatus(@PathVariable String businessNumber) {
        BusinessStatusResponse response = businessValidationService.checkBusinessStatus(businessNumber);
        return ResponseEntity.ok(response);
    }
} 