package org.example.amorosobackend.controller;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.example.amorosobackend.dto.InquiryDTO;
import org.example.amorosobackend.service.InquiryService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/inquiries")
@RequiredArgsConstructor
public class InquiryController {

    private final InquiryService inquiryService;

    @Operation(summary = "상품 문의 등록", description = "사용자가 상품에 대한 문의를 작성")
    @PostMapping
    public ResponseEntity<Void> createInquiry(@RequestBody InquiryDTO.InquiryRequestDto dto) {
        try {
            String userEmail = getCurrentUserEmail();
            inquiryService.createInquiry(dto, userEmail);
            return ResponseEntity.status(HttpStatus.CREATED).build(); // 201 Created
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build(); // or INTERNAL_SERVER_ERROR
        }
    }

    @Operation(summary = "나의 상품 문의 목록 조회", description = "로그인한 사용자가 작성한 상품 문의 목록을 최신순으로 조회")
    @GetMapping
    public ResponseEntity<Page<InquiryDTO.InquiryResponseDto>> getInquiries(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        String userEmail = getCurrentUserEmail();
        Page<InquiryDTO.InquiryResponseDto> result = inquiryService.getUserInquiries(userEmail,page, size);
        return ResponseEntity.ok(result); // 200 OK
    }

    @Operation(summary = "상품별 문의 목록 조회", description = "특정 상품에 등록된 문의 목록을 최신순으로 조회")
    @GetMapping("/product/{productId}")
    public ResponseEntity<Page<InquiryDTO.InquiryResponseDto>> getInquiriesByProduct(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        Page<InquiryDTO.InquiryResponseDto> result = inquiryService.getInquiriesByProduct(productId, page, size);
        return ResponseEntity.ok(result); // 200 OK
    }

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName(); // 예: 이메일 (username)
    }
}
