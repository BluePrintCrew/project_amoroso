package org.example.amorosobackend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.example.amorosobackend.dto.SellerDTO;
import org.example.amorosobackend.service.SellerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/seller")
@RequiredArgsConstructor
public class SellerController {

    private final SellerService sellerService;


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


    @GetMapping("/stats")
    public SellerDTO.SellerStatsResponse getSellerStats() {
        return sellerService.getSellerStats();
    }
}
