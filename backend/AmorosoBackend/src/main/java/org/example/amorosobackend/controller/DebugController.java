package org.example.amorosobackend.controller;

import lombok.RequiredArgsConstructor;
import org.example.amorosobackend.domain.*;
import org.example.amorosobackend.domain.review.Review;
import org.example.amorosobackend.repository.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/debug")
@RequiredArgsConstructor
public class DebugController {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ReviewRepository reviewRepository;
    private final PaymentGroupRepository paymentGroupRepository;

    @GetMapping("/data-status")
    public Map<String, Object> getDataStatus() {
        Map<String, Object> result = new HashMap<>();
        
        // 사용자 수
        long userCount = userRepository.count();
        result.put("userCount", userCount);
        
        // 주문 수
        long orderCount = orderRepository.count();
        result.put("orderCount", orderCount);
        
        // 주문 아이템 수  
        long orderItemCount = orderItemRepository.count();
        result.put("orderItemCount", orderItemCount);
        
        // 리뷰 수
        long reviewCount = reviewRepository.count();
        result.put("reviewCount", reviewCount);
        
        // 결제 그룹 수
        long paymentGroupCount = paymentGroupRepository.count();
        result.put("paymentGroupCount", paymentGroupCount);
        
        return result;
    }
    
    @GetMapping("/orders")
    public List<Map<String, Object>> getOrders() {
        return orderRepository.findAll().stream().map(order -> {
            Map<String, Object> orderInfo = new HashMap<>();
            orderInfo.put("orderId", order.getOrderId());
            orderInfo.put("orderCode", order.getOrderCode());
            orderInfo.put("userEmail", order.getUser().getEmail());
            orderInfo.put("paymentStatus", order.getPaymentStatus());
            orderInfo.put("orderStatus", order.getOrderStatus());
            orderInfo.put("totalPrice", order.getTotalPrice());
            orderInfo.put("hasPaymentGroup", order.getPaymentGroup() != null);
            if (order.getPaymentGroup() != null) {
                orderInfo.put("paymentGroupStatus", order.getPaymentGroup().getPaymentStatus());
            }
            orderInfo.put("orderItemCount", order.getOrderItems().size());
            return orderInfo;
        }).toList();
    }
    
    @GetMapping("/order-items")
    public List<Map<String, Object>> getOrderItems() {
        return orderItemRepository.findAll().stream().map(item -> {
            Map<String, Object> itemInfo = new HashMap<>();
            itemInfo.put("orderItemId", item.getOrderItemId());
            itemInfo.put("productId", item.getProduct().getProductId());
            itemInfo.put("productName", item.getProduct().getProductName());
            itemInfo.put("quantity", item.getQuantity());
            itemInfo.put("finalPrice", item.getFinalPrice());
            itemInfo.put("orderId", item.getOrder().getOrderId());
            itemInfo.put("userEmail", item.getOrder().getUser().getEmail());
            itemInfo.put("orderPaymentStatus", item.getOrder().getPaymentStatus());
            return itemInfo;
        }).toList();
    }
    
    @GetMapping("/reviews")
    public List<Map<String, Object>> getReviews() {
        return reviewRepository.findAll().stream().map(review -> {
            Map<String, Object> reviewInfo = new HashMap<>();
            reviewInfo.put("reviewId", review.getReviewId());
            reviewInfo.put("userId", review.getUser().getUserId());
            reviewInfo.put("userEmail", review.getUser().getEmail());
            reviewInfo.put("productId", review.getProduct().getProductId());
            reviewInfo.put("productName", review.getProduct().getProductName());
            reviewInfo.put("rating", review.getRating());
            reviewInfo.put("content", review.getContent());
            return reviewInfo;
        }).toList();
    }
}