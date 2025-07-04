package org.example.amorosobackend.repository;

import org.example.amorosobackend.domain.Seller;
import org.example.amorosobackend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SellerRepository extends JpaRepository<Seller, Long> {

    Optional<Seller> findByUser(User user);


    boolean existsByBusinessRegistrationNumber(String businessNumber);
}
