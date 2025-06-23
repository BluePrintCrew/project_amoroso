package org.example.amorosobackend.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.amorosobackend.domain.Seller;
import org.example.amorosobackend.domain.User;
import org.example.amorosobackend.domain.category.Category;
import org.example.amorosobackend.domain.product.Product;
import org.example.amorosobackend.enums.CategoryCode;
import org.example.amorosobackend.enums.UserRole;
import org.example.amorosobackend.repository.CategoryRepository;
import org.example.amorosobackend.repository.SellerRepository;
import org.example.amorosobackend.repository.UserRepository;
import org.example.amorosobackend.repository.product.ProductRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Slf4j
@Component
@Profile("!prod") // 운영환경 제외
@RequiredArgsConstructor
public class DevDataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final SellerRepository sellerRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        log.info("==== 개발용 초기 데이터 생성 시작 ====");

        try {
            createCompleteDevDataSet();
            log.info("==== 개발용 초기 데이터 생성 완료 ====");
        } catch (Exception e) {
            log.warn("자동 개발 데이터 생성 실패. 수동으로 상품을 등록해서 테스트하세요.");
            log.debug("실패 상세: ", e);
            // 애플리케이션은 정상 시작
        }
    }

    @Transactional(rollbackFor = Exception.class)
    protected void createCompleteDevDataSet() {
        createTestUser();
        createCategory();
        createTestSeller();
        createSampleProduct();
    }

    private void createTestUser() {
        if (userRepository.findByEmail("dev.seller@test.com").isPresent()) {
            log.info("테스트 사용자가 이미 존재합니다. 건너뜁니다.");
            return;
        }

        User testUser = User.builder()
                .email("dev.seller@test.com")
                .password(passwordEncoder.encode("password123"))
                .name("개발용 판매자")
                .phoneNumber("010-1234-5678")
                .role("ROLE_SELLER")
                .socialProvider("local")
                .build();

        userRepository.save(testUser);
        log.info("테스트 사용자 생성 완료: {}", testUser.getEmail());
    }

    private void createCategory() {
        if (categoryRepository.findByCategoryCode(CategoryCode.LIVING_SOFA).isPresent()) {
            log.info("카테고리가 이미 존재합니다. 건너뜁니다.");
            return;
        }

        Category category = Category.builder()
                .categoryName("소파")
                .categoryCode(CategoryCode.LIVING_SOFA)
                .build();

        categoryRepository.save(category);
        log.info("카테고리 생성 완료: {}", category.getCategoryName());
    }

    private void createTestSeller() {
        User testUser = userRepository.findByEmail("dev.seller@test.com")
                .orElseThrow(() -> new RuntimeException("테스트 사용자를 찾을 수 없습니다."));

        if (sellerRepository.findByUser(testUser).isPresent()) {
            log.info("테스트 판매자가 이미 존재합니다. 건너뜁니다.");
            return;
        }

        Seller testSeller = Seller.builder()
                .user(testUser)
                .brandName("개발용 가구브랜드")
                .businessRegistrationNumber("123-45-67890")
                .businessStartDate(LocalDate.now().minusYears(1))
                .businessAddress("서울시 강남구 테헤란로 123")
                .businessDetailAddress("456호")
                .taxationType("일반과세자")
                .businessStatus("계속사업자")
                .businessTel("02-1234-5678")
                .businessEmail("business@test.com")
                .ecommerceRegistrationNumber("2024-서울강남-1234")
                .ecommerceRegistrationDate(LocalDate.now().minusMonths(6))
                .ecommerceBusinessStatus("영업중")
                .ecommerceDomain("https://dev-furniture.com")
                .serverLocation("서울 IDC")
                .salesMethod("온라인판매")
                .productCategories("가구류")
                .build();

        sellerRepository.save(testSeller);
        log.info("테스트 판매자 생성 완료: {}", testSeller.getBrandName());
    }

    private void createSampleProduct() {
        if (productRepository.count() > 0) {
            log.info("상품이 이미 존재합니다. 건너뜁니다.");
            return;
        }

        User testUser = userRepository.findByEmail("dev.seller@test.com")
                .orElseThrow(() -> new RuntimeException("테스트 사용자를 찾을 수 없습니다."));

        Seller testSeller = sellerRepository.findByUser(testUser)
                .orElseThrow(() -> new RuntimeException("테스트 판매자를 찾을 수 없습니다."));

        Category category = categoryRepository.findByCategoryCode(CategoryCode.LIVING_SOFA)
                .orElseThrow(() -> new RuntimeException("카테고리를 찾을 수 없습니다."));

        Product sampleProduct = Product.builder()
                .category(category)
                .productName("개발용 테스트 소파")
                .productCode("DEV-SOFA-001")
                .description("개발 및 테스트용 샘플 소파입니다. 구매 플로우 테스트에 사용하세요.")
                .seller(testSeller)
                .stock(100)
                .manufacturer("개발용 제조사")
                .origin("한국")
                .brand("개발테스트")
                .couponApplicable(true)
                .color("베이지")
                .components("패브릭, 스틸프레임")
                .material("패브릭")
                .size("W200 x D90 x H80 (cm)")
                .shippingInstallationFee(50_000)
                .asPhoneNumber("1588-1234")
                .costPrice(300_000)
                .marketPrice(500_000)
                .outOfStock(false)
                .stockNotificationThreshold(10)
                .discountRate(10)
                .build();

        productRepository.save(sampleProduct);
        log.info("샘플 상품 생성 완료: {} (ID: {})", sampleProduct.getProductName(), sampleProduct.getProductId());
    }
}
