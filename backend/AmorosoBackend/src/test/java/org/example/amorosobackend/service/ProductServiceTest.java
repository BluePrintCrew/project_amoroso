package org.example.amorosobackend.service;

import org.example.amorosobackend.domain.category.Category;
import org.example.amorosobackend.domain.product.Product;
import org.example.amorosobackend.domain.review.Review;
import org.example.amorosobackend.domain.User;
import org.example.amorosobackend.dto.ProductDTO;
import org.example.amorosobackend.enums.CategoryCode;
import org.example.amorosobackend.enums.UserRole;
import org.example.amorosobackend.repository.product.ProductRepository;
import org.example.amorosobackend.repository.ReviewRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;


@ExtendWith(MockitoExtension.class) // Mockito 확장 사용
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ReviewRepository reviewRepository;

    @InjectMocks
    private ProductService productService; // 테스트 대상

    @Test
    @DisplayName("카테고리 ID를 기반으로 제품 목록을 정상적으로 조회한다")
    void getProducts() {
    // Given(Mock 데이터 설정)
        Long categoryId = 1L;
        Category categoryTest = Category.builder()
                .categoryName("소파")
                .categoryCode(CategoryCode.LIVING_SOFA)  // String 대신 enum 값 직접 사용
                .build();
        Pageable pageable = PageRequest.of(0, 10, Sort.by(Sort.Direction.ASC, "price"));


        List<Product> productList = List.of(
                Product.builder()
                        .category(categoryTest)
                        .productName("Table")
                        .description("Wooden Table")
                        .marketPrice(100000)
                        .stock(5)
                        .createdAt(LocalDateTime.now())
                        .build(),

                Product.builder()
                        .category(categoryTest)
                        .productName("Chair")
                        .description("Comfortable Chair")
                        .marketPrice(50000)
                        .stock(5)
                        .createdAt(LocalDateTime.now())
                        .build()
        );
        Page<Product> productPage = new PageImpl<>(productList, pageable,productList.size());

        Mockito.when(productRepository.findAllByCategory_CategoryId(categoryId,pageable)).thenReturn(productPage);

        // when
        ProductDTO.ProductListResponse response = productService.getProducts(categoryId,1,10,"price","asc");

        // Then (검증)
        assertThat(response).isNotNull();
        assertThat(response.getProducts().size()).isEqualTo(2);
        assertThat("Table").isEqualTo(response.getProducts().get(0).getProductName());


    }

    @Test
    @DisplayName("ProductID를 기반으로 제품 상세정보를 정상적으로 조회한다")
    void getProductDetail() {

        //given
        //카테고리 생성
        Category categoryTest = Category.builder()
                .categoryName("소파")
                .categoryCode(CategoryCode.LIVING_SOFA)  // String 대신 enum 값 직접 사용
                .build();

        // 유저 생성 - ProductReviewDTO 의 getUser().getName() 을 위함
        User user = User.builder()
                .name("이현제")
                .role(UserRole.USER.toString())  // role 필드 추가
                .build();

        // 제품 생성
        Long productId = 1L;
        Product productTest = Product.builder()
                .category(categoryTest)
                .productName("Table")
                .description("Wooden Table")
                .marketPrice(100000)
                .stock(5)
                .createdAt(LocalDateTime.now())
                .build();

        // 리뷰 생성
        List<Review> reviewTests = List.of(Review.builder()
                .product(productTest)
                .user(user)
                .rating(5)
                .createdAt(LocalDateTime.now())
                .build());
        //when

        Mockito.when(productRepository.findById(productId)).thenReturn(Optional.of(productTest));
        Mockito.when(reviewRepository.findByProduct(productTest)).thenReturn(reviewTests);

        // then

        ProductDTO.ProductInfoDetailDTO productDetailTest = productService.getProductDetail(productId);
        assertThat(productDetailTest).isNotNull();
        assertThat(productDetailTest.getProductName()).isEqualTo("Table");
        assertThat(productDetailTest.getDescription()).isEqualTo("Wooden Table");
        assertThat(productDetailTest.getReviews().size()).isEqualTo(1);
        assertThat(productDetailTest.getReviews().get(0).getRating()).isEqualTo(5);

    }


    @Test
    void getProductById() {
    }
}