package org.example.amorosobackend.service;

import org.example.amorosobackend.domain.*;
import org.example.amorosobackend.domain.coupon.Coupon;
import org.example.amorosobackend.domain.coupon.UserCoupon;
import org.example.amorosobackend.domain.product.AdditionalOption;
import org.example.amorosobackend.domain.product.Product;
import org.example.amorosobackend.domain.product.ProductOption;
import org.example.amorosobackend.dto.OrderControllerDTO.OrderRequestDTO;
import org.example.amorosobackend.dto.OrderControllerDTO.OrderItemRequestDTO;
import org.example.amorosobackend.dto.OrderControllerDTO.OrderResponseDTO;
import org.example.amorosobackend.enums.ElevatorType;
import org.example.amorosobackend.enums.OrderStatus;
import org.example.amorosobackend.enums.PaymentStatus;
import org.example.amorosobackend.repository.*;
import org.example.amorosobackend.repository.product.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.*;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class OrderServiceTest {

    @InjectMocks
    private OrderService orderService;

    @Mock private OrderRepository orderRepository;
    @Mock private UserRepository userRepository;
    @Mock private ProductRepository productRepository;
    @Mock private UserCouponRepository userCouponRepository;
    @Mock private OrderItemRepository orderItemRepository;
    @Mock private ShipmentRepository shipmentRepository;
    @Mock private UserAddressRepository userAddressRepository;

    private User mockUser;
    private Seller mockSeller;
    private Product mockProduct;
    private AdditionalOption mockAddOpt;
    private ProductOption mockProdOpt;
    private UserAddress mockAddress;

    @BeforeEach
    void setUp() {
        // --- 공통 데이터 세팅 ---
        mockUser = User.builder().email("u@e.com").build();
        when(userRepository.findByEmail("u@e.com"))
                .thenReturn(Optional.of(mockUser));

        mockSeller = Seller.builder().brandName("S1").build();
        mockProduct = Product.builder()
                .productName("P1")
                .marketPrice(10000)
                .discountPrice(null)
                .seller(mockSeller)
                .mainImageUri("img://p1")
                .build();
        ReflectionTestUtils.setField(mockProduct, "productId", 100L);

        // AdditionalOption
        mockAddOpt = AdditionalOption.builder()
                .product(mockProduct)
                .optionName("Wrap")
                .additionalPrice(1_000)
                .build();
        ReflectionTestUtils.setField(mockAddOpt, "id", 500L);

        mockProduct.setAdditionalOptions(List.of(mockAddOpt));

        // ProductOption
        mockProdOpt = ProductOption.builder()
                .product(mockProduct)
                .optionName("Color")
                .optionValues(List.of("Red","Blue"))
                .build();
        ReflectionTestUtils.setField(mockProdOpt, "id", 600L);
        mockProduct.setProductOptions(List.of(mockProdOpt));

        when(productRepository.findById(100L))
                .thenReturn(Optional.of(mockProduct));

        // UserCoupon (optional)
        UserCoupon mockUserCoupon = Mockito.mock(UserCoupon.class);
        Coupon coupon = Coupon.builder()
                .discountType(Coupon.DiscountType.FIXED)
                .discountValue(2_000)
                .minimumOrderAmount(0)
                .isActive(true)
                .build();
        when(mockUserCoupon.getCoupon()).thenReturn(coupon);
        when(userCouponRepository.findById(700L))
                .thenReturn(Optional.of(mockUserCoupon));

        // Address
        mockAddress = UserAddress.builder().addressLine("Addr").build();
        when(userAddressRepository.findById(900L))
                .thenReturn(Optional.of(mockAddress));
    }

    @Test
    void createOrder_withOptions_createsOrderAndItems() {
        // --- given ---
        OrderItemRequestDTO itemDto = new OrderItemRequestDTO();
        itemDto.setProductId(100L);
        itemDto.setQuantity(2);
        itemDto.setUserCouponId(700L);
        itemDto.setAdditionalOptionId(500L);
        itemDto.setProductOptionId(600L);
        itemDto.setSelectedOptionValue("Red");

        OrderRequestDTO req = new OrderRequestDTO();
        req.setUserAddressId(900L);
        req.setDeliveryRequest("Leave at door");
        req.setElevatorType(ElevatorType.HYDRAULIC.name());
        req.setFreeLoweringService(true);
        req.setProductInstallationAgreement(false);
        req.setVehicleEntryPossible(true);
        req.setOrderItems(List.of(itemDto));

        // capture saved Order and Shipment
        ArgumentCaptor<Order> orderCaptor = ArgumentCaptor.forClass(Order.class);
        when(orderRepository.save(orderCaptor.capture()))
                .thenAnswer(inv -> {
                    Order o = inv.getArgument(0);
                    ReflectionTestUtils.setField(o, "orderId", 1L);
                    return o;
                });
        doAnswer(inv -> {
            Shipment s = inv.getArgument(0);
            ReflectionTestUtils.setField(s, "shipmentId", 2L);
            return s;
        }).when(shipmentRepository).save(any());

        // --- when ---
        List<OrderResponseDTO> result = orderService.createOrder("u@e.com", req);

        // --- then ---
        assertThat(result).hasSize(1);
        OrderResponseDTO dto = result.get(0);

        // Order 필드 검증
        Order saved = orderCaptor.getValue();
        assertThat(saved.getOrderId()).isEqualTo(1L);
        assertThat(saved.getUser()).isSameAs(mockUser);
        assertThat(saved.getSeller()).isSameAs(mockSeller);
        assertThat(saved.getOrderStatus()).isEqualTo(OrderStatus.PAYMENT_PENDING);
        assertThat(saved.getPaymentStatus()).isEqualTo(PaymentStatus.WAITING);
        assertThat(saved.getFreeLoweringService()).isTrue();
        assertThat(saved.getVehicleEntryPossible()).isTrue();
        assertThat(saved.getProductInstallationAgreement()).isFalse();
        assertThat(saved.getElevatorType()).isEqualTo(ElevatorType.HYDRAULIC);

        // 총 가격 = (marketPrice 10_000 - coupon 2_000 + addOpt 1_000) * qty 2
        int expectedPerItem = (10_000 - 2_000) + 1_000;
        assertThat(saved.getTotalPrice()).isEqualTo(expectedPerItem * 2);

        // DTO 검증
        assertThat(dto.getOrderId()).isEqualTo(1L);
        assertThat(dto.getTotalPrice()).isEqualTo(expectedPerItem * 2);
        assertThat(dto.getFreeLoweringService()).isTrue();
        assertThat(dto.getElevatorType()).isEqualTo(ElevatorType.HYDRAULIC.name());
        assertThat(dto.getOrderItems()).hasSize(1);

        var itemDtoResp = dto.getOrderItems().get(0);
        // 옵션 포함한 가격 검증: finalPrice = netPrice + addOpt * qty
        assertThat(itemDtoResp.getFinalPrice())
                .isEqualTo((10_000 - 2_000) + 1_000 * 2);

        assertThat(itemDtoResp.getAdditionalOptionId()).isEqualTo(500L);
        assertThat(itemDtoResp.getProductOptionId()).isEqualTo(600L);
        assertThat(itemDtoResp.getSelectedOptionValue()).isEqualTo("Red");

        // 레포지토리 호출 검증
        verify(orderRepository, times(2)).save(any()); // 한 번은 생성, 한 번은 setTotalPrice 저장
        verify(shipmentRepository).save(any());
    }
}
