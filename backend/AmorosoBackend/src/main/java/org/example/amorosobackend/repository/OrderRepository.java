package org.example.amorosobackend.repository;

import org.example.amorosobackend.domain.Order;
import org.example.amorosobackend.domain.Seller;
import org.example.amorosobackend.domain.User;
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
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
    /**
     * PaymentGroup 상태를 고려한 주문 수 조회
     */
    @Query("SELECT COUNT(o) FROM Order o " +
            "WHERE o.seller = :seller " +
            "AND o.paymentGroup.paymentStatus = :paymentStatus " +
            "AND o.orderStatus = :orderStatus")
    Long countOrdersBySellerAndPaymentGroupStatus(
            @Param("seller") Seller seller,
            @Param("paymentStatus") PaymentStatus paymentStatus,
            @Param("orderStatus") OrderStatus orderStatus
    );

    /**
     * 주문 상태별 주문 수 조회 (PaymentGroup 무관)
     */
    @Query("SELECT COUNT(o) FROM Order o " +
            "WHERE o.seller = :seller " +
            "AND o.orderStatus = :orderStatus")
    Long countOrdersBySellerAndStatus(
            @Param("seller") Seller seller,
            @Param("orderStatus") OrderStatus orderStatus
    );

    /**
     * PaymentGroup 상태와 날짜 범위를 고려한 Order 조회
     */
    @Query("SELECT o FROM Order o " +
            "WHERE o.seller = :seller " +
            "AND o.paymentGroup.paymentStatus = :paymentStatus " +
            "AND o.createdAt BETWEEN :startDate AND :endDate")
    List<Order> findOrdersBySellerAndPaymentGroupStatusAndDateBetween(
            @Param("seller") Seller seller,
            @Param("paymentStatus") PaymentStatus paymentStatus,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    /**
     * PaymentGroup 상태를 고려한 페이징 조회
     */
    @Query("SELECT o FROM Order o " +
            "WHERE o.seller = :seller " +
            "AND o.paymentGroup.paymentStatus = :paymentStatus " +
            "ORDER BY o.createdAt DESC")
    Page<Order> findBySellerAndPaymentGroupStatus(
            @Param("seller") Seller seller,
            @Param("paymentStatus") PaymentStatus paymentStatus,
            Pageable pageable
    );

    /**
     * 판매자의 모든 주문 조회 (시간순 정렬)
     */
    @Query("SELECT o FROM Order o " +
            "WHERE o.seller = :seller " +
            "ORDER BY o.createdAt DESC")
    Page<Order> findBySeller(
            @Param("seller") Seller seller,
            Pageable pageable
    );

    int countByUser(User user);

    int countByUserAndOrderStatus(User user, OrderStatus paymentPending);

    @Query("SELECT COALESCE(SUM(o.totalPrice), 0) FROM Order o WHERE o.createdAt BETWEEN :start AND :end AND o.paymentStatus = :status")
    int sumTotalPriceByCreatedAtBetweenAndPaymentStatus(@Param("start") LocalDateTime start,
                                                        @Param("end") LocalDateTime end,
                                                        @Param("status") PaymentStatus status);

    Page<Order> findDistinctByOrderItemsProductSeller(Seller seller, Pageable pageable);
}
