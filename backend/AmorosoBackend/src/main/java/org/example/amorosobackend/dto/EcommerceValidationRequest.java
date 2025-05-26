package org.example.amorosobackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EcommerceValidationRequest {
    private String businessNumber;  // 사업자등록번호
    private String brandName;      // 상호명
} 