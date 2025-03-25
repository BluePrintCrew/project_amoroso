package org.example.amorosobackend.repository.product;


import org.example.amorosobackend.domain.product.Product;
import org.example.amorosobackend.domain.Seller;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // 추후 성능 최적화 필요 개발시 만 객체 위주로 조회 2025-01-23
    Page<Product> findAllByCategory_CategoryId(Long categoryId, Pageable pageable);
    Optional<Product> findByProductId(Long Id);
    List<Product> findBySeller(Seller seller);

    Optional<Product> findByProductCode(String test123);

    Page<Product> findAllByCategory_CategoryIdAndProductNameContaining(Long categoryId, String keyword, Pageable pageable);

    Page<Product> findAllByProductNameContaining(String keyword, Pageable pageable);
}
