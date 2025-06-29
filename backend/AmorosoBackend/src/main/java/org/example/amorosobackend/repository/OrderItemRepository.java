package org.example.amorosobackend.repository;

import org.example.amorosobackend.domain.OrderItem;
import org.example.amorosobackend.domain.Seller;
import org.example.amorosobackend.enums.OrderStatus;
import org.example.amorosobackend.enums.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem,Long> {

    @Query("SELECT oi FROM OrderItem oi " +
            "JOIN oi.order o " +
            "WHERE o.user.userId = :userId")
    Page<OrderItem> findByUserId(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT oi FROM OrderItem oi " +
            "JOIN oi.order o " +
            "LEFT JOIN o.paymentGroup pg " +
            "WHERE o.user.userId = :userId " +
            "AND (pg.paymentStatus = :paymentStatus OR (pg IS NULL AND o.paymentStatus = :paymentStatus)) " +
            "AND NOT EXISTS (SELECT 1 FROM Review r WHERE r.user.userId = :userId AND r.product.productId = oi.product.productId) " +
            "ORDER BY o.createdAt DESC")
    Page<OrderItem> findReviewableOrderItemsByUserId(@Param("userId") Long userId, @Param("paymentStatus") PaymentStatus paymentStatus, Pageable pageable);

    @Query("SELECT oi " +
            "FROM OrderItem oi " +
            "WHERE oi.product.seller = :seller " +
            "AND oi.createdAt BETWEEN :start AND :end " +
            "AND oi.order.paymentStatus = :status")
    List<OrderItem> findBySellerProductAndCreatedAtBetweenAndOrderPaymentStatus(
            @Param("seller") Seller seller,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            @Param("status") PaymentStatus status
    );
}
