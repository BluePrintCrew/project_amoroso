package org.example.amorosobackend.repository;

import org.example.amorosobackend.domain.Category;
import org.example.amorosobackend.domain.Order;
import org.example.amorosobackend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);


}
