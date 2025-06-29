package org.example.amorosobackend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;


import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.example.amorosobackend.dto.*;
import org.example.amorosobackend.service.BusinessValidationService;
import org.example.amorosobackend.service.EcommerceValidationService;
import org.example.amorosobackend.service.SellerService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/sellers")
@RequiredArgsConstructor
@Tag(name = "Seller", description = "Seller related APIs")
public class SellerController {

    private final SellerService sellerService;
    private final BusinessValidationService businessValidationService;
    private final EcommerceValidationService ecommerceValidationService;

    @GetMapping("/total-sales")
    public SellerDTO.TotalSaleResponse getSellerTotalSales(@RequestParam int year,
                                                           @RequestParam int month) {
        return sellerService.getTotalSales(year, month);
    }

    @GetMapping("/total-orders")
    @Operation(description = "Seller가 등록한 제품에 대한 주문 수" +
            "year = 주문등록 년도" +
            "month = 주문등록 월" +
            "month가 null일시 연간 주문수로 변경")
    public SellerDTO.TotalOrderResponse getSellerTotalOrders(@RequestParam int year,
                                                             @RequestParam(required = false) Integer month) {
        return sellerService.getTotalOrders(year, month);
    }

    @GetMapping("/total-products")
    @Operation(description = "Seller가 등록한 제품 수")
    public SellerDTO.TotalProductResponse getSellerTotalProducts() {
        return sellerService.getTotalProducts();
    }

    @GetMapping("/monthly-sales")
    @Operation(description = "한 해 월별 매출 통계")
    public SellerDTO.MonthlySalesResponse getMonthlySales(@RequestParam int year) {
        return sellerService.getMonthlySales(year);
    }

    @GetMapping("/popular-products")
    public List<SellerDTO.PopularProductDto> getPopularProducts() {
        return sellerService.getTop5PopularProducts();
    }

    @GetMapping("/order-summary")
    public Page<SellerDTO.SellerOrderSummaryDto> getSellerOrderSummary(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        return sellerService.getSellerOrderSummaries(page, size);
    }

    @GetMapping("/stats")
    public SellerDTO.SellerStatsResponse getSellerStats() {
        return sellerService.getSellerStats();
    }

    @PostMapping("/validate-business")
    public ResponseEntity<BusinessValidationResponse> validateBusiness(@RequestBody BusinessValidationRequest request) {
        BusinessValidationResponse response = businessValidationService.validateBusiness(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/validate-ecommerce")
    @Operation(summary = "Validate e-commerce business registration",
            description = "Validates the e-commerce business registration using the Fair Trade Commission API")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Validation successful",
                    content = @Content(schema = @Schema(implementation = EcommerceValidationResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<EcommerceValidationResponse> validateEcommerceBusiness(
            @RequestBody EcommerceValidationRequest request) {
        EcommerceValidationResponse response = ecommerceValidationService.validateEcommerceBusiness(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/seller-info")
    @Operation(summary = "Get seller personal information",
            description = "Retrieve seller's personal information including business details and user information")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Seller information retrieved successfully",
            content = @Content(schema = @Schema(implementation = SellerDTO.SellerInfoResponse.class))),
        @ApiResponse(responseCode = "403", description = "Not authorized to access seller information"),
        @ApiResponse(responseCode = "404", description = "Seller not found")
    })
    public ResponseEntity<SellerDTO.SellerInfoResponse> getSellerInfo() {
        SellerDTO.SellerInfoResponse response = sellerService.getSellerInfo();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<SellerRegistrationDTO.Response> registerSeller(@RequestBody SellerRegistrationDTO.Request request) {
        // 1. 사업자등록 검증
        BusinessValidationRequest businessValidation = BusinessValidationRequest.builder()
                .businessNumber(request.getBusinessNumber())
                .companyName(request.getBrandName())
                .startDate(request.getBusinessStartDate().toString().replace("-", ""))
                .businessAddress(request.getBusinessAddress())
                .build();
        
        BusinessValidationResponse validationResponse = businessValidationService.validateBusiness(businessValidation);
        
        if (!validationResponse.isValid()) {
            throw new IllegalArgumentException("Invalid business registration: " + validationResponse.getValidationMessage());
        }

        // 2. 통신판매업 검증
        EcommerceValidationResponse ecommerceValidation = ecommerceValidationService.validateEcommerceBusiness(
                new EcommerceValidationRequest(request.getBusinessNumber(), request.getBrandName()));
        
        if (!ecommerceValidation.isValid()) {
            throw new IllegalArgumentException("Invalid e-commerce business: " + ecommerceValidation.getMessage());
        }

        // 3. 판매자 등록 진행
        SellerRegistrationDTO.Response response = sellerService.registerSeller(request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Check business registration status", 
              description = "Check the current status of a business registration number")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Status check successful",
            content = @Content(schema = @Schema(implementation = BusinessStatusResponse.class))),
        @ApiResponse(responseCode = "400", description = "Invalid request"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/business-status")
    public ResponseEntity<BusinessStatusResponse> checkBusinessStatus(
            @Parameter(description = "Business registration number", required = true)
            @RequestParam String businessNumber) {
        BusinessStatusResponse response = businessValidationService.checkBusinessStatus(businessNumber);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/orders/{orderId}/deliver")
    @Operation(summary = "Update order status to delivered",
            description = "Seller can mark an order as delivered when they complete the shipping")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Order status updated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid request"),
        @ApiResponse(responseCode = "403", description = "Not authorized to update this order"),
        @ApiResponse(responseCode = "404", description = "Order not found")
    })
    public ResponseEntity<Void> markOrderAsDelivered(
            @Parameter(description = "Order ID to mark as delivered", required = true)
            @PathVariable Long orderId) {
        sellerService.markOrderAsDelivered(orderId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/products")
    @Operation(summary = "판매자가 등록한 제품 목록 조회",
            description = "현재 로그인한 판매자가 등록한 제품 목록을 페이징하여 조회합니다.")
    public Page<SellerDTO.SellerProductDto> getSellerProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String order
    ) {
        return sellerService.getSellerProducts(page, size, sortBy, order);
    }

    @GetMapping("/orders/{orderId}")
    @Operation(summary = "판매자 주문 상세 조회",
            description = "현재 로그인한 판매자의 특정 주문 상세 정보를 조회합니다.")
    public SellerDTO.SellerOrderDetailDto getSellerOrderDetail(@PathVariable Long orderId) {
        return sellerService.getSellerOrderDetail(orderId);
    }
}
