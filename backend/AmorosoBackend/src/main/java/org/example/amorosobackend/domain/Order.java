package org.example.amorosobackend.domain;



import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private double totalPrice;

    @Column(length = 50)
    private String orderStatus;   // PENDING, PAID, SHIPPED, COMPLETED 등

    @Column(length = 50)
    private String paymentStatus; // WAITING, COMPLETED, CANCELED 등

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // 주문 상세
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();

    // 배송
    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private Shipment shipment;

    @Builder
    private Order(User user,
                  Double totalPrice,
                  String orderStatus,
                  String paymentStatus) {
        this.user = user;
        this.totalPrice = totalPrice;
        this.orderStatus = orderStatus;
        this.paymentStatus = paymentStatus;
    }

    @PrePersist
    public void onPrePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public void setOrderStatus( String orderStatus){
        this.orderStatus = orderStatus;
    }
    public void setTotalPrice( double totalPrice){
        this.totalPrice = totalPrice;
    }


    @PreUpdate
    public void onPreUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
