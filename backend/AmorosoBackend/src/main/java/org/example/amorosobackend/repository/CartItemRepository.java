package org.example.amorosobackend.repository;

import org.example.amorosobackend.domain.cart.CartItem;
import org.example.amorosobackend.domain.product.Product;
import org.example.amorosobackend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(User user);
    Optional<CartItem> findByUserAndProduct(User user, Product product);

    int countByUser(User user);
}
