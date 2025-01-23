package org.example.amorosobackend.service;

import lombok.AllArgsConstructor;
import org.example.amorosobackend.domain.Category;
import org.example.amorosobackend.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
@AllArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public Category findByCategoryCode(String categoryCode){
        Category category = categoryRepository.findByCategoryCode(categoryCode)
                .orElseThrow(() -> new NullPointerException("invalid code, there is not Category"));

        return category;

    }
}
