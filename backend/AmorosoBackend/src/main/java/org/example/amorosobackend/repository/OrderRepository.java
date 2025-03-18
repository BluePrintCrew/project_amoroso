package org.example.amorosobackend.repository;

import org.example.amorosobackend.domain.order.Order;
import org.example.amorosobackend.domain.User;
import org.example.amorosobackend.enums.OrderStatus;
import org.example.amorosobackend.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);

    @Query("SELECT COUNT(o) FROM Order o " +
            "JOIN o.orderItems oi " +
            "JOIN oi.product p " +
            "WHERE p.seller.user.userId = :sellerId " +
            "AND o.paymentStatus = :paymentStatus " +
            "AND o.orderStatus = :orderStatus")
    Long countPaidOrdersBySeller(
            @Param("sellerId") Long sellerId,
            @Param("paymentStatus") PaymentStatus paymentStatus,
            @Param("orderStatus") OrderStatus orderStatus
    );

    @Query("SELECT COUNT(o) FROM Order o " +
            "JOIN o.orderItems oi " +
            "JOIN oi.product p " +
            "WHERE p.seller.user.userId = :sellerId " +
            "AND o.orderStatus = :orderStatus")
    Long countOrdersBySellerAndStatus(
            @Param("sellerId") Long sellerId,
            @Param("orderStatus") OrderStatus orderStatus
    );

    int countByUser(User user);

    int countByUserAndOrderStatus(User user, OrderStatus paymentPending);
}
