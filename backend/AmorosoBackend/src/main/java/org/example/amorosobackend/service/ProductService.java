package org.example.amorosobackend.service;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.example.amorosobackend.controller.ProductController;
import org.example.amorosobackend.domain.*;
import org.example.amorosobackend.dto.ProductControllerDTO;
import org.example.amorosobackend.repository.ProductRepository;
import org.example.amorosobackend.repository.ReviewRepository;
import org.example.amorosobackend.repository.SellerRepository;
import org.example.amorosobackend.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@AllArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final SellerRepository sellerRepository;

    // direction static 클래스 : Sort.Direction 클래스는 "asc" 또는 "desc" 문자열을 자동으로 파싱하는 메서드를 제공합니다.
    //IllegalArgumentException은 fromString 메서드 내부에서 자동으로 발생합니다.
    public ProductControllerDTO.ProductListResponse getProducts(Long categoryId, int page, int size, String sortBy, String order) {
        // 정렬 방향 정의 및 기본값 처리
        Sort.Direction direction = Sort.Direction.fromString(order);

        // Sort 객체 생성
        Sort sort = Sort.by(direction, sortBy);

        // Pageable 객체 생성 및 Repository 호출
        Pageable pageable = PageRequest.of(page - 1, size, sort);

        // Repository 호출 (categoryId 조건에 따라 분기)
        Page<Product> productList = categoryId != null
                ? productRepository.findAllByCategory_CategoryId(categoryId, pageable)
                : productRepository.findAll(pageable);

        // 페이지로 받은 것들 DTO 페이지로 변환
        Page<ProductControllerDTO.ProductInfoDTO> productInfoDTOs = productList
                .map(ProductService::toProductInfoDTO);

        // 받은 DTO ProductListResponse로 변환
        ProductControllerDTO.ProductListResponse response = new ProductControllerDTO.ProductListResponse(
                null, // productId can be null for list response
                productInfoDTOs.getTotalPages(),
                (int) productInfoDTOs.getTotalElements(),
                productInfoDTOs.getContent() // directly gets the list of DTOs
        );

        return response;
    }

    public ProductControllerDTO.ProductInfoDetailDTO getProductDetail(Long productId) {
        // Product와 Review를 조회
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        List<Review> reviews = reviewRepository.findByProduct(product);

        // DTO로 변환
        return toProductInfoDetailDTO(product, reviews);
    }

    public Product getProductById(Long productId){
        return productRepository.findByProductId(productId)
                .orElseThrow(() -> new NullPointerException("Invaild productId"));
    }

    private ProductControllerDTO.ProductInfoDetailDTO toProductInfoDetailDTO(Product product, List<Review> reviews) {
        List<String> imagesURL = product.getProductImages().stream()
                .map(ProductImage::getImageUrl)
                .collect(Collectors.toList());

        List<ProductControllerDTO.ProductReviewDTO> reviewDTOs = reviews.stream()
                .map(review -> new ProductControllerDTO.ProductReviewDTO(
                        review.getReviewId(),
                        review.getUser().getName(),
                        review.getRating(),
                        review.getContent(),
                        dateToString(review.getCreatedAt())
                ))
                .collect(Collectors.toList());

        return new ProductControllerDTO.ProductInfoDetailDTO(
                product.getProductId(),
                product.getProductName(),
                product.getDescription(),
                product.getPrice(),
                product.getStock(),
                imagesURL,
                reviewDTOs
        );
    }

    public static ProductControllerDTO.ProductInfoDTO toProductInfoDTO(Product product) {
        // DateTimeFormatter 정의 (원하는 포맷으로 설정)
        String formattedCreatedAt = dateToString(product.getCreatedAt());

        return new ProductControllerDTO.ProductInfoDTO(
                product.getProductId(),
                product.getProductName(),
                product.getPrice(),
                product.getCategory().getCategoryCode(),
                product.getPrimaryImage() != null ? product.getPrimaryImage().getImageUrl() : null,
                formattedCreatedAt // 변환된 문자열 값
        );
    }

    public static String dateToString(LocalDateTime dateTime){
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        // createdAt을 문자열로 변환
        return dateTime.format(formatter);

    }

    public List<Product> getSellerProducts(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("User not found"));
        Seller seller = sellerRepository.findByUser(user).orElseThrow(() -> new IllegalArgumentException("Seller not found"));

        return productRepository.findBySeller(seller);
    }

}
