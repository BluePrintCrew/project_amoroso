package org.example.amorosobackend.controller;

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
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ReviewDTO.Response createReview(@RequestBody ReviewDTO.CreateRequest request) {
        return reviewService.createReview(request);
    }

    @GetMapping("/product/{productId}")
    public Page<ReviewDTO.Response> getReviewsByProduct(@PathVariable Long productId, Pageable pageable) {
        return reviewService.getReviewsByProduct(productId, pageable);
    }

    @GetMapping("/my")
    public List<ReviewDTO.Response> getUserReviews() {
        return reviewService.getReviewsByUser();
    }

    @PutMapping("/{reviewId}")
    public ReviewDTO.Response updateReview(@PathVariable Long reviewId, @RequestBody ReviewDTO.UpdateRequest request) {
        return reviewService.updateReview(reviewId, request);
    }

    @DeleteMapping("/{reviewId}")
    public void deleteReview(@PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId);
    }
}