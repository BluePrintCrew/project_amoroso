package org.example.amorosobackend.domain.review;


import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "review_images")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ReviewImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reviewImageId;

    @ManyToOne
    @JoinColumn(name = "review_id", nullable = false)
    private Review review;

    @Column(nullable = false, length = 255)
    private String imageUrl;
    private Integer imageOrderNum;
    private LocalDateTime createdAt;

    @Builder
    private ReviewImage(Review review, String imageUrl, Integer imageOrderNum) {
        this.review = review;
        this.imageUrl = imageUrl;
        this.imageOrderNum = imageOrderNum;
    }

    @PrePersist
    public void onPrePersist() {
        this.createdAt = LocalDateTime.now();
    }
}