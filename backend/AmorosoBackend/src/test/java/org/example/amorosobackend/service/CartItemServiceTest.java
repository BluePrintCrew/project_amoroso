package org.example.amorosobackend.service;

import org.example.amorosobackend.domain.User;
import org.example.amorosobackend.domain.cart.CartAdditionalOption;
import org.example.amorosobackend.domain.cart.CartItem;
import org.example.amorosobackend.domain.cart.CartProductOption;
import org.example.amorosobackend.domain.product.AdditionalOption;
import org.example.amorosobackend.domain.product.Product;
import org.example.amorosobackend.domain.product.ProductOption;
import org.example.amorosobackend.dto.CartItemControllerDTO;
import org.example.amorosobackend.repository.CartItemRepository;
import org.example.amorosobackend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class CartItemServiceTest {

    @InjectMocks
    private CartItemService cartItemService;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProductService productService;

    private User mockUser;
    private Product mockProduct;

    @BeforeEach
    void setUp() {
        // 인증된 사용자 컨텍스트 설정
        mockUser = User.builder()
                .email("user@example.com")
                .password("pass")
                .role("ROLE_USER")
                .name("테스트유저")
                .build();

        // 사용자 레포 조회 모킹
        when(userRepository.findByEmail(mockUser.getEmail()))
                .thenReturn(Optional.of(mockUser));

        // 공통 상품 목
        mockProduct = Product.builder()
                .productName("테스트상품")
                .marketPrice(1000)
                .discountRate(0)
                .build();
        ReflectionTestUtils.setField(mockProduct, "productId", 42L);
        when(productService.getProductById(42L)).thenReturn(mockProduct);
    }

    // 옵션이 있을때 카트 등록이 어떻게 되는 지 확인.
    @Test
    void addToCart_withBothOptions_shouldSaveCartItemWithOptionsAndReturnDto() {
        // given
        Long additionalOptionId = 100L;
        Long productOptionId = 200L;
        String selectedValue = "옵션값A";
        int qty = 3;

        // 이미 존재하는 CartItem 조회 시 없다고 모킹
        when(cartItemRepository.findDuplicateCartItem(
                eq(mockUser), eq(mockProduct), eq(additionalOptionId), eq(productOptionId), eq(selectedValue)))
                .thenReturn(Optional.empty());

        // 추가 옵션 & 상품 옵션 조회 모킹
        AdditionalOption addOpt = AdditionalOption.builder()
                .product(mockProduct)
                .optionName("추가포장")
                .additionalPrice(500)
                .build();
        ReflectionTestUtils.setField(addOpt, "id", additionalOptionId);
        when(productService.getAdditionalOptionById(additionalOptionId)).thenReturn(addOpt);

        ProductOption prodOpt = ProductOption.builder()
                .product(mockProduct)
                .optionName("색상")
                .optionValues(java.util.List.of("옵션값A", "옵션값B"))
                .build();
        ReflectionTestUtils.setField(prodOpt, "id", productOptionId);
        when(productService.getProductOptionById(productOptionId)).thenReturn(prodOpt);

        // 저장되는 CartItem 캡처
        ArgumentCaptor<CartItem> captor = ArgumentCaptor.forClass(CartItem.class);
        when(cartItemRepository.save(captor.capture())).thenAnswer(inv -> inv.getArgument(0));

        // whend
        CartItemControllerDTO.CartItemRequestDTO req =
                new CartItemControllerDTO.CartItemRequestDTO();
        req.setProductId(42L);
        req.setAdditionalOptionId(additionalOptionId);
        req.setProductOptionId(productOptionId);
        req.setSelectedOptionValue(selectedValue);
        req.setQuantity(qty);

        CartItemControllerDTO.CartItemResponseDTO response =
                cartItemService.addToCart(mockUser.getEmail(), req);

        // then
        // 저장된 엔티티 검증
        CartItem saved = captor.getValue();
        assertThat(saved.getUser()).isSameAs(mockUser);
        assertThat(saved.getProduct()).isSameAs(mockProduct);
        assertThat(saved.getQuantity()).isEqualTo(qty);

        // 추가 옵션 관계 검증
        CartAdditionalOption savedAddOptRel = saved.getCartAdditionalOption();
        assertThat(savedAddOptRel).isNotNull();
        assertThat(savedAddOptRel.getAdditionalOption()).isSameAs(addOpt);

        // 상품 옵션 관계 검증
        CartProductOption savedProdOptRel = saved.getCartProductOption();
        assertThat(savedProdOptRel).isNotNull();
        assertThat(savedProdOptRel.getProductOption()).isSameAs(prodOpt);
        assertThat(savedProdOptRel.getSelectedValue()).isEqualTo(selectedValue);

        // DTO 검증
        assertThat(response.getQuantity()).isEqualTo(qty);
        assertThat(response.getProductId()).isEqualTo(42L);
        assertThat(response.getAdditionalOptionId()).isEqualTo(additionalOptionId);
        assertThat(response.getProductOptionId()).isEqualTo(productOptionId);
        assertThat(response.getSelectedOptionValue()).isEqualTo(selectedValue);

        // 리포지토리 메서드 호출 횟수 검증
        verify(cartItemRepository).findDuplicateCartItem(
                eq(mockUser), eq(mockProduct), eq(additionalOptionId), eq(productOptionId), eq(selectedValue));
        verify(cartItemRepository).save(any(CartItem.class));
    }

    @Test
    void addToCart_withBothOptions_duplicateProduct() {
        // given
        Long additionalOptionId = 100L;
        Long productOptionId = 200L;
        String selectedValue = "옵션값A";
        int existingQty = 2;
        int addQty = 3;

        // 이미 존재하는 CartItem 엔티티 준비
        CartItem existing = CartItem.builder()
                .user(mockUser)
                .product(mockProduct)
                .quantity(existingQty)
                .build();
        // 옵션 관계도 설정해줘야 DTO 변환 시 NPE 방지
        AdditionalOption addOpt = AdditionalOption.builder()
                .product(mockProduct).optionName("추가포장").additionalPrice(500).build();
        ReflectionTestUtils.setField(addOpt, "id", additionalOptionId);
        CartAdditionalOption existingAddRel = CartAdditionalOption.builder()
                .cartItem(existing).additionalOption(addOpt).build();
        existing.setCartAdditionalOption(existingAddRel);

        ProductOption prodOpt = ProductOption.builder()
                .product(mockProduct).optionName("색상").optionValues(List.of("옵션값A", "옵션값B")).build();
        ReflectionTestUtils.setField(prodOpt, "id", productOptionId);

        CartProductOption existingProdRel = CartProductOption.builder()
                .cartItem(existing).productOption(prodOpt).selectedValue(selectedValue).build();
        existing.setCartProductOption(existingProdRel);

        // findDuplicateCartItem이 existing 반환
        when(cartItemRepository.findDuplicateCartItem(
                eq(mockUser), eq(mockProduct),
                eq(additionalOptionId), eq(productOptionId), eq(selectedValue)))
                .thenReturn(Optional.of(existing));

        // request 준비
        CartItemControllerDTO.CartItemRequestDTO req =
                new CartItemControllerDTO.CartItemRequestDTO();
        req.setProductId(42L);
        req.setAdditionalOptionId(additionalOptionId);
        req.setProductOptionId(productOptionId);
        req.setSelectedOptionValue(selectedValue);
        req.setQuantity(addQty);

        // when
        CartItemControllerDTO.CartItemResponseDTO response =
                cartItemService.addToCart(mockUser.getEmail(), req);

        // then
        // 기존 엔티티의 quantity만 업데이트됐는지
        assertThat(existing.getQuantity()).isEqualTo(existingQty + addQty);

        // save는 호출되지 않아야 함
        verify(cartItemRepository, never()).save(any());

        // 반환 DTO의 quantity도 합산된 값
        assertThat(response.getQuantity()).isEqualTo(existingQty + addQty);

        // 기존 옵션 관계가 유지되는지 DTO에도 반영됐는지
        assertThat(response.getAdditionalOptionId()).isEqualTo(additionalOptionId);
        assertThat(response.getProductOptionId()).isEqualTo(productOptionId);
        assertThat(response.getSelectedOptionValue()).isEqualTo(selectedValue);
    }

}
