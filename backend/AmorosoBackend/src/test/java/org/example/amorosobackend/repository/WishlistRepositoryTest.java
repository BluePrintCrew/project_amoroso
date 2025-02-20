package org.example.amorosobackend.repository;

import org.example.amorosobackend.domain.*;
import org.example.amorosobackend.enums.*;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class WishlistRepositoryTest {

    @Autowired
    WishlistRepository wishlistRepository;

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    SellerRepository sellerRepository;

    @Autowired
    UserRepository userRepository;

    User testUser;
    Product testProduct;
    Wishlist testWishlist;
    Category testCategory;
    Seller testSeller;

    @BeforeEach
    void setUp() {


        testUser = userRepository.save(User.builder()
                .name("testUser")
                .email("testEmail@example.com")
                .password("1234")
                .role("USER")
                .build());

        testSeller = sellerRepository.save(Seller.builder()
                .brandName("testBrand")
                .businessRegistrationNumber("123")
                        .user(testUser)
                .build());

        testCategory = categoryRepository.save(Category.builder()
                .categoryName("소파")
                .categoryCode(CategoryCode.LIVING_SOFA)  // String 대신 enum 값 직접 사용
                .build());
        testProduct = productRepository.save(Product.builder()
                .productName("testProduct")
                .stock(10)
                .price(1000)
                .seller(testSeller)
                .category(testCategory)
                .build());

        testWishlist = wishlistRepository.save(Wishlist.builder()
                .user(testUser)
                .product(testProduct)
                .build());
    }

    @Test
    void findByUser() {
        List<Wishlist> byUser = wishlistRepository.findByUser(testUser);

        assertThat(byUser.size()).isEqualTo(1);
        assertThat(byUser.get(0).getUser()).isEqualTo(testUser);
        assertThat(byUser.get(0).getProduct()).isEqualTo(testProduct);


    }

    @Test
    void findByUserAndProduct() {
        Wishlist byUserAndProduct = wishlistRepository.findByUserAndProduct(testUser, testProduct)
                .orElseThrow(() -> new NullPointerException("doesn't exist"));


        assertThat(byUserAndProduct.getUser()).isEqualTo(testUser);
        assertThat(byUserAndProduct.getProduct()).isEqualTo(testProduct);

    }

    @Test
    void deleteByUserAndProduct() {
        wishlistRepository.deleteByUserAndProduct(testUser, testProduct);

        assertThat(wishlistRepository.findByUserAndProduct(testUser, testProduct).isEmpty()).isTrue();

    }
}