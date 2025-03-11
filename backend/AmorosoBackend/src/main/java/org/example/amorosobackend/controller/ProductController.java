package org.example.amorosobackend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.example.amorosobackend.domain.category.Category;
import org.example.amorosobackend.dto.ProductDTO;
import org.example.amorosobackend.service.CategoryService;
import org.example.amorosobackend.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Tag(name = "제품 관련 API", description = "제품 상세, 제품 목록")
public class ProductController {

    // product photo 저장하는 로직, 이를 조회하는 로직 service 층에서 설계 필요, 이때 데이터베이스를 먼저 넣어서 해당 경로를 잘 쿼리를 통해
    // 넣는 과정도 필요해보인다.

    // 어떻게 사진을 압축해서 보낼지, 사진 썸네일에 대해서도 크기와, 성능을 어떻게 조절할지 잘 생각해보자.
    private final CategoryService categoryService;
    private final ProductService productService;
    /* step 1. productcontroller 작성
     controller를 통해 해당 제품의 카테고리, 페이지, 정렬 순을 입력 받은 뒤 페이징을 통해 프론트엔드에 전달한다.
    */

    @GetMapping("/")
    @Operation(description = "제품 목록 API")
    public ResponseEntity<ProductDTO.ProductListResponse> getProducts(
            @RequestParam(required = false, defaultValue = "ALL") String categoryCode,
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "createdAt") String sortBy,
            @RequestParam(required = false, defaultValue = "10") Integer size,
            @RequestParam(required = false, defaultValue = "desc") String order) {

        // Category 조회
        Category byCategoryCode = categoryService.findByCategoryCode(categoryCode);

        // Product 리스트 조회
        ProductDTO.ProductListResponse products =
                productService.getProducts(byCategoryCode.getCategoryId(), page, size, sortBy, order);

        // ResponseEntity로 반환
        return ResponseEntity.ok(products);
    }

    /**
     * 단일 상품 상세 API
     */
    @GetMapping("/{productId}")
    @Operation(summary = "제품 상세 조회", description = "productId로 특정 제품 상세 정보를 반환합니다." +
            "subImagesURL : 서브 이미지와, 서브이미지가 나와야할 순서 저장" +
            "detailDescriptionImagesURL: 제품 상세설명 이미지와, 제품 설명 이미지가 나와야할 순서 저장")
    public ResponseEntity<ProductDTO.ProductInfoDetailDTO> getProductDetail(@PathVariable Long productId) {
        ProductDTO.ProductInfoDetailDTO productDetail = productService.getProductDetail(productId);
        return ResponseEntity.ok(productDetail);
    }

    /**
     * 상품 등록 API (ADMIN, SELLER 권한)
     */
    @PostMapping("/")
    @Operation(summary = "상품 등록", description = "관리자 또는 판매자 권한만 상품을 등록할 수 있습니다.")
    public ResponseEntity<Long> createProduct(@RequestBody ProductDTO.Create dto) {
        Long productId = productService.createProduct(dto);
        return ResponseEntity.ok(productId);
    }

    /**
     * 상품 수정 API (ADMIN, SELLER 권한)
     */
    @PutMapping("/{productId}")
    @Operation(summary = "상품 수정", description = "productId에 해당하는 상품 정보를 수정합니다. 관리자 또는 판매자 권한이 필요합니다.")
    public ResponseEntity<Long> updateProduct(
            @PathVariable Long productId,
            @RequestBody ProductDTO.Update dto
    ) {
        // DTO에 productId 세팅
        dto.setProductId(productId);
        Long updatedId = productService.updateProduct(dto);
        return ResponseEntity.ok(updatedId);
    }
}





