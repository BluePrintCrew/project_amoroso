package org.example.amorosobackend.controller;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.example.amorosobackend.dto.ImageControllerDTO;
import org.example.amorosobackend.service.ImageService;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/images")
@RequiredArgsConstructor
@Tag(name = "이미지 조회 API",description = "uri를 통한 이미지 조회")
public class ImageController {

    private final ImageService imageService;

    @GetMapping("/{filename}")
    @Operation(description = "단순 이미지 조회, 이미지 조회시 비동기식으로 요청")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) throws IOException {
        Resource image = imageService.loadImage(filename);
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG) // 기본적으로 JPEG으로 설정
                .body(image);
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(description = "이미지 등록 이미지 등록 시 비동기 식으로 요청")
    public ResponseEntity<ImageControllerDTO.ImageResponseDTO> uploadSingleImage(
            @RequestPart("image") MultipartFile image,
            @RequestPart("metadata") ImageControllerDTO.ImageRequestDTO requestDTO // 제품 관련한 productID가 필요함
    ) throws IOException {

        ImageControllerDTO.ImageResponseDTO response = imageService.saveImage(image, requestDTO);
        return ResponseEntity.ok(response);
    }


}
