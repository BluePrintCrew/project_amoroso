package org.example.amorosobackend.service;

import lombok.extern.slf4j.Slf4j;
import org.example.amorosobackend.domain.product.Product;
import org.example.amorosobackend.domain.product.ProductImage;
import org.example.amorosobackend.dto.ImageControllerDTO;
import org.example.amorosobackend.enums.ImageType;
import org.example.amorosobackend.repository.ProductImageRepository;
import org.example.amorosobackend.repository.product.ProductRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;


import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;


import java.io.*;
import java.nio.file.*;

@Service
@RequiredArgsConstructor
@Slf4j // (수정) 로그 사용
public class ImageService {

    @Value("${app.image-directory}")
    private String IMAGE_DIRECTORY;

    private final ProductImageRepository productImageRepository;
    private final ProductRepository productRepository;

    public Resource loadImage(String filename) throws IOException {
        // (수정) 로그 추가
        log.debug("[loadImage] Loading file: {}", filename);

        Path imagePath = Paths.get(IMAGE_DIRECTORY).resolve(filename).normalize();
        Resource resource = new UrlResource(imagePath.toUri());

        if(!resource.exists()) {
            log.warn("[loadImage] File not found: {}", filename);
            throw new FileNotFoundException("이미지를 찾을 수 없습니다: " + filename);
        }
        return resource;
    }

    public ImageControllerDTO.ImageResponseDTO saveImage(MultipartFile image, ImageControllerDTO.ImageRequestDTO requestDTO) throws IOException {
        // (수정) 로그 추가
        log.debug("[saveImage] Saving image for productId={}, isMainImage={}",
                requestDTO.getProductId(),
                requestDTO.getImageType()
        );

        // 1) 파일 시스템에 저장
        String imageUri = saveImageToFileSystem(image);

        // 2) Product 가져오기
        Product product = productRepository.findByProductId(requestDTO.getProductId())
                .orElseThrow(() -> {
                    log.error("[saveImage] Product not found: {}", requestDTO.getProductId());
                    return new NullPointerException("there is no Product with id: " + requestDTO.getProductId());
                });

        // 3) 메인 이미지 설정 (isMainImage==true)
        if(ImageType.valueOf(requestDTO.getImageType())==ImageType.MAIN ) {
            // (수정) 메인 이미지 설정 로직
            log.debug("[saveImage] Setting main image to productId={}", product.getProductId());
            product.setMainImageUri(imageUri);
        }

        // 4) DB에 ProductImage 엔티티 저장
        ProductImage productImage = ProductImage.builder()
                .imageUrl(imageUri)
                .product(product)
                .imageOrder(requestDTO.getImageOrder())
                .imageType(ImageType.valueOf(requestDTO.getImageType()))
                .build();
        productImageRepository.save(productImage);

        // (수정) 로그: DB 저장 완료
        log.debug("[saveImage] Image saved to DB. productImageId={}, imageUrl={}",
                productImage.getProductImageId(), imageUri);

        return new ImageControllerDTO.ImageResponseDTO(
                imageUri,
                requestDTO.getProductId(),
                requestDTO.getImageType(),
                requestDTO.getImageOrder()
        );
    }

    private String saveImageToFileSystem(MultipartFile file) throws IOException {
        // (수정) 로그 추가
        log.debug("[saveImageToFileSystem] Original filename: {}", file.getOriginalFilename());

        String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path imagePath = Paths.get(IMAGE_DIRECTORY).resolve(filename).normalize();

        // (수정) 로그: 실제 저장 경로
        log.debug("[saveImageToFileSystem] Resolved path: {}", imagePath);

        Files.copy(file.getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);

        // (수정) 로그: 저장 완료
        log.debug("[saveImageToFileSystem] File saved. filename={}", filename);

        // 리턴은 URL (API 요청 시 접근 경로)
        return "/images/" + filename;
    }
}
