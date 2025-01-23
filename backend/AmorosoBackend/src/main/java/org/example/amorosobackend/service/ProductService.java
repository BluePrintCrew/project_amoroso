package org.example.amorosobackend.service;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.example.amorosobackend.controller.ProductController;
import org.example.amorosobackend.domain.Product;
import org.example.amorosobackend.dto.ProductControllerDTO;
import org.example.amorosobackend.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
@AllArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

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
                .map(ProductControllerDTO::toProductInfoDTO);

        // 받은 DTO ProductListResponse로 변환
        ProductControllerDTO.ProductListResponse response = new ProductControllerDTO.ProductListResponse(
                null, // productId can be null for list response
                productInfoDTOs.getTotalPages(),
                (int) productInfoDTOs.getTotalElements(),
                productInfoDTOs.getContent() // directly gets the list of DTOs
        );

        return response;
    }
}
