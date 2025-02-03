package org.example.amorosobackend.repository;

import org.example.amorosobackend.domain.Category;
import org.example.amorosobackend.domain.Product;
import org.example.amorosobackend.domain.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProduct(Product product);
}
