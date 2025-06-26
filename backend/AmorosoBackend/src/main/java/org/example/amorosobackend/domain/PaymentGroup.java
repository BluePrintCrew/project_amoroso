package org.example.amorosobackend.domain;

import jakarta.persistence.*;
import lombok.*;
import org.example.amorosobackend.enums.PaymentStatus;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "payment_groups")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class PaymentGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentGroupId;

    @Column(unique = true, nullable = false)
    private String paymentGroupCode; // "PG20250626001" 같은 고유 코드

    @Column(nullable = false)
    private Integer totalAmount; // 전체 결제 금액

    @Enumerated(EnumType.STRING)
    @Setter
    private PaymentStatus paymentStatus;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "paymentGroup", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Order> orders = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;


    @PreUpdate
    public void onPreUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void setTotalAmount(Integer totalAmount) {
        this.totalAmount = totalAmount;
    }

    public void addOrder(Order order) {
        this.orders.add(order);
        order.setPaymentGroup(this);
    }
}