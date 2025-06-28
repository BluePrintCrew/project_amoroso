package org.example.amorosobackend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.amorosobackend.dto.WishlistDTO;
import org.example.amorosobackend.service.WishlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/wishlist")
@RequiredArgsConstructor
@Tag(name = "찜(wishlist)관련 API", description = "제품목록에서 하트 또는 별표시를 눌렀을때, 찜해놓기 위한 로직")
public class WishlistController {

    private final WishlistService wishlistService;

    @PostMapping("/add/{productId}")
    @Operation(summary = "위시리스트에 제품 추가")
    public ResponseEntity<String> addToWishlist(@PathVariable Long productId) {
        wishlistService.addToWishlist(productId);
        return ResponseEntity.ok("Product added to wishlist");
    }

    @Transactional
    @DeleteMapping("/remove/{productId}")
    @Operation(summary = "위시리스트에서 제품 삭제")
    public ResponseEntity<String> removeFromWishlist(@PathVariable Long productId) {
        wishlistService.removeFromWishlist(productId);
        return ResponseEntity.ok("Product removed from wishlist");
    }

    @GetMapping
    @Operation(summary = "사용자의 위시리스트 가져오기 (기존 방식)")
    public ResponseEntity<List<Long>> getWishlist() {
        return ResponseEntity.ok(wishlistService.getWishlist());
    }

    @GetMapping("/page")
    @Operation(summary = "페이징된 위시리스트 조회")
    public ResponseEntity<WishlistDTO.WishlistPageResponse> getWishlistWithPaging(
            @Parameter(description = "페이지 번호 (0부터 시작)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "페이지 크기") @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(wishlistService.getWishlistWithPaging(page, size));
    }
}