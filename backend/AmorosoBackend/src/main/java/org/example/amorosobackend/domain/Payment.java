package org.example.amorosobackend.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.amorosobackend.enums.PaymentStatus;


import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;

    @OneToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(nullable = false)
    private String paymentMethod; // 결제 수단 (예: CARD, BANK_TRANSFER 등)

    @Column(nullable = false)
    private Integer amount; // 결제 금액

    @Column(nullable = false)
    private LocalDateTime paymentDate; // 결제 일시


    private String transactionId; // PG사에서 제공하는 거래 ID

    private String receiptUrl; // 영수증 URL
}
