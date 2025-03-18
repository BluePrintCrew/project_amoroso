package org.example.amorosobackend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.example.amorosobackend.domain.review.Review;
import org.example.amorosobackend.domain.review.ReviewImage;
import org.example.amorosobackend.dto.ReviewImageDTO;
import org.example.amorosobackend.repository.ReviewImageRepository;
import org.example.amorosobackend.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewImageService {

    @Value("${app.review-image-directory}") // 리뷰 이미지 저장 디렉토리
    private String REVIEW_IMAGE_DIRECTORY;

    private final ReviewImageRepository reviewImageRepository;
    private final ReviewRepository reviewRepository;

    /**
     * 특정 리뷰 ID에 대한 모든 이미지 조회
     */
    public ReviewImageDTO.ResponseList getReviewImagesByReviewId(Long reviewId) {
        List<ReviewImageDTO.Response> images = reviewImageRepository.findByReview_ReviewId(reviewId)
                .stream()
                .map(img -> new ReviewImageDTO.Response(
                        img.getReviewImageId(),
                        img.getImageUrl(),
                        reviewId,
                        img.getImageOrderNum()
                ))
                .collect(Collectors.toList());

        return new ReviewImageDTO.ResponseList(images);
    }

    /**
     * 개별 리뷰 이미지 업로드 (비동기)
     */
    public ReviewImageDTO.Response uploadReviewImage(Long reviewId, MultipartFile image, ReviewImageDTO.Request requestDTO) throws IOException {
        // 1) 리뷰 존재 여부 확인
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> {
                    log.error("[uploadReviewImage] Review not found: {}", reviewId);
                    return new IllegalArgumentException("해당 리뷰가 존재하지 않습니다: " + reviewId);
                });

        // 2) 파일 시스템에 저장
        String imageUrl = saveImageToFileSystem(image);

        // 3) DB에 저장
        ReviewImage reviewImage = ReviewImage.builder()
                .review(review)
                .imageUrl(imageUrl)
                .imageOrderNum(requestDTO.getReviewImageOrderNum())
                .build();
        reviewImageRepository.save(reviewImage);

        log.debug("[uploadReviewImage] Image saved: reviewId={}, imageOrderNum={}, imageUrl={}",
                reviewId, requestDTO.getReviewImageOrderNum(), imageUrl);

        return new ReviewImageDTO.Response(
                reviewImage.getReviewImageId(),
                imageUrl,
                reviewId,
                reviewImage.getImageOrderNum()
        );
    }

    /**
     * 개별 이미지 파일 조회
     */
    public Resource loadImage(String filename) throws IOException {
        Path imagePath = Paths.get(REVIEW_IMAGE_DIRECTORY).resolve(filename).normalize();
        Resource resource = new UrlResource(imagePath.toUri());

        if (!resource.exists()) {
            log.warn("[loadImage] File not found: {}", filename);
            throw new FileNotFoundException("이미지를 찾을 수 없습니다: " + filename);
        }

        return resource;
    }

    /**
     * 이미지 파일을 저장하고 URL 반환
     */
    private String saveImageToFileSystem(MultipartFile file) throws IOException {
        String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path imagePath = Paths.get(REVIEW_IMAGE_DIRECTORY).resolve(filename).normalize();

        log.debug("[saveImageToFileSystem] Saving file: {}", filename);
        Files.copy(file.getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);

        return "/review-images/" + filename;
    }
}
