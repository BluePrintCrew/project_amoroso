package org.example.amorosobackend.service;

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

    public Category findByCategoryCode(String categoryCode){
        CategoryCode categoryCode1 = fromCode(categoryCode);

        Category category = categoryRepository.findByCategoryCode(categoryCode1)
                .orElseThrow(() -> new NullPointerException("invalid code, there is not Category"));

        return category;

    }
}
