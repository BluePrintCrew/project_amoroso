package org.example.amorosobackend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.example.amorosobackend.dto.CartItemControllerDTO;
import org.example.amorosobackend.service.CartItemService;
import org.example.amorosobackend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.example.amorosobackend.dto.CartItemControllerDTO.*;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
@Tag(name = "장바구니 관련 API", description = "장바구니 관련 CRUD, 옵션 적용 지원")
public class CartItemController {

    private final CartItemService cartItemService;

    @PostMapping
    @Operation(description = "장바구니에 추가 (옵션 포함 가능)")
    public ResponseEntity<CartItemResponseDTO> addToCart(@RequestBody CartItemRequestDTO request) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        CartItemResponseDTO responseDTO = cartItemService.addToCart(email, request);
        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping
    @Operation(description = "장바구니 조회")
    public ResponseEntity<List<CartItemResponseDTO>> getCartItems() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<CartItemResponseDTO> cartItems = cartItemService.getCartItems(email);
        return ResponseEntity.ok(cartItems);
    }

    @PutMapping("/{cartItemId}")
    @Operation(description = "장바구니 아이템 수량 변경")
    public ResponseEntity<CartItemResponseDTO> updateCartItemQuantity(@PathVariable Long cartItemId, @RequestBody CartItemRequestDTO request) {
        CartItemResponseDTO responseDTO = cartItemService.updateCartItemQuantity(cartItemId, request.getQuantity());
        return ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/{cartItemId}")
    @Operation(description = "장바구니 아이템 삭제")
    public ResponseEntity<Void> removeCartItem(@PathVariable Long cartItemId) {
        cartItemService.removeCartItem(cartItemId);
        return ResponseEntity.noContent().build();
    }
}
