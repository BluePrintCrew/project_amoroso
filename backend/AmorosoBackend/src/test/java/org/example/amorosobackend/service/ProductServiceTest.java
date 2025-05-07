package org.example.amorosobackend.service;

import org.example.amorosobackend.domain.User;
import org.example.amorosobackend.domain.Wishlist;
import org.example.amorosobackend.domain.category.Category;
import org.example.amorosobackend.domain.product.Product;
import org.example.amorosobackend.dto.ProductDTO;
import org.example.amorosobackend.repository.UserRepository;
import org.example.amorosobackend.repository.product.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.springframework.data.domain.*;

import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;


@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class ProductServiceTest {

    @InjectMocks
    private ProductService productService;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    @Captor
    private ArgumentCaptor<Pageable> pageableCaptor;

    private Product product;
    private User mockUser;

    @BeforeEach
    void setup() {
        // product 정의
        product = Product.builder()
                .productName("빈티지 의자")
                .marketPrice(10000)
                .discountRate(10)
                .category(null) // category는 null로 두되 getCategory().getCategoryName()은 stub에서 처리
                .build();

        // id 설정
        // ReflectionTestUtils 로 setProductId 진행. 엔티티 내부에서 빌더로 선언하는 것은 유지보수성이 떨어지고
        // 좋지 않음. -> 아이디를 정해주는 것은 데이터 내부에서만 진행해야한다.
        ReflectionTestUtils.setField(product, "productId", 1L);


        mockUser = User.builder()
                .email("test@example.com")
                .password("encoded")
                .role("ROLE_USER")
                .name("홍길동")
                .build();

        // 위시리스트 설정
        Wishlist wishlist = Wishlist.builder()
                .user(mockUser)
                .product(product)
                .build();
        mockUser.getWishlists().add(wishlist);

        // SecurityContext 설정
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(mockUser.getEmail(), null, new ArrayList<>());
        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);
    }

    @Test
    void getProductsBySearch_shouldReturnPagedProductInfoDTOs() {
        // given
        String keyword = "의자";
        Long categoryId = null;
        int page = 1;
        int size = 10;
        String sortBy = "createdAt";
        String order = "DESC";

        Page<Product> productPage = new PageImpl<>(List.of(product));
        when(productRepository.findAllByProductNameContaining(eq(keyword), any(Pageable.class)))
                .thenReturn(productPage);
        when(userRepository.findByEmail(mockUser.getEmail())).thenReturn(Optional.of(mockUser));

        // stub category.getCategoryName() safely
        // spy() -> 일부의 내용만 stub하기 위해 사용하는 객체
        Product spyProduct = spy(product);                      // 진짜 product 객체 감쌈
        Category mockCategory = mock(Category.class);           // 카테고리 필요 없으므로 mock 설정 진행

        when(spyProduct.getCategory()).thenReturn(mockCategory); // getCategory()가 mockCategory 반환하도록 stub
        when(mockCategory.getCategoryName()).thenReturn("의자"); // mockCategory.getCategoryName() stub


        // when
        ProductDTO.ProductListResponse response =
                productService.getProductsBySearch(keyword, categoryId, page, size, sortBy, order);

        // then
        assertThat(response.getTotalPages()).isEqualTo(1);
        assertThat(response.getTotalItems()).isEqualTo(1);
        assertThat(response.getProducts().get(0).getProductName()).isEqualTo("빈티지 의자");
        assertThat(response.getProducts().get(0).isInWishlist()).isTrue();

        verify(productRepository).findAllByProductNameContaining(eq(keyword), pageableCaptor.capture());
        Pageable usedPageable = pageableCaptor.getValue();
        assertThat(usedPageable.getPageSize()).isEqualTo(10);
        assertThat(usedPageable.getSort().getOrderFor(sortBy).getDirection()).isEqualTo(Sort.Direction.DESC);
    }
}
