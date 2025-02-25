package org.example.amorosobackend.repository;

import org.example.amorosobackend.domain.product.Product;
import org.example.amorosobackend.domain.User;
import org.example.amorosobackend.domain.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

import java.util.Optional;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByUser(User user);
    Optional<Wishlist> findByUserAndProduct(User user, Product product);
    void deleteByUserAndProduct(User user, Product product);


    int countByUser(User user);
    // select Count(*) from wishlist.w where w.user_id = user_id
}