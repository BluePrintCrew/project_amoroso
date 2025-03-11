package org.example.amorosobackend.controller;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
@Slf4j // (수정) 로그 사용
public class ImageController {

    private final ImageService imageService;

    @GetMapping("/{filename}")
    @Operation(description = "단순 이미지 조회, 이미지 조회시 비동기식으로 요청")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) throws IOException {
        // (수정) 로그 추가
        log.debug("[getImage] Requested filename: {}", filename);

        Resource image = imageService.loadImage(filename);
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(image);
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(description = "이미지 등록(비동기). 'metadata' 형식 예:\n" +
            "  {\n" +
            "    \"productId\": 123,\n" +
            "    \"ImageType\": MAIN or DETAIL OR SUB\n" +
            "    \"ImageOrder\": if Type is SUB or DETAIL, it has Sequence \n "      +
            "  }")
    public ResponseEntity<ImageControllerDTO.ImageResponseDTO> uploadSingleImage(
            @RequestPart("image") MultipartFile image,
            @RequestPart("metadata") ImageControllerDTO.ImageRequestDTO requestDTO
    ) throws IOException {

        // (수정) 로그 추가
        log.debug("[uploadSingleImage] Start uploading image: {}, size: {} bytes, productId: {}, " +
                        "ImageType: {}, imageOrder: {} ",
                image.getOriginalFilename(),
                image.getSize(),
                requestDTO.getProductId(),
                requestDTO.getImageType(),
                requestDTO.getImageOrder()
        );

        ImageControllerDTO.ImageResponseDTO response = imageService.saveImage(image, requestDTO);

        // (수정) 업로드 완료 로그
        log.debug("[uploadSingleImage] Upload finished. imageUri={}, productId={}," +
                        " isMainImage={}, ImageOrder= {}",
                response.getImageUri(),
                response.getProductId(),
                response.getImageType(),
                response.getImageOrder()
        );

        return ResponseEntity.ok(response);
    }
}