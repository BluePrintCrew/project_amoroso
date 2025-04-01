package org.example.amorosobackend.domain;

import jakarta.persistence.*;
import lombok.*;
import org.example.amorosobackend.domain.product.Product;

import java.time.LocalDateTime;

@Entity
@Getter
@Table(name = "inquiries")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Inquiry {

    // 답변 상태, 상품에 대한 답변, 작성일 , 작성자 아이디 -> 앞 네자리만 출력
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long inquiryId;

    private String inquiryTitle;

    private String inquiryDescription;

    private boolean isAnswered;

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
                    String inquiryDescription,
                    String authorUsername,
                    boolean isAnswered) {
        this.user = user;
        this.authorUsername = authorUsername;
        this.inquiryTitle = inquiryTitle;
        this.inquiryDescription = inquiryDescription;
        this.product = product;
        this.isAnswered = isAnswered;
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
