package org.example.amorosobackend.service;

import org.example.amorosobackend.domain.Order;
import org.example.amorosobackend.domain.PaymentGroup;
import org.example.amorosobackend.domain.Seller;
import org.example.amorosobackend.domain.User;
import org.example.amorosobackend.enums.OrderStatus;
import org.example.amorosobackend.enums.PaymentStatus;
import org.example.amorosobackend.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SellerServiceTest {

    @Mock
    private OrderRepository orderRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private SellerRepository sellerRepository;
    @Mock
    private SecurityContext securityContext;
    @Mock
    private Authentication authentication;

    @InjectMocks
    private SellerService sellerService;

    private User seller;
    private User otherSeller;
    private Seller sellerInfo;
    private Seller otherSellerInfo;
    private Order order;
    private PaymentGroup paymentGroup;

    @BeforeEach
    void setUp() {

        seller = User.builder()
                .email("seller@test.com")
                .role("ROLE_SELLER")
                .build();
        
        sellerInfo = Seller.builder()
                .user(seller)
                .brandName("Test Brand")
                .build();

        // 다른 판매자 설정
        otherSeller = User.builder()
                .email("other@test.com")
                .role("ROLE_SELLER")
                .build();
        
        otherSellerInfo = Seller.builder()
                .user(otherSeller)
                .brandName("Other Brand")
                .build();

        // PaymentGroup 설정
        paymentGroup = PaymentGroup.builder()
                .paymentStatus(PaymentStatus.COMPLETED)
                .build();

        order = Order.builder()
                .orderStatus(OrderStatus.PAYMENT_COMPLETED)
                .seller(sellerInfo)
                .build();
        
        // PaymentGroup 설정 (Setter 사용)
        order.setPaymentGroup(paymentGroup);

        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    @DisplayName("정상적인 주문 배송완료 처리 성공")
    void markOrderAsDelivered_Success() {
        // given
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn("seller@test.com");
        when(userRepository.findByEmail("seller@test.com")).thenReturn(Optional.of(seller));
        when(sellerRepository.findByUser(seller)).thenReturn(Optional.of(sellerInfo));
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        // when
        sellerService.markOrderAsDelivered(1L);

        // then
        assertEquals(OrderStatus.DELIVERED, order.getOrderStatus());
        verify(orderRepository).save(order);
    }

    @Test
    @DisplayName("다른 판매자가 주문을 배송완료 처리하려고 할 때 예외 발생")
    void markOrderAsDelivered_WrongSeller() {
        // given
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn("other@test.com");
        when(userRepository.findByEmail("other@test.com")).thenReturn(Optional.of(otherSeller));
        when(sellerRepository.findByUser(otherSeller)).thenReturn(Optional.of(otherSellerInfo));
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        // when & then
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> sellerService.markOrderAsDelivered(1L));
        assertEquals("해당 주문에 대한 권한이 없습니다.", exception.getMessage());
    }

    @Test
    @DisplayName("결제 완료되지 않은 주문을 배송완료 처리하려고 할 때 예외 발생")
    void markOrderAsDelivered_WrongOrderStatus() {
        // given
        PaymentGroup pendingPaymentGroup = PaymentGroup.builder()
                .paymentStatus(PaymentStatus.WAITING)
                .build();
        
        Order pendingOrder = Order.builder()
                .orderStatus(OrderStatus.PAYMENT_PENDING)
                .seller(sellerInfo)
                .build();
        
        // PaymentGroup 설정 (Setter 사용)
        pendingOrder.setPaymentGroup(pendingPaymentGroup);

        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn("seller@test.com");
        when(userRepository.findByEmail("seller@test.com")).thenReturn(Optional.of(seller));
        when(sellerRepository.findByUser(seller)).thenReturn(Optional.of(sellerInfo));
        when(orderRepository.findById(1L)).thenReturn(Optional.of(pendingOrder));

        // when & then
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> sellerService.markOrderAsDelivered(1L));
        assertEquals("결제가 완료된 주문만 배송 완료 처리할 수 있습니다.", exception.getMessage());
    }

    @Test
    @DisplayName("존재하지 않는 주문을 배송완료 처리하려고 할 때 예외 발생")
    void markOrderAsDelivered_OrderNotFound() {
        // given
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn("seller@test.com");
        when(userRepository.findByEmail("seller@test.com")).thenReturn(Optional.of(seller));
        when(sellerRepository.findByUser(seller)).thenReturn(Optional.of(sellerInfo));
        when(orderRepository.findById(999L)).thenReturn(Optional.empty());

        // when & then
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> sellerService.markOrderAsDelivered(999L));
        assertEquals("주문을 찾을 수 없습니다.", exception.getMessage());
    }
} 