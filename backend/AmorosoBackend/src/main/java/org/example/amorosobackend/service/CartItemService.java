package org.example.amorosobackend.service;

import org.example.amorosobackend.domain.CartItem;
import org.example.amorosobackend.domain.product.Product;
import org.example.amorosobackend.domain.User;
import org.example.amorosobackend.dto.CartItemControllerDTO;
import org.example.amorosobackend.repository.CartItemRepository;
import org.example.amorosobackend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
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

        CartItem cartItem = cartItemRepository.findByUserAndProduct(user, product)
                .orElse(CartItem.builder()
                        .user(user)
                        .product(product)
                        .quantity(0)
                        .build());

        cartItem.updateQuantity(cartItem.getQuantity() + request.getQuantity());
        cartItemRepository.save(cartItem);

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