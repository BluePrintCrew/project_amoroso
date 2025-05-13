package org.example.amorosobackend.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class BusinessValidationRequest {
    private String businessNumber;  // 사업자 등록번호
    private String startDate;       // 시작 하는 일시
    private String ownerName;       // 사업자 이름
    private String companyName;     // 회사 이름
    private String businessAddress; // 회사 주소
} 