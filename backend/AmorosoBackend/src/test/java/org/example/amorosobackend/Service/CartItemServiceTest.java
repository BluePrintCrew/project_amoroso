package org.example.amorosobackend.Service;

import org.example.amorosobackend.domain.Seller;
import org.example.amorosobackend.domain.User;
import org.example.amorosobackend.domain.cart.CartAdditionalOption;
import org.example.amorosobackend.domain.cart.CartItem;
import org.example.amorosobackend.domain.cart.CartProductOption;
import org.example.amorosobackend.domain.category.Category;
import org.example.amorosobackend.domain.product.AdditionalOption;
import org.example.amorosobackend.domain.product.Product;
import org.example.amorosobackend.domain.product.ProductOption;
import org.example.amorosobackend.dto.CartItemControllerDTO;
import org.example.amorosobackend.enums.CategoryCode;
import org.example.amorosobackend.enums.UserRole;
import org.example.amorosobackend.repository.CartItemRepository;
import org.example.amorosobackend.repository.UserRepository;
import org.example.amorosobackend.service.CartItemService;
import org.example.amorosobackend.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.lang.reflect.Field;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;



class CartItemServiceTest {

    private CartItemRepository cartItemRepository;
    private UserRepository userRepository;
    private ProductService productService;
    private CartItemService cartItemService;

    @BeforeEach
    void setUp() {
        cartItemRepository = Mockito.mock(CartItemRepository.class);
        userRepository = Mockito.mock(UserRepository.class);
        productService = Mockito.mock(ProductService.class);

        cartItemService = new CartItemService(cartItemRepository,userRepository,productService);

    }

    @Test
    void addToCart_firstCartItem() {
        // given
        String email = "test_email";
        Long productId = 1L;
        Long additionalOptionId = 1L;
        Long productOptionId = 1L;
        String selectedOption = "빨강";
        int quantity = 1;

        User testUser = User.builder()
                .email(email)
                .password("123456789")
                .name("test_user1")
                .role(UserRole.ROLE_USER.name())
                .build();

        User testSellerUser = User.builder()
                .email("seller@email.com")
                .password("123456789")
                .name("test_seller")
                .role(UserRole.ROLE_SELLER.name())
                .build();

        Seller testSeller = Seller.builder()
                .user(testSellerUser)
                .brandName("test_brand")
                .businessRegistrationNumber("123-123-123")
                .build();

        Category category = Category.builder()
                .categoryName("category")
                .categoryCode(CategoryCode.BEDROOM_BED)
                .build();

        Product product = Product.builder()
                .category(category)
                .productName("test_product")
                .marketPrice(20000)
                .stock(100)
                .discountRate(25)
                .seller(testSeller)
                .build();

        System.out.println(">>> [TEST] product.discountPrice = " + product.getDiscountPrice());

        setId(product, "productId", productId);

        AdditionalOption additionalOption = AdditionalOption.builder()
                .optionName("포장 추가")
                .additionalPrice(1000)
                .product(product)
                .build();
        setId(additionalOption, "id", additionalOptionId);

        ProductOption productOption = ProductOption.builder()
                .product(product)
                .optionName("색상")
                .optionValues(List.of("빨강", "파랑", "초록"))
                .build();
        setId(productOption, "id", productOptionId);

        CartItem cartItem = CartItem.builder()
                .user(testUser)
                .product(product)
                .quantity(quantity)
                .build();
        setId(cartItem, "cartItemId", 10L); // 저장 후 ID

        // cart 옵션들 연결
        CartAdditionalOption cartAdditionalOption = CartAdditionalOption.builder()
                .cartItem(cartItem)
                .additionalOption(additionalOption)
                .build();
        cartItem.setCartAdditionalOption(cartAdditionalOption);

        CartProductOption cartProductOption = CartProductOption.builder()
                .cartItem(cartItem)
                .productOption(productOption)
                .selectedValue(selectedOption)
                .build();
        cartItem.setCartProductOption(cartProductOption);

        // request DTO
        CartItemControllerDTO.CartItemRequestDTO requestDTO = new CartItemControllerDTO.CartItemRequestDTO(
                productId,
                quantity,
                additionalOptionId,
                productOptionId,
                selectedOption
        );

        // mock 설정
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(testUser));
        when(productService.getProductById(productId)).thenReturn(product);
        when(productService.getAdditionalOptionById(additionalOptionId)).thenReturn(additionalOption);
        when(productService.getProductOptionById(productOptionId)).thenReturn(productOption);
        when(cartItemRepository.save(any(CartItem.class)))
                .thenAnswer(invocation -> {
                    CartItem saved = invocation.getArgument(0);
                    System.out.println(">>> [SAVE] saved.product.discountPrice = " + saved.getProduct().getDiscountPrice());
                    setId(saved, "cartItemId", 10L);
                    return saved;
                });

        // when
        CartItemControllerDTO.CartItemResponseDTO responseDTO = cartItemService.addToCart(email, requestDTO);

        // then
        assertNotNull(responseDTO);
        assertEquals(productId, responseDTO.getProductId());
        assertEquals("test_product", responseDTO.getProductName());
        assertEquals(20000,responseDTO.getMarketPrice());
        assertEquals(quantity, responseDTO.getQuantity());
        assertEquals(15000, responseDTO.getDiscountPrice());
        assertEquals(quantity * 15000 + quantity * 1000, responseDTO.getTotalPrice());
        assertEquals(additionalOptionId, responseDTO.getAdditionalOptionId());
        assertEquals("포장 추가", responseDTO.getAdditionalOptionName());
        assertEquals("색상", responseDTO.getProductOptionName());
        assertEquals("빨강", responseDTO.getSelectedOptionValue());

        verify(cartItemRepository, times(1)).save(any(CartItem.class));
    }


    private <T> void setId(T entity, String fieldName, Object value){
        try{
            Field field = entity.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            field.set(entity, value);
        }catch (Exception e){
            throw new RuntimeException(e);
        }
    }
}