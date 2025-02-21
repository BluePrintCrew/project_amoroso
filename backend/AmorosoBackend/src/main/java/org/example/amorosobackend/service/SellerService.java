package org.example.amorosobackend.service;

import lombok.RequiredArgsConstructor;
import org.example.amorosobackend.dto.SellerDTO;
import org.example.amorosobackend.enums.OrderStatus;
import org.example.amorosobackend.enums.PaymentStatus;
import org.example.amorosobackend.repository.OrderRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class SellerService {

    private final OrderRepository orderRepository;

    public SellerDTO.SellerStatsResponse getSellerStats() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long sellerId = getSellerIdByEmail(email);

        Long paidOrders = orderRepository.countPaidOrdersBySeller(sellerId, PaymentStatus.COMPLETED, OrderStatus.PAYMENT_COMPLETED);
        Long readyShipments = orderRepository.countOrdersBySellerAndStatus(sellerId, OrderStatus.PAYMENT_COMPLETED);
        Long inTransitOrders = orderRepository.countOrdersBySellerAndStatus(sellerId, OrderStatus.DELIVERED);

        return new SellerDTO.SellerStatsResponse(paidOrders, readyShipments, inTransitOrders);
    }
    private Long getSellerIdByEmail(String email) {
        // Seller 엔티티를 통해 이메일 기반으로 sellerId 조회하는 로직 구현 필요
        return 1L; // 예제이므로 1L을 반환 (실제 구현 시 Repository 활용)
    }
}
