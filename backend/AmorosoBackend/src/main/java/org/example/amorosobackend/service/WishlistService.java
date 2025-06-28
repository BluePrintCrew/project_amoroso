package org.example.amorosobackend.service;

import lombok.RequiredArgsConstructor;
import org.example.amorosobackend.domain.Wishlist;
import org.example.amorosobackend.dto.WishlistDTO;
import org.example.amorosobackend.repository.WishlistRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.example.amorosobackend.domain.product.Product;
import org.example.amorosobackend.domain.User;
import org.example.amorosobackend.repository.UserRepository;
import org.example.amorosobackend.repository.product.ProductRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    // 사용자 이메일을 이용하여 현재 로그인된 유저를 찾는 메서드
    private User getCurrentUser() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    // 위시리스트에 제품 추가
    public void addToWishlist(Long productId) {
        User user = getCurrentUser();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        if (wishlistRepository.findByUserAndProduct(user, product).isPresent()) {
            throw new IllegalStateException("Product already in wishlist");
        }

        Wishlist wishlist = Wishlist.builder()
                .user(user)
                .product(product)
                .build();

        wishlistRepository.save(wishlist);
    }

    // 위시리스트에서 제품 삭제
    public void removeFromWishlist(Long productId) {
        User user = getCurrentUser();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        wishlistRepository.deleteByUserAndProduct(user, product);
    }

    // 사용자의 위시리스트 조회 (기존 메서드 - 하위 호환성 유지)
    @Transactional(readOnly = true)
    public List<Long> getWishlist() {
        User user = getCurrentUser();
        return wishlistRepository.findByUser(user).stream()
                .map(wishlist -> wishlist.getProduct().getProductId())
                .collect(Collectors.toList());
    }

    // 페이징된 위시리스트 조회
    @Transactional(readOnly = true)
    public WishlistDTO.WishlistPageResponse getWishlistWithPaging(int page, int size) {
        User user = getCurrentUser();
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<Wishlist> wishlistPage = wishlistRepository.findByUser(user, pageable);
        Page<WishlistDTO.WishlistResponse> responsePage = wishlistPage.map(WishlistDTO.WishlistResponse::from);

        return WishlistDTO.WishlistPageResponse.from(responsePage);
    }
}