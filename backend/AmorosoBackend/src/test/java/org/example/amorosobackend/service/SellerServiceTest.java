package org.example.amorosobackend.service;

import org.example.amorosobackend.domain.Order;
import org.example.amorosobackend.domain.Seller;
import org.example.amorosobackend.domain.User;
import org.example.amorosobackend.enums.OrderStatus;
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

    @BeforeEach
    void setUp() {
        // 테스트용 판매자 설정
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

        // 테스트용 주문 설정
        order = Order.builder()
                .orderStatus(OrderStatus.PAYMENT_COMPLETED)
                .seller(sellerInfo)
                .build();

        // SecurityContext 모의 설정
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    @DisplayName("판매자가 자신의 주문을 배송완료 처리할 수 있다")
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
    @DisplayName("다른 판매자의 주문을 배송완료 처리할 수 없다")
    void markOrderAsDelivered_WrongSeller() {
        // given
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn("other@test.com");
        when(userRepository.findByEmail("other@test.com")).thenReturn(Optional.of(otherSeller));
        when(sellerRepository.findByUser(otherSeller)).thenReturn(Optional.of(otherSellerInfo));
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        // when & then
        assertThrows(RuntimeException.class, () -> sellerService.markOrderAsDelivered(1L),
                "해당 주문에 대한 권한이 없습니다.");
    }

    @Test
    @DisplayName("결제완료 상태가 아닌 주문은 배송완료 처리할 수 없다")
    void markOrderAsDelivered_WrongOrderStatus() {
        // given
        Order pendingOrder = Order.builder()
                .orderStatus(OrderStatus.PAYMENT_PENDING)
                .seller(sellerInfo)
                .build();

        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn("seller@test.com");
        when(userRepository.findByEmail("seller@test.com")).thenReturn(Optional.of(seller));
        when(sellerRepository.findByUser(seller)).thenReturn(Optional.of(sellerInfo));
        when(orderRepository.findById(1L)).thenReturn(Optional.of(pendingOrder));

        // when & then
        assertThrows(RuntimeException.class, () -> sellerService.markOrderAsDelivered(1L),
                "결제가 완료된 주문만 배송 완료 처리할 수 있습니다.");
    }

    @Test
    @DisplayName("존재하지 않는 주문은 배송완료 처리할 수 없다")
    void markOrderAsDelivered_OrderNotFound() {
        // given
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn("seller@test.com");
        when(userRepository.findByEmail("seller@test.com")).thenReturn(Optional.of(seller));
        when(sellerRepository.findByUser(seller)).thenReturn(Optional.of(sellerInfo));
        when(orderRepository.findById(999L)).thenReturn(Optional.empty());

        // when & then
        assertThrows(RuntimeException.class, () -> sellerService.markOrderAsDelivered(999L),
                "주문을 찾을 수 없습니다.");
    }
} 