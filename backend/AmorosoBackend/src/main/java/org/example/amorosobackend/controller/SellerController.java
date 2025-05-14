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

    @PostMapping("/register")
    public ResponseEntity<SellerRegistrationDTO.Response> registerSeller(@RequestBody SellerRegistrationDTO.Request request) {
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
}
