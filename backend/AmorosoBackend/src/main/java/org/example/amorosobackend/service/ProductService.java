package org.example.amorosobackend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j; // 로그 사용을 위한 어노테이션
import org.example.amorosobackend.domain.*;
import org.example.amorosobackend.domain.category.Category;
import org.example.amorosobackend.domain.product.AdditionalOption;
import org.example.amorosobackend.domain.product.Product;
import org.example.amorosobackend.domain.product.ProductImage;
import org.example.amorosobackend.domain.product.ProductOption;
import org.example.amorosobackend.domain.review.Review;
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
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
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
        log.info("[createProduct] Start - Product Name: {}", dto.getProductName());

        // 현재 사용자(로그인 유저) role 검사
        User currentUser = getCurrentUser();
        log.debug("[createProduct] Current User: {}, Role: {}", currentUser.getEmail(), currentUser.getRole());
        checkAdminOrSellerRole(currentUser);

        // 카테고리 찾기
        log.debug("[createProduct] Category Code: {}", dto.getCategoryCode());
        Category category = categoryRepository.findByCategoryCode(CategoryCode.fromCode(dto.getCategoryCode()))
                .orElseThrow(() -> {
                    log.warn("[createProduct] Invalid Category Code: {}", dto.getCategoryCode());
                    return new IllegalArgumentException("유효하지 않은 카테고리 코드입니다.");
                });

        // 현재 SELLER라면, Seller 엔티티를 가져옴
        Seller seller = null;
        if ("ROLE_SELLER".equals(currentUser.getRole().name())) {
            seller = sellerRepository.findByUser(currentUser)
                    .orElseThrow(() -> {
                        log.warn("[createProduct] Seller Info Not Found for User: {}", currentUser.getEmail());
                        return new IllegalArgumentException("판매자 정보가 없습니다.");
                    });
            log.debug("[createProduct] Seller ID: {}", seller.getSellerId());
        }


        // Builder로 Product 생성
        Product product = Product.builder()
                .category(category)
                .productName(dto.getProductName())
                .productCode(dto.getProductCode())
                .description(dto.getDescription())
                .seller(seller)
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
                .discountRate(dto.getDiscountRate())
                .salesCount(0)
                .build();

        log.debug("[createProduct] Product Built - Name: {}, DiscountRate: {}", product.getProductName(), product.getDiscountRate());

        // DB 저장
        productRepository.save(product);
        log.info("[createProduct] Product Saved - Product ID: {}", product.getProductId());

        // ProductOption 저장
        if (dto.getProductOptions() != null) {
            for (ProductDTO.ProductOptionRequest optionDto : dto.getProductOptions()) {
                ProductOption option = ProductOption.builder()
                        .product(product)
                        .optionName(optionDto.getOptionName())
                        .optionValues(optionDto.getOptionValues())
                        .build();
                productOptionRepository.save(option);
                log.debug("[createProduct] ProductOption Saved - OptionName: {}", optionDto.getOptionName());
            }
        }

        // AdditionalOption 저장
        if (dto.getAdditionalOptions() != null) {
            for (ProductDTO.AdditionalOptionRequest addOptionDto : dto.getAdditionalOptions()) {
                AdditionalOption addOption = AdditionalOption.builder()
                        .product(product)
                        .optionName(addOptionDto.getOptionName())
                        .additionalPrice(addOptionDto.getAdditionalPrice())
                        .build();
                additionalOptionRepository.save(addOption);
                log.debug("[createProduct] AdditionalOption Saved - OptionName: {}", addOptionDto.getOptionName());
            }
        }

        log.info("[createProduct] End - Product ID: {}", product.getProductId());
        return product.getProductId();
    }

    /**
     * 상품 검색 조회 메서드.
     */
    public ProductDTO.ProductListResponse getProductsBySearch(String keyword,Long categoryId, int page, int size, String sortBy, String order) {
        log.info("[getProductsBySearch] Start - keyword: {} categoryId: {}, page: {}, size: {}, sortBy: {}, order: {}",
                keyword,categoryId, page, size, sortBy, order);

        //pagable 생성
        Sort.Direction direction = Sort.Direction.fromString(order);
        Sort sort = Sort.by(direction, sortBy);

        Pageable pageable = PageRequest.of(page - 1, size, sort);

        Page<Product> productList = categoryId != null
                ? productRepository.findAllByCategory_CategoryIdAndProductNameContaining(categoryId,keyword, pageable)
                : productRepository.findAllByProductNameContaining(keyword,pageable);

        log.debug("[getProducts] Retrieved Products Count: {}", productList.getTotalElements());

        Set<Long> wishlistProductIds = new HashSet<>();
        try {
            // SecurityContextHolder에서 현재 사용자의 이메일을 가져옴
            String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            userRepository.findByEmail(email).ifPresent(user -> {
                wishlistProductIds.addAll(
                        user.getWishlists().stream()
                                .map(wishlist -> wishlist.getProduct().getProductId()) // 유저가 wishlist로 정리한 것
                                .collect(Collectors.toSet())
                );
            });
        } catch(Exception e) {
            // 로그인되어 있지 않거나 에러 발생 시, wishlistProductIds는 빈 set 그대로 사용
        }

        // 상품 목록을 DTO로 매핑하면서, 각 상품이 위시리스트에 존재하는지 확인
        Page<ProductDTO.ProductInfoDTO> dtoPage = productList.map(product -> {
            boolean isInWishlist = wishlistProductIds.contains(product.getProductId());
            return new ProductDTO.ProductInfoDTO(
                    product.getProductId(),
                    product.getProductName(),
                    product.getMarketPrice(),
                    product.getDiscountPrice(),
                    product.getDiscountRate(),
                    product.getCategory().getCategoryName(),
                    product.getMainImageUri(),
                    dateToString(product.getCreatedAt()),
                    isInWishlist,
                    product.getSalesCount()
            );
        });
        ProductDTO.ProductListResponse response = new ProductDTO.ProductListResponse(
                dtoPage.getTotalPages(),
                (int) dtoPage.getTotalElements(),
                dtoPage.getContent()
        );

        log.info("[getProducts] End - Total Pages: {}, Total Elements: {}",
                response.getTotalPages(), response.getTotalItems());
        return response;
    }


    /**
     * 상품 목록 조회 메서드.
     */
    public ProductDTO.ProductListResponse getProducts(Category categoryCode, int page, int size, String sortBy, String order) {
        log.info("[getProducts] Start - categoryId: {}, page: {}, size: {}, sortBy: {}, order: {}",
                categoryCode, page, size, sortBy, order);

        // 정렬 방향 정의 및 기본값 처리
        Sort.Direction direction = Sort.Direction.fromString(order);
        Sort sort = Sort.by(direction, sortBy);
        Pageable pageable = PageRequest.of(page - 1, size, sort);


        // 카테고리 코드 분석 및, 카테고리 아이템 가져오기, 아니면 전체 아이템가져오기
        Page<Product> productList = categoryCode != null
                ? productRepository.findAllByCategory_CategoryId(categoryCode.getCategoryId(), pageable)
                : productRepository.findAll(pageable);

        log.debug("[getProducts] Retrieved Products Count: {}", productList.getTotalElements());

        Set<Long> wishlistProductIds = new HashSet<>();
        try {
            // SecurityContextHolder에서 현재 사용자의 이메일을 가져옴
            String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            userRepository.findByEmail(email).ifPresent(user -> {
                wishlistProductIds.addAll(
                        user.getWishlists().stream()
                                .map(wishlist -> wishlist.getProduct().getProductId())
                                .collect(Collectors.toSet())
                );
            });
        } catch(Exception e) {
            // 로그인되어 있지 않거나 에러 발생 시, wishlistProductIds는 빈 set 그대로 사용
        }

        // 상품 목록을 DTO로 매핑하면서, 각 상품이 위시리스트에 존재하는지 확인
        Page<ProductDTO.ProductInfoDTO> dtoPage = productList.map(product -> {
            boolean isInWishlist = wishlistProductIds.contains(product.getProductId());
            return new ProductDTO.ProductInfoDTO(
                    product.getProductId(),
                    product.getProductName(),
                    product.getMarketPrice(),
                    product.getDiscountPrice(),
                    product.getDiscountRate(),
                    product.getCategory().getCategoryName(),
                    product.getMainImageUri(),
                    dateToString(product.getCreatedAt()),
                    isInWishlist,
                    product.getSalesCount()
            );
        });
        ProductDTO.ProductListResponse response = new ProductDTO.ProductListResponse(
                dtoPage.getTotalPages(),
                (int) dtoPage.getTotalElements(),
                dtoPage.getContent()
        );

        log.info("[getProducts] End - Total Pages: {}, Total Elements: {}",
                response.getTotalPages(), response.getTotalItems());
        return response;
    }

    /**
     * 상품 수정 메서드 (ADMIN, SELLER만 가능).
     */
    public Long updateProduct(ProductDTO.Update dto) {
        log.info("[updateProduct] Start - Product ID: {}", dto.getProductId());

        // 현재 사용자(로그인 유저)의 role 검사
        User currentUser = getCurrentUser();
        log.debug("[updateProduct] Current User: {}, Role: {}", currentUser.getEmail(), currentUser.getRole());
        checkAdminOrSellerRole(currentUser);

        // 수정 대상 Product 조회
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> {
                    log.warn("[updateProduct] Product Not Found - Product ID: {}", dto.getProductId());
                    return new IllegalArgumentException("상품을 찾을 수 없습니다.");
                });

        // SELLER 자신의 상품인지 확인(권한)
        if ("ROLE_SELLER".equals(currentUser.getRole().name())) {
            Seller seller = sellerRepository.findByUser(currentUser)
                    .orElseThrow(() -> {
                        log.warn("[updateProduct] Seller Info Not Found for User: {}", currentUser.getEmail());
                        return new IllegalArgumentException("판매자 정보가 없습니다.");
                    });
            if (!product.getSeller().getSellerId().equals(seller.getSellerId())) {
                log.error("[updateProduct] SecurityException - Seller ID Mismatch");
                throw new SecurityException("해당 상품을 수정할 권한이 없습니다.");
            }
        }

        // 카테고리 변경 필요 시
        if (dto.getCategoryCode() != null) {
            log.debug("[updateProduct] Category Code Update: {}", dto.getCategoryCode());
            Category newCategory = categoryRepository.findByCategoryCode(CategoryCode.valueOf(dto.getCategoryCode()))
                    .orElseThrow(() -> {
                        log.warn("[updateProduct] Invalid Category Code: {}", dto.getCategoryCode());
                        return new IllegalArgumentException("유효하지 않은 카테고리 코드입니다.");
                    });
            product.updateCategory(newCategory);
        }

        // 필드들 업데이트
        if (dto.getProductName() != null) product.updateProductName(dto.getProductName());
        if (dto.getDescription() != null) product.updateDescription(dto.getDescription());
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
        product.updateDiscountRate(dto.getDiscountRate());

        log.debug("[updateProduct] Fields Updated for Product ID: {}", product.getProductId());

        // 기존 옵션 삭제 -> 새로 저장
        if (dto.getProductOptions() != null) {
            productOptionRepository.deleteAllByProduct(product);
            for (ProductDTO.ProductOptionRequest optionDto : dto.getProductOptions()) {
                ProductOption option = ProductOption.builder()
                        .product(product)
                        .optionName(optionDto.getOptionName())
                        .optionValues(optionDto.getOptionValues())
                        .build();
                productOptionRepository.save(option);
                log.debug("[updateProduct] ProductOption Re-Saved - OptionName: {}", optionDto.getOptionName());
            }
        }

        if (dto.getAdditionalOptions() != null) {
            additionalOptionRepository.deleteAllByProduct(product);
            for (ProductDTO.AdditionalOptionRequest addOptionDto : dto.getAdditionalOptions()) {
                AdditionalOption addOption = AdditionalOption.builder()
                        .product(product)
                        .optionName(addOptionDto.getOptionName())
                        .additionalPrice(addOptionDto.getAdditionalPrice())
                        .build();
                additionalOptionRepository.save(addOption);
                log.debug("[updateProduct] AdditionalOption Re-Saved - OptionName: {}", addOptionDto.getOptionName());
            }
        }

        log.info("[updateProduct] End - Product Updated ID: {}", product.getProductId());
        return product.getProductId();
    }

    public Product getProductById(Long productId){
        log.info("[getProductById] Product ID: {}", productId);
        return productRepository.findByProductId(productId)
                .orElseThrow(() -> {
                    log.warn("[getProductById] Invalid Product ID: {}", productId);
                    return new NullPointerException("Invaild productId");
                });
    }

    /**
     * 단일 상품 조회(상세 정보).
     * 새 필드들도 모두 포함하여 반환.
     */
    @Transactional(readOnly = true)
    public ProductDTO.ProductInfoDetailDTO getProductDetail(Long productId) {
        log.info("[getProductDetail] Start - Product ID: {}", productId);

        // 1) 상품 조회
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> {
                    log.warn("[getProductDetail] Product Not Found - Product ID: {}", productId);
                    return new IllegalArgumentException("상품이 존재하지 않습니다.");
                });

        // 2) 리뷰 목록 조회
        List<Review> reviews = reviewRepository.findByProduct(product);
        log.debug("[getProductDetail] Review Count: {}", reviews.size());

        // 3) 이미지 목록 분류
        //    - MAIN: 단일 mainImageURL
        //    - SUB: subImagesURL (List<ImageSequenceInfoDTO>)
        //    - DETAIL: detailDescriptionImageURL (List<ImageSequenceInfoDTO>)
        String mainImageURL = null;
        List<ProductDTO.ImageSequenceInfoDTO> subImageList = new ArrayList<>();
        List<ProductDTO.ImageSequenceInfoDTO> detailImageList = new ArrayList<>();

        for (ProductImage pi : product.getProductImages()) {
            switch (pi.getImageType()) {
                case MAIN:
                    // 메인 이미지는 1개만 있다고 가정
                    mainImageURL = pi.getImageUrl();
                    break;
                case SUB:
                    subImageList.add(
                            new ProductDTO.ImageSequenceInfoDTO(pi.getImageUrl(), pi.getImageOrder())
                    );
                    break;
                case DETAIL:
                    detailImageList.add(
                            new ProductDTO.ImageSequenceInfoDTO(pi.getImageUrl(), pi.getImageOrder())
                    );
                    break;
            }
        }

        // 4) 리뷰 DTO 변환
        List<ProductDTO.ProductReviewDTO> reviewDTOs = reviews.stream()
                .map(r -> new ProductDTO.ProductReviewDTO(
                        r.getReviewId(),
                        r.getUser().getName(),
                        r.getRating(),
                        r.getContent(),
                        (r.getCreatedAt() != null) ? r.getCreatedAt().toString() : null
                ))
                .collect(Collectors.toList());

        List<ProductDTO.ProductOptionResponse> productOptionDTOs = product.getProductOptions().stream()
                .map(p -> new ProductDTO.ProductOptionResponse(
                        p.getId(),
                        p.getOptionName(),
                        p.getOptionValues()
                ))
                .collect(Collectors.toList());

        List<ProductDTO.AdditionalOptionResponse> additionalOptionDTOs = product.getAdditionalOptions().stream()
                .map(a -> new ProductDTO.AdditionalOptionResponse(
                        a.getId(),
                        a.getOptionName(),
                        a.getAdditionalPrice()
                ))
                .toList();
        // 5) DTO 구성
        ProductDTO.ProductInfoDetailDTO detailDTO = new ProductDTO.ProductInfoDetailDTO(
                product.getProductId(),
                product.getProductName(),
                product.getDescription(),
                product.getStock(),
                product.getSalesCount(),
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
                product.getMarketPrice(),
                product.getDiscountPrice() == null ? 0 : product.getDiscountPrice(),
                product.getDiscountRate() == null ? 0 : product.getDiscountRate(),
                product.getOutOfStock(),
                product.getStockNotificationThreshold(),
                // MAIN
                mainImageURL,
                // SUB
                subImageList,
                // DETAIL
                detailImageList,
                // 리뷰 목록
                reviewDTOs,
                additionalOptionDTOs,
                productOptionDTOs
        );

        log.info("[getProductDetail] End - Product ID: {}", productId);
        return detailDTO;
    }


    // 내부 헬퍼 메서드
    private User getCurrentUser() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        log.debug("[getCurrentUser] Email from SecurityContext: {}", email);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.warn("[getCurrentUser] User not found with Email: {}", email);
                    return new IllegalArgumentException("로그인 정보를 찾을 수 없습니다.");
                });
    }

    private void checkAdminOrSellerRole(User user) {
        String role = user.getRole().name();
        log.debug("[checkAdminOrSellerRole] User Role: {}", role);
        if (!"ROLE_ADMIN".equals(role) && !"ROLE_SELLER".equals(role)) {
            log.error("[checkAdminOrSellerRole] Access Denied for Role: {}", role);
            throw new SecurityException("상품 등록/수정 권한이 없습니다.");
        }
    }



    public static String dateToString(LocalDateTime dateTime) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        return dateTime.format(formatter);
    }

    public ProductOption getProductOptionById(Long productOptionId) {
        return productOptionRepository.findById(productOptionId)
                .orElseThrow(() -> new NoSuchElementException("해당 ID의 ProductOption을 찾을 수 없습니다: " + productOptionId));
    }

    public AdditionalOption getAdditionalOptionById(Long additionalOptionId) {
        return additionalOptionRepository.findById(additionalOptionId)
                .orElseThrow(() -> new NoSuchElementException("해당 ID의 ProductOption을 찾을 수 없습니다: " + additionalOptionId));
    }
}
