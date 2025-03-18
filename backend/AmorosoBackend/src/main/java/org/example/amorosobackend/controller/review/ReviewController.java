package org.example.amorosobackend.controller.review;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.example.amorosobackend.dto.ReviewDTO;
import org.example.amorosobackend.service.ReviewService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
@Tag(name = "리뷰 관련 API")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    @Operation(description = "리뷰 생성 API")
    public ReviewDTO.Response createReview(@RequestBody ReviewDTO.CreateRequest request) {
        return reviewService.createReview(request);
    }

    @GetMapping("/product/{productId}")
    @Operation(description = "상품에 대한 리뷰 조회 API")
    public Page<ReviewDTO.Response> getReviewsByProduct(@PathVariable Long productId, Pageable pageable) {
        return reviewService.getReviewsByProduct(productId, pageable);
    }

    @GetMapping("/my")
    @Operation(description = "내가 생성한 리뷰 조회 API")
    public List<ReviewDTO.Response> getUserReviews() {
        return reviewService.getReviewsByUser();
    }

    @PutMapping("/{reviewId}")
    @Operation(description = "리뷰 수정")
    public ReviewDTO.Response updateReview(@PathVariable Long reviewId, @RequestBody ReviewDTO.UpdateRequest request) {
        return reviewService.updateReview(reviewId, request);
    }

    @DeleteMapping("/{reviewId}")
    @Operation(description = "리뷰 삭제")
    public void deleteReview(@PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId);
    }



}