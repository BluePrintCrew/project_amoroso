package org.example.amorosobackend.repository;

import org.example.amorosobackend.domain.OrderItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem,Long> {

    @Query("SELECT oi FROM OrderItem oi " +
            "JOIN oi.order o " +
            "WHERE o.user.userId = :userId")
    Page<OrderItem> findByUserId(@Param("userId") Long userId, Pageable pageable);

    }
