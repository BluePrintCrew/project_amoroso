package org.example.amorosobackend.repository;

import org.example.amorosobackend.domain.User;
import org.example.amorosobackend.domain.UserCoupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserCouponRepository extends JpaRepository<UserCoupon, Long> {
    List<UserCoupon> findByUser(User user);

    @Query("SELECT uc FROM UserCoupon uc WHERE uc.user = :user AND uc.isUsed = false")
    List<UserCoupon> findAvailableCoupons(@Param("user") User user);
    int countByUserAndIsUsed(User user, boolean b);

}