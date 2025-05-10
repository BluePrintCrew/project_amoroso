package org.example.amorosobackend.repository;

import org.example.amorosobackend.domain.cart.CartItem;
import org.example.amorosobackend.domain.product.Product;
import org.example.amorosobackend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(User user);

    Optional<CartItem> findByUserAndProduct(User user, Product product);

    int countByUser(User user);
    @Query("""
    SELECT c
      FROM CartItem c
      LEFT JOIN c.cartAdditionalOption ca
      LEFT JOIN ca.additionalOption ao
      LEFT JOIN c.cartProductOption cp
      LEFT JOIN cp.productOption po
    WHERE c.user = :user
      AND c.product = :product
      AND (
           (:additionalOptionId  IS NULL AND ca IS NULL)
        OR (ao.id = :additionalOptionId)
      )
      AND (
           (:productOptionId     IS NULL AND cp IS NULL AND :selectedValue IS NULL)
        OR (po.id = :productOptionId AND cp.selectedValue = :selectedValue)
      )
""")
    Optional<CartItem> findDuplicateCartItem(
            @Param("user")               User user,
            @Param("product")            Product product,
            @Param("additionalOptionId") Long additionalOptionId,
            @Param("productOptionId")    Long productOptionId,
            @Param("selectedValue")      String selectedValue
    );


}
