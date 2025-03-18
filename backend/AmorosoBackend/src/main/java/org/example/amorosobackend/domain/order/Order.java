package org.example.amorosobackend.domain.order;



import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import org.example.amorosobackend.domain.Shipment;
import org.example.amorosobackend.domain.User;
import org.example.amorosobackend.domain.coupon.UserCoupon;
import org.example.amorosobackend.enums.ElevatorType;
import org.example.amorosobackend.enums.OrderStatus;
import org.example.amorosobackend.enums.PaymentStatus;

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

    @OneToOne
    @JoinColumn(name ="user_coupon_id")
    private UserCoupon usercoupon;

    private Integer totalPrice;

    private Integer discountPrice; // coupon으로 감소된 가격

    // 해당 내용들 일단 order에 지정
    private Boolean freeLoweringService;
    private Boolean productInstallationAgreement;
    private Boolean vehicleEntryPossible;

    @Enumerated(EnumType.STRING)
    private ElevatorType elevatorType;

    @Column(length = 50)
    private OrderStatus orderStatus;   // PENDING, PAID, SHIPPED, COMPLETED 등

    @Column(length = 50)
    private PaymentStatus paymentStatus; // WAITING, COMPLETED, CANCELED 등

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
                  Integer totalPrice,
                  OrderStatus orderStatus,
                  PaymentStatus paymentStatus,
                  ElevatorType elevatorType,
                  Boolean freeLoweringService,
                  Boolean productInstallationAgreement,
                  Boolean vehicleEntryPossible) {
        this.user = user;
        this.totalPrice = totalPrice;
        this.orderStatus = orderStatus;
        this.paymentStatus = paymentStatus;
        this.freeLoweringService = freeLoweringService;
        this.productInstallationAgreement = productInstallationAgreement;
        this.vehicleEntryPossible =vehicleEntryPossible;
        this.elevatorType = elevatorType;

    }

    @PrePersist
    public void onPrePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public void setOrderStatus( OrderStatus orderStatus){
        this.orderStatus = orderStatus;
    }
    public void setTotalPrice( Integer totalPrice){
        this.totalPrice = totalPrice;
    }


    @PreUpdate
    public void onPreUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
