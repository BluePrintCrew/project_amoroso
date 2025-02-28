package org.example.amorosobackend.repository;

import org.example.amorosobackend.domain.product.Product;
import org.example.amorosobackend.domain.Review;
import org.example.amorosobackend.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProduct(Product product);

    Page<Review> findByProduct(Product product, Pageable pageable);

    // 특정 사용자의 리뷰 목록
    List<Review> findByUser(User user);

    // 특정 리뷰 조회
    Review findByReviewIdAndUser(Long reviewId, User user);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.user = :user AND r.rating IS NULL")
    int countPendingReviews(@Param("user") User user);

    boolean existsByUserAndProduct(User user, Product product);
}
