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
        // �׽�Ʈ�� �Ǹ��� ����
        seller = User.builder()
                .email("seller@test.com")
                .role("ROLE_SELLER")
                .build();
        
        sellerInfo = Seller.builder()
                .user(seller)
                .brandName("Test Brand")
                .build();

        // �ٸ� �Ǹ��� ����
        otherSeller = User.builder()
                .email("other@test.com")
                .role("ROLE_SELLER")
                .build();
        
        otherSellerInfo = Seller.builder()
                .user(otherSeller)
                .brandName("Other Brand")
                .build();

        // �׽�Ʈ�� �ֹ� ����
        order = Order.builder()
                .orderStatus(OrderStatus.PAYMENT_COMPLETED)
                .seller(sellerInfo)
                .build();

        // SecurityContext ���� ����
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    @DisplayName("�Ǹ��ڰ� �ڽ��� �ֹ��� ��ۿϷ� ó���� �� �ִ�")
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
    @DisplayName("�ٸ� �Ǹ����� �ֹ��� ��ۿϷ� ó���� �� ����")
    void markOrderAsDelivered_WrongSeller() {
        // given
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn("other@test.com");
        when(userRepository.findByEmail("other@test.com")).thenReturn(Optional.of(otherSeller));
        when(sellerRepository.findByUser(otherSeller)).thenReturn(Optional.of(otherSellerInfo));
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        // when & then
        assertThrows(RuntimeException.class, () -> sellerService.markOrderAsDelivered(1L),
                "�ش� �ֹ��� ���� ������ �����ϴ�.");
    }

    @Test
    @DisplayName("�����Ϸ� ���°� �ƴ� �ֹ��� ��ۿϷ� ó���� �� ����")
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
                "������ �Ϸ�� �ֹ��� ��� �Ϸ� ó���� �� �ֽ��ϴ�.");
    }

    @Test
    @DisplayName("�������� �ʴ� �ֹ��� ��ۿϷ� ó���� �� ����")
    void markOrderAsDelivered_OrderNotFound() {
        // given
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn("seller@test.com");
        when(userRepository.findByEmail("seller@test.com")).thenReturn(Optional.of(seller));
        when(sellerRepository.findByUser(seller)).thenReturn(Optional.of(sellerInfo));
        when(orderRepository.findById(999L)).thenReturn(Optional.empty());

        // when & then
        assertThrows(RuntimeException.class, () -> sellerService.markOrderAsDelivered(999L),
                "�ֹ��� ã�� �� �����ϴ�.");
    }
} 