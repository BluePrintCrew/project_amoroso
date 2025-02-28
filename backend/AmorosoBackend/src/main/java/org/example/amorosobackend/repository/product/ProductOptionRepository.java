package org.example.amorosobackend.repository.product;

import org.example.amorosobackend.domain.product.Product;
import org.example.amorosobackend.domain.product.ProductOption;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductOptionRepository extends JpaRepository<ProductOption, Long> {



    void deleteAllByProduct(Product product);
}
