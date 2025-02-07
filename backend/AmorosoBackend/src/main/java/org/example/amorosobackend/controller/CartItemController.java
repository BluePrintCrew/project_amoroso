package org.example.amorosobackend.controller;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.example.amorosobackend.dto.CartItemControllerDTO;
import org.example.amorosobackend.service.CartItemService;
import org.example.amorosobackend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartItemController {

    private final CartItemService cartItemService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<CartItemControllerDTO.CartItemResponseDTO> addToCart(@RequestBody CartItemControllerDTO.CartItemRequestDTO request) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        CartItemControllerDTO.CartItemResponseDTO responseDTO = cartItemService.addToCart(email,request);
        return ResponseEntity.ok(responseDTO);
    }



}
