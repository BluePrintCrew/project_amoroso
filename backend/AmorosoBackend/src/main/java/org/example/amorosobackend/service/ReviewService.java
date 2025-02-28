package org.example.amorosobackend.service;

import lombok.RequiredArgsConstructor;
import org.example.amorosobackend.domain.Review;
import org.example.amorosobackend.domain.product.Product;
import org.example.amorosobackend.domain.User;
import org.example.amorosobackend.dto.ReviewDTO;
import org.example.amorosobackend.repository.OrderRepository;
import org.example.amorosobackend.repository.ReviewRepository;
import org.example.amorosobackend.repository.product.ProductRepository;
import org.example.amorosobackend.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    //
    public ReviewDTO.Response createReview(ReviewDTO.CreateRequest request) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다."));

        Review review = Review.builder()
                .user(user)
                .product(product)
                .rating(request.getRating())
                .content(request.getContent())
                .build();

        reviewRepository.save(review);
        return toResponseDTO(review);
    }

    // 특정 상품의 리뷰 목록 조회 (페이징 지원)
    public Page<ReviewDTO.Response> getReviewsByProduct(Long productId, Pageable pageable) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다."));

        return reviewRepository.findByProduct(product, pageable).map(this::toResponseDTO);
    }

    // 특정 사용자의 모든 리뷰 조회
    public List<ReviewDTO.Response> getReviewsByUser() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        return reviewRepository.findByUser(user).stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    // 리뷰 수정
    public ReviewDTO.Response updateReview(Long reviewId, ReviewDTO.UpdateRequest request) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Review review = reviewRepository.findByReviewIdAndUser(reviewId, user);
        if (review == null) {
            throw new IllegalArgumentException("해당 리뷰를 수정할 권한이 없습니다.");
        }

        review.updateReview(request.getRating(), request.getContent());
        return toResponseDTO(review);
    }

    // 리뷰 삭제
    public void deleteReview(Long reviewId) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Review review = reviewRepository.findByReviewIdAndUser(reviewId, user);
        if (review == null) {
            throw new IllegalArgumentException("해당 리뷰를 삭제할 권한이 없습니다.");
        }

        reviewRepository.delete(review);
    }


    private ReviewDTO.Response toResponseDTO(Review review) {
        return new ReviewDTO.Response(
                review.getReviewId(),
                review.getUser().getName(),
                review.getRating(),
                review.getContent(),
                review.getReviewImages().stream().map(img -> img.getImageUrl()).collect(Collectors.toList()),
                review.getCreatedAt()
        );
    }

}