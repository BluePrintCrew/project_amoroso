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
    private String registrationNumber;    // 통신판매업 신고번호
    private LocalDate registrationDate;   // 통신판매업 신고일자
    private String businessStatus;        // 영업상태
    private String domain;               // 통신판매 사이트 도메인
    private String serverLocation;       // 서버 설치 장소
    private String salesMethod;          // 통신판매 방법
    private String productCategories;    // 취급 품목
    private boolean isValid;             // 유효한 통신판매업자 여부
    private String message;              // 검증 결과 메시지
} 