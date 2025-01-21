package org.example.amorosobackend.repository;


import org.example.amorosobackend.domain.Product;
import org.example.amorosobackend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

}
