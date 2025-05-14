package org.example.amorosobackend.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BusinessValidationResponse {
    private String businessNumber;     // 사업자 등록 명
    private boolean isValid;           // valid 여부
    private String validationMessage;  // valid 메세지
    private String taxationType;       // 세금 타입
    private String businessStatus;     // 사업자 상태
    private String companyName;        // 사업자 이름
    private String ownerName;          //
    private String businessAddress;    //
    private String startDate;          //
} 