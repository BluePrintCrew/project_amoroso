package org.example.amorosobackend.controller.review;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.amorosobackend.dto.ReviewImageDTO;
import org.example.amorosobackend.service.ReviewImageService;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/review-images")
@RequiredArgsConstructor
@Tag(name = "리뷰 이미지 API", description = "리뷰 이미지 업로드 및 조회")
@Slf4j
public class ReviewImageController {

    private final ReviewImageService reviewImageService;

    /**
     * 특정 리뷰 ID에 대한 모든 이미지 조회
     */
    @GetMapping("/{reviewId}")
    @Operation(description = "리뷰 ID를 통한 이미지 목록 조회")
    public ResponseEntity<ReviewImageDTO.ResponseList> getReviewImages(@PathVariable Long reviewId) {
        ReviewImageDTO.ResponseList images = reviewImageService.getReviewImagesByReviewId(reviewId);
        return ResponseEntity.ok(images);
    }

    /**
     * 개별 이미지 파일 조회
     */
    @GetMapping("/file/{filename}")
    @Operation(description = "이미지 파일 단건 조회")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) throws IOException {
        log.debug("[getImage] Requested filename: {}", filename);
        Resource image = reviewImageService.loadImage(filename);
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(image);
    }

    /**
     * 리뷰 이미지 업로드 API (비동기 업로드)
     */
    @PostMapping(value = "/{reviewId}/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(description = "리뷰 이미지 업로드 API")
    public ResponseEntity<ReviewImageDTO.Response> uploadReviewImage(
            @RequestPart("image") MultipartFile image,
            @RequestPart("metadata") ReviewImageDTO.Request requestDTO
    ) throws IOException {
        log.debug("[uploadReviewImage] Start uploading for reviewId: {}, ImageOrderNum: {}",
                requestDTO.getReviewImageId(), requestDTO.getReviewImageOrderNum());

        ReviewImageDTO.Response response = reviewImageService.uploadReviewImage(requestDTO.getReviewImageId(), image, requestDTO);

        log.debug("[uploadReviewImage] Upload finished. imageUrl={}, reviewId={}, imageOrderNum={}",
                response.getImageUrl(), response.getReviewId(), response.getReviewImageOrderNum());

        return ResponseEntity.ok(response);
    }
}
