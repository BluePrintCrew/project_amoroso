package org.example.amorosobackend.controller;

import lombok.RequiredArgsConstructor;
import org.example.amorosobackend.dto.SellerDTO;
import org.example.amorosobackend.service.SellerService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/seller")
@RequiredArgsConstructor
public class SellerController {

    private final SellerService sellerService;

    @GetMapping("/stats")
    public SellerDTO.SellerStatsResponse getSellerStats() {
        return sellerService.getSellerStats();
    }
}
