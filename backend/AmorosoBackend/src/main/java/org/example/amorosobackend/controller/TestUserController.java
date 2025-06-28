package org.example.amorosobackend.controller;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.List;
import java.util.ArrayList;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.example.amorosobackend.domain.*;
import org.example.amorosobackend.domain.category.Category;
import org.example.amorosobackend.domain.product.Product;
import org.example.amorosobackend.enums.*;
import org.example.amorosobackend.repository.*;
import org.example.amorosobackend.repository.product.ProductRepository;
import org.example.amorosobackend.security.JwtProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/Test-User")
@Tag(name = "test 계정을 생성 및 JWT를 발급받기 위한 테스트용 API")
@RequiredArgsConstructor
public class TestUserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final SellerRepository sellerRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final UserAddressRepository userAddressRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PaymentGroupRepository paymentGroupRepository;

    private static final String TEST_EMAIL = "test@testEmail.com";
    private static final String TEST_PASSWORD = "test1234";

    @PostMapping("/setup/SELLER")
    @Operation(description = "SELLER 등급의 테스트 계정 생성 및 토큰 발급 (상품만 생성, 주문 실적 없음)")
    public ResponseEntity<?> setupTestSeller() {
        // 1. User 생성
        User testUser = userRepository.findByEmail(TEST_EMAIL).orElseGet(() -> {
            User newUser = User.builder()
                    .email(TEST_EMAIL)
                    .password(passwordEncoder.encode(TEST_PASSWORD))
                    .name("Test Seller")
                    .phoneNumber("010-1234-5678")
                    .role(UserRole.ROLE_SELLER.name())
                    .isActive(true)
                    .build();
            return userRepository.save(newUser);
        });

        // 2. Seller 생성
        Seller testSeller = sellerRepository.findByUser(testUser).orElseGet(() -> {
            Seller newSeller = Seller.builder()
                    .user(testUser)
                    .brandName("Test Brand")
                    .businessRegistrationNumber(UUID.randomUUID().toString().substring(0, 12))
                    .businessStartDate(LocalDate.of(2024, 1, 1))
                    .businessAddress("서울특별시 강남구 테헤란로 123")
                    .businessDetailAddress("4층 401호")
                    .taxationType("일반과세자")
                    .businessStatus("계속사업자")
                    .businessTel("02-1234-5678")
                    .businessEmail("business@testbrand.com")
                    .build();
            return sellerRepository.save(newSeller);
        });

        // 3. 기본 배송지 저장
        if (testUser.getAddresses().isEmpty()) {
            UserAddress address = UserAddress.builder()
                    .user(testUser)
                    .recipientName("홍길동")
                    .phoneNumber("010-1234-5678")
                    .postalCode("12345")
                    .address("서울특별시 강남구 테헤란로 123")
                    .detailAddress("101동 1001호")
                    .isDefault(true)
                    .build();

            address.setFreeLoweringService(true);
            address.setProductInstallationAgreement(true);
            address.setVehicleEntryPossible(true);
            address.setElevatorType(ElevatorType.ONE_TO_SEVEN);

            userAddressRepository.save(address);
        }



        String token = jwtProvider.createToken(TEST_EMAIL, testUser.getRole().name());
        return ResponseEntity.ok(Map.of(
                "access_token", token,
                "message", "테스트 판매자 계정 + 상품 5개 생성 완료 (주문 실적 없음)"
        ));
    }

    @PostMapping("/setup/SELLER_WITH_ORDERS")
    @Operation(description = "SELLER 등급의 테스트 계정 생성 + 테스트 상품 + 테스트 주문 실적 생성")
    public ResponseEntity<?> setupTestSellerWithOrders() {
        // 1. User 생성
        User testUser = userRepository.findByEmail(TEST_EMAIL).orElseGet(() -> {
            User newUser = User.builder()
                    .email(TEST_EMAIL)
                    .password(passwordEncoder.encode(TEST_PASSWORD))
                    .name("Test Seller")
                    .phoneNumber("010-1234-5678")
                    .role(UserRole.ROLE_SELLER.name())
                    .isActive(true)
                    .build();
            return userRepository.save(newUser);
        });

        // 2. Seller 생성
        Seller testSeller = sellerRepository.findByUser(testUser).orElseGet(() -> {
            Seller newSeller = Seller.builder()
                    .user(testUser)
                    .brandName("Test Brand")
                    .businessRegistrationNumber(UUID.randomUUID().toString().substring(0, 12))
                    .businessStartDate(LocalDate.of(2024, 1, 1))
                    .businessAddress("서울특별시 강남구 테헤란로 123")
                    .businessDetailAddress("4층 401호")
                    .taxationType("일반과세자")
                    .businessStatus("계속사업자")
                    .businessTel("02-1234-5678")
                    .businessEmail("business@testbrand.com")
                    .build();
            return sellerRepository.save(newSeller);
        });

        // 3. 기본 배송지 저장
        if (testUser.getAddresses().isEmpty()) {
            UserAddress address = UserAddress.builder()
                    .user(testUser)
                    .recipientName("홍길동")
                    .phoneNumber("010-1234-5678")
                    .postalCode("12345")
                    .address("서울특별시 강남구 테헤란로 123")
                    .detailAddress("101동 1001호")
                    .isDefault(true)
                    .build();

            address.setFreeLoweringService(true);
            address.setProductInstallationAgreement(true);
            address.setVehicleEntryPossible(true);
            address.setElevatorType(ElevatorType.ONE_TO_SEVEN);

            userAddressRepository.save(address);
        }

        // 4. 테스트 상품 생성 (5개)
        createTestProducts(testSeller);

        // 5. 테스트 주문 실적 생성 (최근 3개월간 10개 주문)
        createTestOrders(testSeller, testUser);

        String token = jwtProvider.createToken(TEST_EMAIL, testUser.getRole().name());
        return ResponseEntity.ok(Map.of(
                "access_token", token,
                "message", "테스트 판매자 계정 + 상품 5개 + 주문 실적 10개 생성 완료"
        ));
    }

    @PostMapping("/setup/USER")
    @Operation(description = "User 등급의 계정 생성 및 토큰 발급")
    public ResponseEntity<?> setupTestUser() {
        User testUser = userRepository.findByEmail(TEST_EMAIL).orElseGet(() -> {
            User newUser = User.builder()
                    .email(TEST_EMAIL)
                    .password(passwordEncoder.encode(TEST_PASSWORD))
                    .name("Test User")
                    .phoneNumber("010-1234-5678")
                    .role(UserRole.ROLE_USER.name())
                    .isActive(true)
                    .build();
            return userRepository.save(newUser);
        });

        // 기본 배송지 저장
        if (testUser.getAddresses().isEmpty()) {
            UserAddress address = UserAddress.builder()
                    .user(testUser)
                    .recipientName("홍길동")
                    .phoneNumber("010-1234-5678")
                    .postalCode("12345")
                    .address("서울특별시 강남구 테헤란로 123")
                    .detailAddress("101동 1001호")
                    .isDefault(true)
                    .build();

            address.setFreeLoweringService(true);
            address.setProductInstallationAgreement(true);
            address.setVehicleEntryPossible(true);
            address.setElevatorType(ElevatorType.ONE_TO_SEVEN);

            userAddressRepository.save(address);
        }

        String token = jwtProvider.createToken(TEST_EMAIL, testUser.getRole().name());
        return ResponseEntity.ok(Map.of("access_token", token));
    }

    @PostMapping("/setup/ADMIN")
    @Operation(description = "ADMIN 등급의 테스트 계정생성 및 토큰 발급")
    public ResponseEntity<?> setupTestAdmin() {
        if (!userRepository.existsByEmail(TEST_EMAIL)) {
            User testUser = User.builder()
                    .email(TEST_EMAIL)
                    .password(passwordEncoder.encode(TEST_PASSWORD))
                    .name("Test Admin")
                    .phoneNumber("010-1234-5678")
                    .role(UserRole.ROLE_ADMIN.name())
                    .isActive(true)
                    .build();
            userRepository.save(testUser);
        }

        User testUser = userRepository.findByEmail(TEST_EMAIL)
                .orElseThrow(() -> new RuntimeException("Test user not found"));
        String token = jwtProvider.createToken(TEST_EMAIL, testUser.getRole().name());
        return ResponseEntity.ok(Map.of("access_token", token));
    }

    @DeleteMapping("/reset")
    public ResponseEntity<?> resetTestUser() {
        userRepository.findByEmail(TEST_EMAIL).ifPresent(user -> {
            sellerRepository.findByUser(user).ifPresent(sellerRepository::delete);
            userRepository.delete(user);
        });
        return ResponseEntity.ok("Test user deleted");
    }

    /**
     * 테스트 상품 5개 생성
     */
    private void createTestProducts(Seller seller) {
        // 이미 상품이 있으면 생성하지 않음
        if (productRepository.countBySeller(seller) > 0) {
            return;
        }

        // 카테고리 조회 (없으면 생성)
        Category category = categoryRepository.findByCategoryCode(CategoryCode.LIVING_SOFA)
                .orElseGet(() -> {
                    Category newCategory = Category.builder()
                            .categoryCode(CategoryCode.LIVING_SOFA)
                            .categoryName("소파")
                            .build();
                    return categoryRepository.save(newCategory);
                });

        // 테스트 상품 데이터
        String[][] productData = {
                {"테스트 소파 1", "편안한 패브릭 소파", "300000", "250000", "10"},
                {"테스트 의자", "모던 디자인 의자", "150000", "120000", "15"},
                {"테스트 테이블", "원목 다이닝 테이블", "500000", "450000", "5"},
                {"테스트 침대", "퀸사이즈 침대 프레임", "800000", "700000", "3"},
                {"테스트 서랍장", "3단 서랍장", "200000", "180000", "8"}
        };

        for (int i = 0; i < productData.length; i++) {
            String[] data = productData[i];
            Product product = Product.builder()
                    .seller(seller)
                    .category(category)
                    .productName(data[0])
                    .productCode("TEST-PROD-" + String.format("%03d", i + 1))
                    .description(data[1])
                    .marketPrice(Integer.parseInt(data[2]))
                    .discountPrice(Integer.parseInt(data[3]))
                    .stock(Integer.parseInt(data[4]))
                    .salesCount(0)
                    .outOfStock(false)
                    .shippingInstallationFee(30000)
                    .mainImageUri("https://example.com/image" + (i + 1) + ".jpg")
                    .build();

            productRepository.save(product);
        }
    }

    /**
     * 테스트 주문 실적 10개 생성 (최근 3개월간 분산)
     */
    private void createTestOrders(Seller seller, User user) {
        // 이미 주문이 있으면 생성하지 않음
        if (orderRepository.countBySeller(seller) > 0) {
            return;
        }

        List<Product> products = productRepository.findBySeller(seller, null).getContent();
        if (products.isEmpty()) {
            return;
        }

        // 안전하게 UserAddress 조회
        UserAddress userAddress = userAddressRepository.findByUserAndIsDefaultTrue(user)
                .orElseGet(() -> {
                    // 기본 주소가 없으면 사용자의 첫 번째 주소 조회
                    List<UserAddress> addresses = userAddressRepository.findByUser(user);
                    if (!addresses.isEmpty()) {
                        return addresses.get(0);
                    }
                    // 주소가 아예 없으면 임시 주소 생성
                    UserAddress tempAddress = UserAddress.builder()
                            .user(user)
                            .recipientName("테스트 수령인")
                            .phoneNumber("010-0000-0000")
                            .postalCode("00000")
                            .address("테스트 주소")
                            .detailAddress("상세주소")
                            .isDefault(true)
                            .build();
                    tempAddress.setFreeLoweringService(true);
                    tempAddress.setProductInstallationAgreement(true);
                    tempAddress.setVehicleEntryPossible(true);
                    tempAddress.setElevatorType(ElevatorType.ONE_TO_SEVEN);
                    return userAddressRepository.save(tempAddress);
                });

        LocalDateTime now = LocalDateTime.now();

        // 10개의 테스트 주문 생성
        for (int i = 0; i < 10; i++) {
            // 최근 3개월간 랜덤 날짜
            LocalDateTime orderDate = now.minusDays((long) (Math.random() * 90));

            // PaymentGroup 생성
            PaymentGroup paymentGroup = PaymentGroup.builder()
                    .paymentGroupCode(generatePaymentGroupCode())
                    .user(user)
                    .paymentStatus(PaymentStatus.COMPLETED)
                    .totalAmount(0) // 나중에 계산
                    .build();
            paymentGroupRepository.save(paymentGroup);

            // Order 생성
            Order order = Order.builder()
                    .user(user)
                    .seller(seller)
                    .orderCode(generateOrderCode())
                    .orderStatus(getRandomOrderStatus())
                    .paymentStatus(PaymentStatus.COMPLETED)
                    .elevatorType(ElevatorType.ONE_TO_SEVEN)
                    .freeLoweringService(true)
                    .productInstallationAgreement(true)
                    .vehicleEntryPossible(true)
                    .deliveryRequest("테스트 주문입니다.")
                    .totalPrice(0) // 나중에 계산
                    .build();

            order.setPaymentGroup(paymentGroup);

            // 생성일시 강제 설정
            order = orderRepository.save(order);
            orderRepository.flush();

            // 리플렉션으로 createdAt 필드 강제 설정
            try {
                var field = Order.class.getDeclaredField("createdAt");
                field.setAccessible(true);
                field.set(order, orderDate);
                orderRepository.save(order);
            } catch (Exception e) {
                // 리플렉션 실패 시 현재 시간 사용
            }

            // OrderItem 생성 (랜덤 상품 1-3개)
            int itemCount = (int) (Math.random() * 3) + 1;
            int totalPrice = 0;

            for (int j = 0; j < itemCount; j++) {
                Product product = products.get((int) (Math.random() * products.size()));
                int quantity = (int) (Math.random() * 3) + 1;
                int finalPrice = product.getDiscountPrice() != null ?
                        product.getDiscountPrice() : product.getMarketPrice();

                OrderItem orderItem = OrderItem.builder()
                        .order(order)
                        .product(product)
                        .quantity(quantity)
                        .finalPrice(finalPrice)
                        .mainImageUri(product.getMainImageUri())
                        .build();

                orderItemRepository.save(orderItem);
                totalPrice += finalPrice * quantity;

                // 상품 판매량 증가
                product.increaseSales(quantity);
                productRepository.save(product);
            }

            // 총 가격 업데이트
            order.setTotalPrice(totalPrice);
            paymentGroup.setTotalAmount(totalPrice);

            orderRepository.save(order);
            paymentGroupRepository.save(paymentGroup);
        }
    }

    private OrderStatus getRandomOrderStatus() {
        OrderStatus[] statuses = {
                OrderStatus.PAYMENT_COMPLETED,
                OrderStatus.PREPARING_SHIPMENT,
                OrderStatus.SHIPPING,
                OrderStatus.DELIVERED
        };
        return statuses[(int) (Math.random() * statuses.length)];
    }

    private String generateOrderCode() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        String timestamp = LocalDateTime.now().format(formatter);
        int randomNum = (int) (Math.random() * 10000);
        return "ORD" + timestamp + String.format("%04d", randomNum);
    }

    private String generatePaymentGroupCode() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        String timestamp = LocalDateTime.now().format(formatter);
        int randomNum = (int) (Math.random() * 10000);
        return "PG" + timestamp + String.format("%04d", randomNum);
    }
}