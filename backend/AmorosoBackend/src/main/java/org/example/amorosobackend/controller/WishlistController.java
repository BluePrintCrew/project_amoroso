package org.example.amorosobackend.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.example.amorosobackend.service.WishlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/wishlist")
@RequiredArgsConstructor
@Tag(name = "찜(wishlist)관련 API" , description = "제품목록에서 하트 또는 별표시를 눌렀을때, 찜해놓기 위한 로직")
public class WishlistController {

    private final WishlistService wishlistService;

    // 위시리스트 제품 추가
    @PostMapping("/add/{productId}")
    public ResponseEntity<String> addToWishlist(@PathVariable Long productId) {
        wishlistService.addToWishlist(productId);
        return ResponseEntity.ok("Product added to wishlist");
    }

    // 위시리스트 제품 삭제
    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<String> removeFromWishlist(@PathVariable Long productId) {
        wishlistService.removeFromWishlist(productId);
        return ResponseEntity.ok("Product removed from wishlist");
    }

    // 사용자의 위시리스트 가져오기
    @GetMapping
    public ResponseEntity<List<Long>> getWishlist() {
        return ResponseEntity.ok(wishlistService.getWishlist());
    }
}