package org.example.amorosobackend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.example.amorosobackend.domain.Category;
import org.example.amorosobackend.domain.Product;
import org.example.amorosobackend.dto.ProductControllerDTO;
import org.example.amorosobackend.repository.ProductRepository;
import org.example.amorosobackend.service.CategoryService;
import org.example.amorosobackend.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<ProductControllerDTO.ProductListResponse> getProducts(
            @RequestParam(required = false) String categoryCode,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String order) {

        // Category 조회
        Category byCategoryCode = categoryService.findByCategoryCode(categoryCode);

        // Product 리스트 조회
        ProductControllerDTO.ProductListResponse products =
                productService.getProducts(byCategoryCode.getCategoryId(), page, size, sortBy, order);

        // ResponseEntity로 반환
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{productId}")
    @Operation(description = "제품 상세 API")
    public ResponseEntity<ProductControllerDTO.ProductInfoDetailDTO> getProductDetail(@PathVariable Long productId) {
        ProductControllerDTO.ProductInfoDetailDTO productDetail = productService.getProductDetail(productId);
        return ResponseEntity.ok(productDetail);
    }


    // step.2 사진 가져오는 controller 작성. 해당 페이징을 통해 사진을 어떻게 전달할지 생각해보자.

    // step.3 detail 조회. - 이때 상세 설명과 같은 사진을 어떻게 줘야할 지 잘 생각해봐야함
    // detail 로 조회할때 필요 정보들을 더 자세하게 나타내고, 해당 요청에 필요한 사진들도 잘 표현해내야한다.




}
