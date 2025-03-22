package org.example.amorosobackend.domain;

import jakarta.persistence.*;
import lombok.*;
import org.example.amorosobackend.enums.PaymentStatus;

import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;

    // 주문과 1:1 매핑 (어떤 주문에 대한 결제인지)
    @OneToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    // PortOne(아임포트)에서 반환받은 결제 고유 ID
    private String impUid;
    // 결제 상태: paid, failed, canceled 등
    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;
    // 결제 승인된 금액
    private Integer amount;
    // 결제 완료 일시
    private LocalDateTime paidAt;

    @Builder
    public Payment(Order order, String impUid, PaymentStatus paymentStatus, Integer amount) {
        this.order = order;
        this.impUid = impUid;
        this.paymentStatus = paymentStatus;
        this.amount = amount;
        this.paidAt = LocalDateTime.now();
    }
}
