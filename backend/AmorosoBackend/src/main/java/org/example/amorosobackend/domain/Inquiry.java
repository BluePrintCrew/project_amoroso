package org.example.amorosobackend.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.amorosobackend.domain.product.Product;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Inquiry {

    // 답변 상태, 상품에 대한 답변, 작성일 , 작성자 아이디 -> 앞 네자리만 출력
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long inquiryId;

    private String inquiryTitle;

    private String inquiryDescription;

    private boolean isAnswered;

    @Setter
    private String authorUsername;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Builder
    private Inquiry(User user,
                    Product product,
                    String inquiryTitle,
                    String inquiryDescription) {}

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
