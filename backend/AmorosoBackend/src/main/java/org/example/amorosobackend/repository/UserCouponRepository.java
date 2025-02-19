package org.example.amorosobackend.repository;

import org.example.amorosobackend.domain.User;
import org.example.amorosobackend.domain.UserCoupon;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserCouponRepository extends JpaRepository<UserCoupon, Long> {
    List<UserCoupon> findByUser(User user);
}