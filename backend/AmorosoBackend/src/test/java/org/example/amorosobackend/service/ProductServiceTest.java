package org.example.amorosobackend.service;

import org.example.amorosobackend.domain.*;
import org.example.amorosobackend.domain.category.Category;
import org.example.amorosobackend.domain.product.*;
import org.example.amorosobackend.domain.review.Review;
import org.example.amorosobackend.dto.ProductDTO;
import org.example.amorosobackend.enums.ImageType;
import org.example.amorosobackend.repository.ReviewRepository;
import org.example.amorosobackend.repository.UserRepository;
import org.example.amorosobackend.repository.product.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.springframework.data.domain.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
public class ProductServiceTest {

    @InjectMocks
    private ProductService productService;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private UserRepository userRepository;

    @Captor
    private ArgumentCaptor<Pageable> pageableCaptor;

    private Product product;
    private User mockUser;

    @BeforeEach
    void setup() {
        product = Product.builder()
                .productName("빈티지 의자")
                .description("설명")
                .stock(10)
                .productCode("P001")
                .manufacturer("제조사")
                .origin("한국")
                .brand("테스트브랜드")
                .couponApplicable(true)
                .color("빨강")
                .components("의자 본체, 설명서")
                .material("플라스틱")
                .size("중간")
                .shippingInstallationFee(5000)
                .asPhoneNumber("1234-5678")
                .costPrice(8000)
                .marketPrice(15000)
                .outOfStock(false)
                .stockNotificationThreshold(2)
                .createdAt(LocalDateTime.now())
                .discountRate(20)
                .discountPrice(12000)
                .seller(mock(Seller.class))
                .category(null)
                .build();
        ReflectionTestUtils.setField(product, "productId", 1L);

        mockUser = User.builder()
                .email("test@example.com")
                .password("encoded")
                .role("ROLE_USER")
                .name("홍길동")
                .build();

        Wishlist wishlist = Wishlist.builder()
                .user(mockUser)
                .product(product)
                .build();
        mockUser.getWishlists().add(wishlist);
    }

    @Test
    void getProductsBySearch_shouldReturnPagedProductInfoDTOs() {
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(mockUser.getEmail(), null, new ArrayList<>());
        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);

        String keyword = "의자";
        Long categoryId = null;
        int page = 1;
        int size = 10;
        String sortBy = "createdAt";
        String order = "DESC";

        Product spyProduct = spy(product);
        Category mockCategory = mock(Category.class);
        when(spyProduct.getCategory()).thenReturn(mockCategory);
        when(mockCategory.getCategoryName()).thenReturn("의자");

        Page<Product> productPage = new PageImpl<>(List.of(spyProduct));
        when(productRepository.findAllByProductNameContaining(eq(keyword), any(Pageable.class)))
                .thenReturn(productPage);
        when(userRepository.findByEmail(mockUser.getEmail())).thenReturn(Optional.of(mockUser));

        ProductDTO.ProductListResponse response =
                productService.getProductsBySearch(keyword, categoryId, page, size, sortBy, order);

        assertThat(response.getTotalPages()).isEqualTo(1);
        assertThat(response.getTotalItems()).isEqualTo(1);
        assertThat(response.getProducts().get(0).getProductName()).isEqualTo("빈티지 의자");
        assertThat(response.getProducts().get(0).isInWishlist()).isTrue();

        verify(productRepository).findAllByProductNameContaining(eq(keyword), pageableCaptor.capture());
        Pageable usedPageable = pageableCaptor.getValue();
        assertThat(usedPageable.getPageSize()).isEqualTo(10);
        assertThat(usedPageable.getSort().getOrderFor(sortBy).getDirection()).isEqualTo(Sort.Direction.DESC);
    }

    @Test
    void getProductDetail_shouldIncludeReviewsAndOptionsCorrectly() {
        Review review = Review.builder()
                .user(mockUser)
                .product(product)
                .rating(4)
                .content("좋아요")
                .isReported(false)
                .createdAt(LocalDateTime.of(2024, 5, 1, 12, 0))
                .build();
        ReflectionTestUtils.setField(review, "reviewId", 101L);

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(reviewRepository.findByProduct(product)).thenReturn(List.of(review));

        ProductImage mainImage = ProductImage.builder()
                .product(product)
                .imageUrl("main.jpg")
                .imageOrder(0)
                .imageType(ImageType.MAIN)
                .build();
        ProductImage subImage = ProductImage.builder()
                .product(product)
                .imageUrl("sub1.jpg")
                .imageOrder(1)
                .imageType(ImageType.SUB)
                .build();
        ProductImage detailImage = ProductImage.builder()
                .product(product)
                .imageUrl("detail1.jpg")
                .imageOrder(1)
                .imageType(ImageType.DETAIL)
                .build();
        product.getProductImages().addAll(List.of(mainImage, subImage, detailImage));

        ProductOption colorOption = ProductOption.builder()
                .product(product)
                .optionName("색상")
                .optionValues(List.of("빨강", "파랑"))
                .build();
        ReflectionTestUtils.setField(colorOption, "id", 201L);
        product.getProductOptions().add(colorOption);

        AdditionalOption giftWrapOption = AdditionalOption.builder()
                .product(product)
                .optionName("선물 포장")
                .additionalPrice(3000)
                .build();
        ReflectionTestUtils.setField(giftWrapOption, "id", 301L);
        product.getAdditionalOptions().add(giftWrapOption);

        ProductDTO.ProductInfoDetailDTO dto = productService.getProductDetail(1L);

        assertThat(dto.getProductName()).isEqualTo("빈티지 의자");
        assertThat(dto.getDescription()).isEqualTo("설명");
        assertThat(dto.getStock()).isEqualTo(10);
        assertThat(dto.getProductCode()).isEqualTo("P001");
        assertThat(dto.getManufacturer()).isEqualTo("제조사");
        assertThat(dto.getOrigin()).isEqualTo("한국");
        assertThat(dto.getBrand()).isEqualTo("테스트브랜드");
        assertThat(dto.getCouponApplicable()).isTrue();
        assertThat(dto.getColor()).isEqualTo("빨강");
        assertThat(dto.getComponents()).isEqualTo("의자 본체, 설명서");
        assertThat(dto.getMaterial()).isEqualTo("플라스틱");
        assertThat(dto.getSize()).isEqualTo("중간");
        assertThat(dto.getShippingInstallationFee()).isEqualTo(5000);
        assertThat(dto.getAsPhoneNumber()).isEqualTo("1234-5678");
        assertThat(dto.getMarketPrice()).isEqualTo(15000);
        assertThat(dto.getDiscountPrice()).isEqualTo(12000);
        assertThat(dto.getDiscountRate()).isEqualTo(20);
        assertThat(dto.getOutOfStock()).isFalse();
        assertThat(dto.getStockNotificationThreshold()).isEqualTo(2);
        assertThat(dto.getSalesCount()).isEqualTo(0);

        assertThat(dto.getReviews()).hasSize(1);
        ProductDTO.ProductReviewDTO reviewDTO = dto.getReviews().get(0);
        assertThat(reviewDTO.getReviewId()).isEqualTo(101L);
        assertThat(reviewDTO.getUserName()).isEqualTo("홍길동");
        assertThat(reviewDTO.getRating()).isEqualTo(4);
        assertThat(reviewDTO.getContent()).isEqualTo("좋아요");

        assertThat(dto.getMainImageURL()).isEqualTo("main.jpg");
        assertThat(dto.getSubImagesURL()).extracting("imageURL").contains("sub1.jpg");
        assertThat(dto.getDetailDescriptionImageURL()).extracting("imageURL").contains("detail1.jpg");

        assertThat(dto.getProductOptionResponses()).hasSize(1);
        assertThat(dto.getProductOptionResponses().get(0).getOptionName()).isEqualTo("색상");
        assertThat(dto.getProductOptionResponses().get(0).getOptionValues()).containsExactly("빨강", "파랑");

        assertThat(dto.getAdditionalOptionResponses()).hasSize(1);
        assertThat(dto.getAdditionalOptionResponses().get(0).getOptionName()).isEqualTo("선물 포장");
        assertThat(dto.getAdditionalOptionResponses().get(0).getAdditionalPrice()).isEqualTo(3000);
    }
}
