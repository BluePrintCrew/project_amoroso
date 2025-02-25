package org.example.amorosobackend.service;

import lombok.RequiredArgsConstructor;
import org.example.amorosobackend.domain.*;
import org.example.amorosobackend.domain.product.AdditionalOption;
import org.example.amorosobackend.domain.product.Product;
import org.example.amorosobackend.domain.product.ProductOption;
import org.example.amorosobackend.dto.ProductDTO;
import org.example.amorosobackend.enums.CategoryCode;
import org.example.amorosobackend.repository.*;
import org.example.amorosobackend.repository.product.AdditionalOptionRepository;
import org.example.amorosobackend.repository.product.ProductOptionRepository;
import org.example.amorosobackend.repository.product.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;



@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final SellerRepository sellerRepository;
    private final ProductOptionRepository productOptionRepository;
    private final AdditionalOptionRepository additionalOptionRepository;
    private final ReviewRepository reviewRepository;
    private final ProductImageRepository productImageRepository;

    /**
     * 상품 등록 메서드 (ADMIN, SELLER만 가능).
     * Builder를 활용해서 Product 생성 시 대부분의 필드 한 번에 세팅.
     */
    public Long createProduct(ProductDTO.Create dto) {
        // 현재 사용자(로그인 유저) role 검사
        User currentUser = getCurrentUser();
        checkAdminOrSellerRole(currentUser);

        // 카테고리 찾기
        Category category = categoryRepository.findByCategoryCode(CategoryCode.valueOf(dto.getCategoryCode()))
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 카테고리 코드입니다."));

        // 현재 SELLER라면, Seller 엔티티를 가져옴
        Seller seller = null;
        if ("ROLE_SELLER".equals(currentUser.getRole().name())) {
            seller = sellerRepository.findByUser(currentUser)
                    .orElseThrow(() -> new IllegalArgumentException("판매자 정보가 없습니다."));
        }
        // ROLE_ADMIN인 경우 특정 seller를 지정하지 않음(또는 dto 통해 sellerId를 받는 식으로 구현 가능)

        // Builder로 Product 생성
        Product product = Product.builder()
                .category(category)
                .productName(dto.getProductName())
                .productCode(dto.getProductCode())
                .description(dto.getDescription())
                .seller(seller)
                .price(dto.getPrice())
                .stock(dto.getStock())
                .manufacturer(dto.getManufacturer())
                .origin(dto.getOrigin())
                .brand(dto.getBrand())
                .couponApplicable(dto.getCouponApplicable())
                .color(dto.getColor())
                .components(dto.getComponents())
                .material(dto.getMaterial())
                .size(dto.getSize())
                .shippingInstallationFee(dto.getShippingInstallationFee())
                .asPhoneNumber(dto.getAsPhoneNumber())
                .costPrice(dto.getCostPrice())
                .marketPrice(dto.getMarketPrice())
                .outOfStock(dto.getOutOfStock())
                .stockNotificationThreshold(dto.getStockNotificationThreshold())
                // createdAt은 @PrePersist로 자동 세팅
                .build();



        // DB 저장
        productRepository.save(product);

        // ProductOption 저장
        if (dto.getProductOptions() != null) {
            for (ProductDTO.ProductOptionDto optionDto : dto.getProductOptions()) {
                ProductOption option = ProductOption.builder()
                        .product(product)
                        .optionName(optionDto.getOptionName())
                        .optionValues(optionDto.getOptionValues())
                        .build();
                productOptionRepository.save(option);
            }
        }

        // AdditionalOption 저장
        if (dto.getAdditionalOptions() != null) {
            for (ProductDTO.AdditionalOptionDto addOptionDto : dto.getAdditionalOptions()) {
                AdditionalOption addOption = AdditionalOption.builder()
                        .product(product)
                        .optionName(addOptionDto.getOptionName())
                        .additionalPrice(addOptionDto.getAdditionalPrice())
                        .build();
                additionalOptionRepository.save(addOption);
            }
        }

        return product.getProductId();
    }

    // direction static 클래스 : Sort.Direction 클래스는 "asc" 또는 "desc" 문자열을 자동으로 파싱하는 메서드를 제공합니다.
    //IllegalArgumentException은 fromString 메서드 내부에서 자동으로 발생합니다.
    public ProductDTO.ProductListResponse getProducts(Long categoryId, int page, int size, String sortBy, String order) {
        // 정렬 방향 정의 및 기본값 처리
        Sort.Direction direction = Sort.Direction.fromString(order);

        // Sort 객체 생성
        Sort sort = Sort.by(direction, sortBy);

        // Pageable 객체 생성 및 Repository 호출
        Pageable pageable = PageRequest.of(page - 1, size, sort);

        // Repository 호출 (categoryId 조건에 따라 분기)
        Page<Product> productList = categoryId != null
                ? productRepository.findAllByCategory_CategoryId(categoryId, pageable)
                : productRepository.findAll(pageable);

        // 페이지로 받은 것들 DTO 페이지로 변환
        Page<ProductDTO.ProductInfoDTO> productInfoDTOs = productList
                .map(ProductService::toProductInfoDTO);

        // 받은 DTO ProductListResponse로 변환
        ProductDTO.ProductListResponse response = new ProductDTO.ProductListResponse(
                null, // productId can be null for list response
                productInfoDTOs.getTotalPages(),
                (int) productInfoDTOs.getTotalElements(),
                productInfoDTOs.getContent() // directly gets the list of DTOs
        );

        return response;
    }
    /**
     * 상품 수정 메서드 (ADMIN, SELLER만 가능).
     */
    public Long updateProduct(ProductDTO.Update dto) {
        // 현재 사용자(로그인 유저)의 role 검사
        User currentUser = getCurrentUser();
        checkAdminOrSellerRole(currentUser);

        // 수정 대상 Product 조회
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다."));

        // SELLER 자신의 상품인지 확인(권한)
        if ("ROLE_SELLER".equals(currentUser.getRole().name())) {
            Seller seller = sellerRepository.findByUser(currentUser)
                    .orElseThrow(() -> new IllegalArgumentException("판매자 정보가 없습니다."));
            if (!product.getSeller().getSellerId().equals(seller.getSellerId())) {
                throw new SecurityException("해당 상품을 수정할 권한이 없습니다.");
            }
        }

        // 카테고리 변경 필요 시
        if (dto.getCategoryCode() != null) {
            Category newCategory = categoryRepository.findByCategoryCode(CategoryCode.valueOf(dto.getCategoryCode()))
                    .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 카테고리 코드입니다."));
            product.updateCategory(newCategory);
        }

        // 필드들 업데이트
        if (dto.getProductName() != null) product.updateProductName(dto.getProductName());
        if (dto.getDescription() != null) product.updateDescription(dto.getDescription());
        if (dto.getPrice() != null) product.updatePrice(dto.getPrice());
        if (dto.getStock() != null) product.updateStock(dto.getStock());

        product.updateProductCode(dto.getProductCode());
        product.updateManufacturer(dto.getManufacturer());
        product.updateOrigin(dto.getOrigin());
        product.updateBrand(dto.getBrand());
        product.updateCouponApplicable(dto.getCouponApplicable());
        product.updateColor(dto.getColor());
        product.updateComponents(dto.getComponents());
        product.updateMaterial(dto.getMaterial());
        product.updateSize(dto.getSize());
        product.updateShippingInstallationFee(dto.getShippingInstallationFee());
        product.updateAsPhoneNumber(dto.getAsPhoneNumber());
        product.updateCostPrice(dto.getCostPrice());
        product.updateMarketPrice(dto.getMarketPrice());
        product.updateOutOfStock(dto.getOutOfStock());
        product.updateStockNotificationThreshold(dto.getStockNotificationThreshold());

        // 기존 옵션 삭제 -> 새로 저장 (비즈니스 규칙에 따라 다양하게 처리 가능)
        if (dto.getProductOptions() != null) {
            productOptionRepository.deleteAllByProduct(product);
            for (ProductDTO.ProductOptionDto optionDto : dto.getProductOptions()) {
                ProductOption option = ProductOption.builder()
                        .product(product)
                        .optionName(optionDto.getOptionName())
                        .optionValues(optionDto.getOptionValues())
                        .build();
                productOptionRepository.save(option);
            }
        }

        if (dto.getAdditionalOptions() != null) {
            additionalOptionRepository.deleteAllByProduct(product);
            for (ProductDTO.AdditionalOptionDto addOptionDto : dto.getAdditionalOptions()) {
                AdditionalOption addOption = AdditionalOption.builder()
                        .product(product)
                        .optionName(addOptionDto.getOptionName())
                        .additionalPrice(addOptionDto.getAdditionalPrice())
                        .build();
                additionalOptionRepository.save(addOption);
            }
        }

        return product.getProductId();
    }
    public Product getProductById(Long productId){
        return productRepository.findByProductId(productId)
                .orElseThrow(() -> new NullPointerException("Invaild productId"));
    }


    /**
     * 단일 상품 조회(상세 정보).
     * 새 필드들도 모두 포함하여 반환.
     */
    @Transactional(readOnly = true)
    public ProductDTO.ProductInfoDetailDTO getProductDetail(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("상품이 존재하지 않습니다."));

        // 리뷰 목록
        List<Review> reviews = reviewRepository.findByProduct(product);

        // 상품 이미지 목록 -> 이미지 저장은 imageService에서 저장되어 있는상태
        List<String> imageUrls = product.getProductImages().stream()
                .map(ProductImage::getImageUrl)
                .collect(Collectors.toList());

        // 리뷰 DTO
        List<ProductDTO.ProductReviewDTO> reviewDTOs = reviews.stream()
                .map(r -> new ProductDTO.ProductReviewDTO(
                        r.getReviewId(),
                        r.getUser().getName(),     // userName
                        r.getRating(),
                        r.getContent(),
                        r.getCreatedAt() == null ? null : r.getCreatedAt().toString()
                ))
                .collect(Collectors.toList());

        // ProductInfoDetailDTO 구성
        return new ProductDTO.ProductInfoDetailDTO(
                product.getProductId(),
                product.getProductName(),
                product.getDescription(),
                product.getPrice(),
                product.getStock(),
                product.getProductCode(),
                product.getManufacturer(),
                product.getOrigin(),
                product.getBrand(),
                product.getCouponApplicable(),
                product.getColor(),
                product.getComponents(),
                product.getMaterial(),
                product.getSize(),
                product.getShippingInstallationFee(),
                product.getAsPhoneNumber(),
                product.getCostPrice(),
                product.getMarketPrice(),
                product.getOutOfStock(),
                product.getStockNotificationThreshold(),
                imageUrls,
                reviewDTOs
        );
    }


    // -----------------------------
    // 내부 헬퍼 메서드
    // -----------------------------
    private User getCurrentUser() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("로그인 정보를 찾을 수 없습니다."));
    }

    private void checkAdminOrSellerRole(User user) {
        String role = user.getRole().name();
        if (!"ROLE_ADMIN".equals(role) && !"ROLE_SELLER".equals(role)) {
            throw new SecurityException("상품 등록/수정 권한이 없습니다.");
        }
    }

    public static ProductDTO.ProductInfoDTO toProductInfoDTO(Product product) {
        // DateTimeFormatter 정의 (원하는 포맷으로 설정)
        String formattedCreatedAt = dateToString(product.getCreatedAt());

        return new ProductDTO.ProductInfoDTO(
                product.getProductId(),
                product.getProductName(),
                product.getPrice(),
                product.getCategory().getCategoryCode().getCode(),
                product.getPrimaryImage() != null ? product.getPrimaryImage().getImageUrl() : null,
                formattedCreatedAt // 변환된 문자열 값
        );
    }
    public static String dateToString(LocalDateTime dateTime){
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        // createdAt을 문자열로 변환
        return dateTime.format(formatter);

    }
}
