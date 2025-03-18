package org.example.amorosobackend.repository;




import org.example.amorosobackend.domain.review.ReviewImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewImageRepository extends JpaRepository<ReviewImage, Long> {

    /**
     * 특정 리뷰 ID에 해당하는 모든 이미지 조회
     */
    List<ReviewImage> findByReview_ReviewId(Long reviewId);
}
