//package org.example.amorosobackend.service;
//
//import org.example.amorosobackend.domain.*;
//import org.example.amorosobackend.domain.coupon.Coupon;
//import org.example.amorosobackend.domain.coupon.UserCoupon;
//import org.example.amorosobackend.domain.product.AdditionalOption;
//import org.example.amorosobackend.domain.product.Product;
//import org.example.amorosobackend.domain.product.ProductOption;
//import org.example.amorosobackend.dto.OrderControllerDTO.OrderRequestDTO;
//import org.example.amorosobackend.dto.OrderControllerDTO.OrderItemRequestDTO;
//import org.example.amorosobackend.dto.OrderControllerDTO.OrderResponseDTO;
//import org.example.amorosobackend.enums.ElevatorType;
//import org.example.amorosobackend.enums.OrderStatus;
//import org.example.amorosobackend.enums.PaymentStatus;
//import org.example.amorosobackend.repository.*;
//import org.example.amorosobackend.repository.product.ProductRepository;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.*;
//import org.mockito.junit.jupiter.MockitoExtension;
//import org.springframework.test.util.ReflectionTestUtils;
//
//import java.util.*;
//
//import static org.assertj.core.api.Assertions.*;
//import static org.mockito.Mockito.*;
//
//@ExtendWith(MockitoExtension.class)
//class OrderServiceTest {
//
//    @Mock
//    private OrderRepository orderRepository;
//    @Mock
//    private UserRepository userRepository;
//    @Mock
//    private ProductRepository productRepository;
//    @Mock
//    private UserCouponRepository userCouponRepository;
//    @Mock
//    private OrderItemRepository orderItemRepository;
//    @Mock
//    private ShipmentRepository shipmentRepository;
//    @Mock
//    private UserAddressRepository userAddressRepository;
//    @Mock
//    private ReviewRepository reviewRepository;
//
//    @InjectMocks
//    private OrderService orderService;
//
//    private User mockUser;
//    private Seller mockSeller;
//    private Product mockProduct;
//    private AdditionalOption mockAddOpt;
//    private ProductOption mockProdOpt;
//    private UserAddress mockAddress;
//
//    @BeforeEach
//    void setUp() {
//        // User setup
//        mockUser = User.builder()
//                .email("test@example.com")
//                .name("testUser")
//                .password("password123")
//                .role("ROLE_USER")
//                .build();
//        ReflectionTestUtils.setField(mockUser, "userId", 1L);
//        when(userRepository.findByEmail("test@example.com"))
//                .thenReturn(Optional.of(mockUser));
//
//        // Seller setup
//        mockSeller = Seller.builder()
//                .brandName("TestBrand")
//                .build();
//        ReflectionTestUtils.setField(mockSeller, "id", 1L);
//
//        // Product setup
//        mockProduct = Product.builder()
//                .productName("Test Product")
//                .marketPrice(100000)
//                .discountPrice(90000)
//                .seller(mockSeller)
//                .mainImageUri("http://example.com/image.jpg")
//                .build();
//        ReflectionTestUtils.setField(mockProduct, "productId", 1L);
//
//        // Additional Option setup
//        mockAddOpt = AdditionalOption.builder()
//                .product(mockProduct)
//                .optionName("Installation")
//                .additionalPrice(10000)
//                .build();
//        ReflectionTestUtils.setField(mockAddOpt, "id", 1L);
//        mockProduct.setAdditionalOptions(List.of(mockAddOpt));
//
//        // Product Option setup
//        mockProdOpt = ProductOption.builder()
//                .product(mockProduct)
//                .optionName("Size")
//                .optionValues(List.of("Small", "Medium", "Large"))
//                .build();
//        ReflectionTestUtils.setField(mockProdOpt, "id", 1L);
//        mockProduct.setProductOptions(List.of(mockProdOpt));
//
//        when(productRepository.findById(1L))
//                .thenReturn(Optional.of(mockProduct));
//
//        // Address setup
//        mockAddress = UserAddress.builder()
//                .address("Test Street")
//                .detailAddress("Apt 123")
//                .postalCode("12345")
//                .recipientName("John Doe")
//                .phoneNumber("010-1234-5678")
//                .build();
//        ReflectionTestUtils.setField(mockAddress, "addressId", 1L);
//        when(userAddressRepository.findById(1L))
//                .thenReturn(Optional.of(mockAddress));
//
//        // UserCoupon setup
//        UserCoupon mockUserCoupon = mock(UserCoupon.class);
//        Coupon coupon = Coupon.builder()
//                .discountType(Coupon.DiscountType.FIXED)
//                .discountValue(5000)
//                .minimumOrderAmount(50000)
//                .isActive(true)
//                .build();
//        when(mockUserCoupon.getCoupon()).thenReturn(coupon);
//        when(mockUserCoupon.isUsed()).thenReturn(false);
//        when(userCouponRepository.findById(1L))
//                .thenReturn(Optional.of(mockUserCoupon));
//
//        // OrderRepository setup for save operations
//        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
//            Order order = invocation.getArgument(0);
//            if (order.getOrderId() == null) {
//                ReflectionTestUtils.setField(order, "orderId", 1L);
//            }
//            return order;
//        });
//
//        // OrderItemRepository setup
//        when(orderItemRepository.save(any(OrderItem.class))).thenAnswer(invocation -> {
//            OrderItem item = invocation.getArgument(0);
//            if (item.getOrderItemId() == null) {
//                ReflectionTestUtils.setField(item, "orderItemId", 1L);
//            }
//            return item;
//        });
//
//        // ShipmentRepository setup
//        when(shipmentRepository.save(any(Shipment.class))).thenAnswer(invocation -> {
//            Shipment shipment = invocation.getArgument(0);
//            if (shipment.getShipmentId() == null) {
//                ReflectionTestUtils.setField(shipment, "shipmentId", 1L);
//            }
//            return shipment;
//        });
//    }
//
//    @Test
//    void createOrder_BasicOrder_Success() {
//        // Given
//        OrderItemRequestDTO itemDto = new OrderItemRequestDTO();
//        itemDto.setProductId(1L);
//        itemDto.setQuantity(2);
//        itemDto.setUserCouponId(1L);
//        itemDto.setAdditionalOptionId(1L);
//        itemDto.setProductOptionId(1L);
//        itemDto.setSelectedOptionValue("Medium");
//
//        OrderRequestDTO req = new OrderRequestDTO();
//        req.setUserAddressId(1L);
//        req.setDeliveryRequest("Please call before delivery");
//        req.setElevatorType(ElevatorType.EIGHT_TO_TEN.name());
//        req.setFreeLoweringService(true);
//        req.setProductInstallationAgreement(true);
//        req.setVehicleEntryPossible(true);
//        req.setOrderItems(List.of(itemDto));
//
//        // When
//        List<OrderResponseDTO> result = orderService.createOrder("test@example.com", req);
//
//        // Then
//        assertThat(result).hasSize(1);
//        OrderResponseDTO responseDTO = result.get(0);
//
//        // Verify order details
//        Order savedOrder = orderRepository.findById(1L).orElse(null);
//        assertThat(savedOrder).isNotNull();
//        assertThat(savedOrder.getOrderStatus()).isEqualTo(OrderStatus.PAYMENT_PENDING);
//        assertThat(savedOrder.getPaymentStatus()).isEqualTo(PaymentStatus.WAITING);
//        assertThat(savedOrder.getElevatorType()).isEqualTo(ElevatorType.EIGHT_TO_TEN);
//        assertThat(savedOrder.getFreeLoweringService()).isTrue();
//        assertThat(savedOrder.getVehicleEntryPossible()).isTrue();
//        assertThat(savedOrder.getProductInstallationAgreement()).isTrue();
//
//        // Verify response
//        assertThat(responseDTO.getOrderId()).isEqualTo(1L);
//        assertThat(responseDTO.getElevatorType()).isEqualTo(ElevatorType.EIGHT_TO_TEN.name());
//        assertThat(responseDTO.getFreeLoweringService()).isTrue();
//
//        // Verify repository calls
//        verify(orderRepository, times(2)).save(any(Order.class));
//        verify(shipmentRepository).save(any(Shipment.class));
//    }
//
//    @Test
//    void createOrder_InvalidUser_ThrowsException() {
//        // Given
//        OrderRequestDTO req = new OrderRequestDTO();
//        req.setUserAddressId(1L);
//
//        // When & Then
//        assertThatThrownBy(() -> orderService.createOrder("invalid@example.com", req))
//                .isInstanceOf(IllegalArgumentException.class)
//                .hasMessage("사용자를 찾을 수 없습니다.");
//    }
//
//    @Test
//    void createOrder_InvalidAddress_ThrowsException() {
//        // Given
//        OrderRequestDTO req = new OrderRequestDTO();
//        req.setUserAddressId(999L);
//
//        // When & Then
//        assertThatThrownBy(() -> orderService.createOrder("test@example.com", req))
//                .isInstanceOf(IllegalArgumentException.class)
//                .hasMessage("배송지를 찾을 수 없습니다");
//    }
//
//    @Test
//    void createOrder_WithInvalidCoupon_ThrowsException() {
//        // Given
//        OrderItemRequestDTO itemDto = new OrderItemRequestDTO();
//        itemDto.setProductId(1L);
//        itemDto.setQuantity(1);
//        itemDto.setUserCouponId(999L);
//
//        OrderRequestDTO req = new OrderRequestDTO();
//        req.setUserAddressId(1L);
//        req.setOrderItems(List.of(itemDto));
//
//        // When & Then
//        assertThatThrownBy(() -> orderService.createOrder("test@example.com", req))
//                .isInstanceOf(IllegalArgumentException.class)
//                .hasMessage("유효하지 않은 쿠폰입니다.");
//    }
//}
//
//
//
