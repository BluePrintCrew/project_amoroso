package org.example.amorosobackend.service;

import org.example.amorosobackend.domain.product.Product;
import org.example.amorosobackend.domain.ProductImage;
import org.example.amorosobackend.dto.ImageControllerDTO;
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
public class ImageService {

    @Value("${app.image-directory}")
    private String IMAGE_DIRECTORY;
    private final ProductImageRepository productImageRepository;
    private final ProductRepository productRepository;

    public Resource loadImage(String filename) throws IOException {
        //  image에 대한 주소를 만드는 역할 - 파싱된 것을 붙이는 과정
        // normalize() 는 ../ 와 같은 주소를 삭제해준다
        Path imagePath = Paths.get(IMAGE_DIRECTORY).resolve(filename).normalize();
        // 원본 이미지 로드
        Resource resouce = new UrlResource(imagePath.toUri());

        if(!resouce.exists()) {
            throw new FileNotFoundException("이미지를 찾을 수 없습니다 " + filename);
        }

        return resouce;
    }

    public ImageControllerDTO.ImageResponseDTO saveImage(MultipartFile image, ImageControllerDTO.ImageRequestDTO requestDTO) throws IOException {
        // 파일 저장
        String imageUri = saveImageToFileSystem(image);
        Product byProductId = productRepository.findByProductId(requestDTO.getProductId())
                .orElseThrow(() -> new NullPointerException("there is no Product with id: " + requestDTO.getProductId()));

        if(requestDTO.getIsMainImage()){
           byProductId.setMainImageUri(imageUri);
        }

        ProductImage productImage = ProductImage.builder()
                .imageUrl(imageUri)
                .product(byProductId)
                .build();

        productImageRepository.save(productImage);



        //대표 이미지 여부에 따라 응답 반환
        return new ImageControllerDTO.ImageResponseDTO(imageUri, requestDTO.getIsMainImage(),requestDTO.getProductId());
    }

    private String saveImageToFileSystem(MultipartFile file) throws IOException {
        String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path imagePath = Paths.get(IMAGE_DIRECTORY).resolve(filename).normalize();
        Files.copy(file.getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);
        return "/images/" + filename;
    }

//    public Resource loadOptimizedImage(String filename) throws IOException {
//        // 이미지 파일 경로 생성
//        Path imagePath = Paths.get(IMAGE_DIRECTORY).resolve(filename).normalize();
//
//        // 원본 이미지 로드
//        BufferedImage originalImage = ImageIO.read(imagePath.toFile());
//        // 출력 스트림 생성 (리사이징된 이미지 데이터를 저장할 공간)
//        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
//
//        // 이미지 리사이징 (가로 300px로 조정) , 세로 비율 유지
//        int targetWidth = 300;
//        int targetHeight = (originalImage.getHeight() * targetWidth) / originalImage.getWidth();
//
//        // 새로운 버퍼 이미지 객체 생성 (리사이징된 이미지 저장)
//        BufferedImage resizedImage = new BufferedImage(targetWidth, targetHeight, BufferedImage.TYPE_INT_RGB);
//
//        //
//        Graphics2D g = resizedImage.createGraphics();
//        g.drawImage(originalImage,0,0,targetWidth,targetHeight,null);
//        g.dispose();
//
//
//    }
}
