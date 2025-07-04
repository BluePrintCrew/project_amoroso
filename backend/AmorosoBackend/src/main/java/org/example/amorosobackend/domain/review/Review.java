package org.example.amorosobackend.domain.review;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import org.example.amorosobackend.domain.User;
import org.example.amorosobackend.domain.product.Product;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "reviews")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reviewId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private int rating;  // 1~5

    @Lob
    private String content;

    private boolean isReported;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // 리뷰 이미지
    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReviewImage> reviewImages = new ArrayList<>();

    @Builder
    private Review(User user,
                   Product product,
                   int rating,
                   String content,
                   boolean isReported,
                    LocalDateTime createdAt) {
        this.user = user;
        this.product = product;
        this.rating = rating;
        this.content = content;
        this.isReported = isReported;
        this.createdAt = createdAt;
    }

    @PrePersist
    public void onPrePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        // 기본값 세팅
        if (!this.isReported) {
            this.isReported = false;
        }
    }

    @PreUpdate
    public void onPreUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void updateReview(int newRating, String newContent) {
        this.rating = newRating;
        this.content = newContent;
        this.updatedAt = LocalDateTime.now(); // JPA가 변경을 감지하도록 설정
    }
}