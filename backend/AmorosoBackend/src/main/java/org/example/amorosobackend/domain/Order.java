package org.example.amorosobackend.domain;



import lombok.*;
import jakarta.persistence.*;
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_group_id")
    @Setter
    private PaymentGroup paymentGroup;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    private Seller seller; // 이제 하나의 seller는 하나의 order를 가지고있따.

    @Column(name = "order_code", unique = true)
    private String orderCode; // - orderCode 추가 : 주문번호를 보고 seller가 배송을 보내기 위함

    @OneToOne
    @JoinColumn(name = "address_id")
    private UserAddress userAddress;

    @OneToOne
    @JoinColumn(name ="user_coupon_id")
    private UserCoupon usercoupon;

    private Integer totalPrice;

    private Integer discountPrice; // coupon으로 감소된 가격

    // 해당 내용들 일단 order에 지정
    private Boolean freeLoweringService;
    private Boolean productInstallationAgreement;
    private Boolean vehicleEntryPossible;
    private String deliveryRequest;

    @Enumerated(EnumType.STRING)
    private ElevatorType elevatorType;

    @Column(length = 50)
    private OrderStatus orderStatus;   // PENDING, PAID, SHIPPED, COMPLETED 등

    @Column(length = 50)
    @Setter
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
                  Seller seller,
                  String orderCode,
                  OrderStatus orderStatus,
                  PaymentStatus paymentStatus,
                  ElevatorType elevatorType,
                  Boolean freeLoweringService,
                  Boolean productInstallationAgreement,
                  Boolean vehicleEntryPossible,
                  String deliveryRequest,
                  UserAddress userAddress) {
        this.user = user;
        this.totalPrice = totalPrice;
        this.seller = seller;
        this.orderCode = orderCode;
        this.orderStatus = orderStatus;
        this.paymentStatus = paymentStatus;
        this.freeLoweringService = freeLoweringService;
        this.productInstallationAgreement = productInstallationAgreement;
        this.vehicleEntryPossible =vehicleEntryPossible;
        this.elevatorType = elevatorType;
        this.deliveryRequest = deliveryRequest;
        this.userAddress = userAddress;

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
