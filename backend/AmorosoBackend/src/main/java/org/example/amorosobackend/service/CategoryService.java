package org.example.amorosobackend.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.example.amorosobackend.domain.category.Category;
import org.example.amorosobackend.enums.CategoryCode;
import org.example.amorosobackend.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static org.example.amorosobackend.enums.CategoryCode.fromCode;

@Service
@Transactional
@AllArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public Category findByCategoryCode(String categoryCode) {
        try {
            CategoryCode code = CategoryCode.valueOf(categoryCode);
            return categoryRepository.findFirstByCategoryCode(code)
                    .orElseThrow(() -> new EntityNotFoundException("Category not found: " + categoryCode));
        } catch (IllegalArgumentException e) {
            throw new EntityNotFoundException("Invalid category code: " + categoryCode);
        }
    }
}
