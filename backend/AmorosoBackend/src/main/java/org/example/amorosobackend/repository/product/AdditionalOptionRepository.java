package org.example.amorosobackend.repository.product;

import org.example.amorosobackend.domain.product.AdditionalOption;
import org.example.amorosobackend.domain.product.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdditionalOptionRepository extends JpaRepository<AdditionalOption, Long> {
    void deleteAllByProduct(Product product);
}
