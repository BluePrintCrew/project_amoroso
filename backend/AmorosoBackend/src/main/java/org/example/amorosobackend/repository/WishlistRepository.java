package org.example.amorosobackend.repository;

import org.example.amorosobackend.domain.User;
import org.example.amorosobackend.domain.Wishlist;
import org.example.amorosobackend.domain.product.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

    Optional<Wishlist> findByUserAndProduct(User user, Product product);
    List<Wishlist> findByUser(User user);
    Page<Wishlist> findByUser(User user, Pageable pageable);
    void deleteByUserAndProduct(User user, Product product);

    int countByUser(User user);
}