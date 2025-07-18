package org.example.amorosobackend.service;

import lombok.extern.slf4j.Slf4j;
import org.example.amorosobackend.domain.cart.CartAdditionalOption;
import org.example.amorosobackend.domain.cart.CartItem;
import org.example.amorosobackend.domain.cart.CartProductOption;
import org.example.amorosobackend.domain.product.AdditionalOption;
import org.example.amorosobackend.domain.product.Product;
import org.example.amorosobackend.domain.User;
import org.example.amorosobackend.domain.product.ProductOption;
import org.example.amorosobackend.dto.CartItemControllerDTO;
import org.example.amorosobackend.repository.CartItemRepository;
import org.example.amorosobackend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class CartItemService {

    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductService productService;

    public CartItemService(CartItemRepository cartItemRepository, UserRepository userRepository, ProductService productService) {
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.productService = productService;
    }

    @Transactional
    public CartItemControllerDTO.CartItemResponseDTO addToCart(String email, CartItemControllerDTO.CartItemRequestDTO request) {

        User user = userRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("User not found"));
        Product product = productService.getProductById(request.getProductId());

        // 기존 CartItem 있는지 검사
        Optional<CartItem> optionalExistingCartItem = cartItemRepository.findDuplicateCartItem(
                user,
                product,
                request.getAdditionalOptionId(),
                request.getProductOptionId(),
                request.getSelectedOptionValue()
        );

        if (optionalExistingCartItem.isPresent()) {
            CartItem existingCartItem = optionalExistingCartItem.get();
            existingCartItem.updateQuantity(existingCartItem.getQuantity() + request.getQuantity());
            log.info("중복 발생! 수량 변화 to {}", existingCartItem.getQuantity());
            return new CartItemControllerDTO.CartItemResponseDTO(existingCartItem);
        }

        CartItem cartItem = CartItem.builder()
                .user(user)
                .product(product)
                .quantity(request.getQuantity())
                .build();



        if (request.getAdditionalOptionId() != null) {
            AdditionalOption additionalOption = productService.getAdditionalOptionById(request.getAdditionalOptionId());
            CartAdditionalOption cartAdditionalOption = CartAdditionalOption.builder()
                    .cartItem(cartItem)
                    .additionalOption(additionalOption)
                    .build();
            cartItem.setCartAdditionalOption(cartAdditionalOption);
        }

        if (request.getProductOptionId() != null && request.getSelectedOptionValue() != null) {
            ProductOption productOption = productService.getProductOptionById(request.getProductOptionId());
            CartProductOption cartProductOption = CartProductOption.builder()
                    .cartItem(cartItem)
                    .productOption(productOption)
                    .selectedValue(request.getSelectedOptionValue())
                    .build();
            cartItem.setCartProductOption(cartProductOption);
        }

        cartItem = cartItemRepository.save(cartItem);
        return new CartItemControllerDTO.CartItemResponseDTO(cartItem);
    }


    public List<CartItemControllerDTO.CartItemResponseDTO> getCartItems(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("User not found"));
        return cartItemRepository.findByUser(user).stream()
                .map(CartItemControllerDTO.CartItemResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public CartItemControllerDTO.CartItemResponseDTO updateCartItemQuantity(Long cartItemId, int quantity) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new IllegalArgumentException("CartItem not found"));

        cartItem.updateQuantity(quantity);
        cartItemRepository.save(cartItem);

        return new CartItemControllerDTO.CartItemResponseDTO(cartItem);
    }

    @Transactional
    public void removeCartItem(Long cartItemId) {
        cartItemRepository.deleteById(cartItemId);
    }

}