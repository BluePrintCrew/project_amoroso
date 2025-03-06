package org.example.amorosobackend.controller;

import org.example.amorosobackend.domain.category.Category;
import org.example.amorosobackend.dto.ProductDTO;
import org.example.amorosobackend.service.CategoryService;
import org.example.amorosobackend.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class ProductControllerTest {


    private MockMvc mockMvc;

    @Mock
    private ProductService productService;

    @Mock
    private CategoryService categoryService;

    @InjectMocks
    private ProductController productController;

    @BeforeEach
    void setUp(){
        //MockMvc 수동 생성 (WebMvcTest 사용 안함)
        mockMvc = MockMvcBuilders.standaloneSetup(productController).build();
    }
    @Test
    @DisplayName("제품 목록 조회 API - 성공")
    void getProducts_Success() throws Exception {
        // Given: Mock 데이터 설정
        Category category = Category.builder()
                .categoryName("의자")
                .build();
        when(categoryService.findByCategoryCode("CHAIR")).thenReturn(category);

        ProductDTO.ProductListResponse response = new ProductDTO.ProductListResponse(
                null, 1, 1, List.of(new ProductDTO.ProductInfoDTO(1L, "빈티지 의자", 10000, "CHAIR", "image_url", "2024-01-31 12:00:00"))
        );

        when(productService.getProducts(category.getCategoryId(), 1,10,"price", "asc")).thenReturn(response);

        // when & Then: API 호출 및 응답 검증
        // API 파라미터 생성하기
        mockMvc.perform(get("/api/v1/products/")
                .param("categoryCode","CHAIR")
                .param("page", "1")
                .param("size","10")
                .param("sortBy","price")
                .param("order","asc")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.totalPages").value(1))
                .andExpect(jsonPath("$.totalItems").value(1))
                .andExpect(jsonPath("$.products[0].productName").value("빈티지 의자"));

    }

    @Test
    @DisplayName("productId 입력시 제품의 상세정보 조회")
    void getProductDetail() throws Exception{
        // Given
        Long productId = 1L;
        ProductDTO.ProductInfoDetailDTO productDetail = new ProductDTO.ProductInfoDetailDTO(
                1L, "빈티지 의자", "아름다운 디자인의 빈티지 의자", 10000, 5,
                "CHAIR-001", "제조사", "대한민국", "브랜드", true,
                "브라운", "부품정보", "목재", "중형", 5000,
                "1234-5678", 8000, 12000, false, 10, 2000,
                List.of("image1.jpg", "image2.jpg"),
                List.of(new ProductDTO.ProductReviewDTO(1L, "사용자1", 5, "좋아요", "2024-01-31 12:00:00"))
        );

        when(productService.getProductDetail(productId)).thenReturn(productDetail);

        // When & Then
        // When & Then: API 호출 및 응답 검증
        mockMvc.perform(get("/api/v1/products/{productId}", 1L)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()) // HTTP 200 응답 확인
                .andExpect(jsonPath("$.productName").value("빈티지 의자"))
                .andExpect(jsonPath("$.price").value(10000))
                .andExpect(jsonPath("$.stock").value(5))
                .andExpect(jsonPath("$.reviews[0].content").value("좋아요"));

    }
}