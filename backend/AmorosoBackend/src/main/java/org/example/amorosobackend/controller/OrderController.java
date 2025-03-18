package org.example.amorosobackend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.example.amorosobackend.dto.OrderControllerDTO;
import org.example.amorosobackend.dto.ReviewDTO;
import org.example.amorosobackend.service.OrderService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

import static org.example.amorosobackend.dto.OrderControllerDTO.*;

@RestController
@RequestMapping("api/v1/orders")
@RequiredArgsConstructor
@Tag(name = "주문 API" , description = "주문을 해보자")
public class OrderController {

    private final OrderService orderService;

    // (현재 로그인한 사용자 기준)
    @PostMapping
    @Operation(description = "현재 로그인한 사용자의 주문 생성" +
            "ElevatorType은 무조건" +
            "ONE_TO_SEVEN,\n" +
            "EIGHT_TO_TEN,\n" +
            "ELEVEN_OR_MORE,\n" +
            "NONE" +
            "이중 하나로 설정하여 전달한다.")
    public ResponseEntity<OrderResponseDTO> createOrder(@RequestBody OrderControllerDTO.OrderRequestDTO requestDTO) {
        String email = getCurrentUserEmail();
        OrderResponseDTO createdOrder = orderService.createOrder(email, requestDTO);
        return ResponseEntity.ok(createdOrder);
    }

    // 특정 주문 조회
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponseDTO> getOrder(@PathVariable Long orderId) {
        String email = getCurrentUserEmail();
        OrderResponseDTO order = orderService.getOrderById(email, orderId);
        return ResponseEntity.ok(order);
    }

    // 사용자의 모든 주문 조회
    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderResponseDTO>> getUserOrders() {
        String email = getCurrentUserEmail();
        List<OrderResponseDTO> orders = orderService.getOrdersByUserEmail(email);
        return ResponseEntity.ok(orders);
    }

    //  주문 취소
    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> cancelOrder(@PathVariable Long orderId) {
        String email = getCurrentUserEmail();
        orderService.cancelOrder(email, orderId);
        return ResponseEntity.noContent().build();
    }

//    // 주문 상태 변경 (관리자만 가능하도록 설정 가능)
//    @PatchMapping("/{orderId}/status")
//    public ResponseEntity<OrderResponseDTO> updateOrderStatus(@PathVariable Long orderId,
//                                                              @RequestParam String status) {
//        OrderResponseDTO updatedOrder = orderService.updateOrderStatus(orderId, status);
//        return ResponseEntity.ok(updatedOrder);
//    }

    //현재 로그인한 사용자 이메일 가져오기
    // JwtAuthenticationFilter.class 에서 SecurityContext에 저장하는 과정에 왜 Email이 나오는지 로직이 나와있음
    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();  // SecurityContext에서 email 가져오기
    }

    @GetMapping("/reviewable-items")
    @Operation(description = "사용자가 주문한 모든 아이템 중 리뷰를 작성할 수 있는 상품 조회 (최신순 페이징)")
    public ResponseEntity<Page<ReviewDTO.ReviewableProduct>> getAllReviewableProducts(
            @PageableDefault(size = 10, sort = "orderDate", direction = Sort.Direction.DESC) Pageable pageable) {

        String email = getCurrentUserEmail();
        Page<ReviewDTO.ReviewableProduct> reviewableProducts = orderService.getAllReviewableProducts(email, pageable);
        return ResponseEntity.ok(reviewableProducts);
    }

}