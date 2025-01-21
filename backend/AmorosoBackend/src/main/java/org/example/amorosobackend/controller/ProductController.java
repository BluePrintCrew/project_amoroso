package org.example.amorosobackend.controller;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.example.amorosobackend.dto.ProductControllerDTO;
import org.example.amorosobackend.repository.ProductRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductRepository repository;

    @GetMapping("/")
    public List<ProductControllerDTO.ProductListResponse> getProducts(
             @RequestParam(required = false) Integer categoryId
            ,@RequestParam(required = false) Integer page
            ,@RequestParam(required = false)String sortBy
            ,@RequestParam(required = false)String order ) {


    }

}
