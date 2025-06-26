package org.example.amorosobackend.repository;

import org.example.amorosobackend.domain.PaymentGroup;
import org.example.amorosobackend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentGroupRepository extends JpaRepository<PaymentGroup, Long> {
    Optional<PaymentGroup> findByPaymentGroupCode(String paymentGroupCode);
    List<PaymentGroup> findByUser(User user);
}