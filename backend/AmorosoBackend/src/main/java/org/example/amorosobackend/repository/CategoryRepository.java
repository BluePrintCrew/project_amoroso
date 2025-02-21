package org.example.amorosobackend.repository;

import org.example.amorosobackend.domain.Category;
import org.example.amorosobackend.domain.Product;
import org.example.amorosobackend.enums.CategoryCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByCategoryCode(CategoryCode CategoryCode);
}
