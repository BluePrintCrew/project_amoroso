package org.example.amorosobackend.repository;

import org.example.amorosobackend.domain.category.Category;
import org.example.amorosobackend.enums.CategoryCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByCategoryCode(CategoryCode categoryCode); // JPA가 자동으로 변환함!

    List<Category> findAllByCategoryCode(CategoryCode categoryCode);

    Optional<Category> findFirstByCategoryCode(CategoryCode categoryCode);


}
