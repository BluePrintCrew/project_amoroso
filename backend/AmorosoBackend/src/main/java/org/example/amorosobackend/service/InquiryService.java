package org.example.amorosobackend.service;


import lombok.RequiredArgsConstructor;
import org.example.amorosobackend.domain.Inquiry;
import org.example.amorosobackend.domain.User;
import org.example.amorosobackend.domain.product.Product;
import org.example.amorosobackend.dto.InquiryDTO;
import org.example.amorosobackend.repository.InquiryRepository;
import org.example.amorosobackend.repository.product.ProductRepository;
import org.example.amorosobackend.repository.UserRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InquiryService {

    private final InquiryRepository inquiryRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public void createInquiry(InquiryDTO.InquiryRequestDto dto, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다."));

        Inquiry inquiry = Inquiry.builder()
                .user(user)
                .product(product)
                .inquiryTitle(dto.getInquiryTitle())
                .inquiryDescription(dto.getInquiryDescription())
                .authorUsername(userEmail)
                .build();
        inquiryRepository.save(inquiry);
    }

    public Page<InquiryDTO.InquiryResponseDto> getUserInquiries(String userEmail, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        return inquiryRepository.findAllByUser(user, pageable)
                .map(this::toDtoWithMaskedUsername);
    }
    public Page<InquiryDTO.InquiryResponseDto> getInquiriesByProduct(Long productId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return inquiryRepository.findAllByProduct_ProductId(productId, pageable)
                .map(this::toDtoWithMaskedUsername);
    }

    protected InquiryDTO.InquiryResponseDto toDtoWithMaskedUsername(Inquiry inquiry) {
        return InquiryDTO.InquiryResponseDto.builder()
                .inquiryId(inquiry.getInquiryId())
                .inquiryTitle(inquiry.getInquiryTitle())
                .inquiryDescription(inquiry.getInquiryDescription())
                .authorUsername(maskUsername(inquiry.getAuthorUsername()))
                .isAnswered(inquiry.isAnswered())
                .createdAt(inquiry.getCreatedAt())
                .build();
    }

    private String maskUsername(String username) {
        if (username == null || username.length() <= 4) {
            return username; // 4자 이하면 그대로 반환
        }
        int visibleLength = 4;
        String visible = username.substring(0, visibleLength);
        String masked = "*".repeat(username.length() - visibleLength);
        return visible + masked;
    }
}
