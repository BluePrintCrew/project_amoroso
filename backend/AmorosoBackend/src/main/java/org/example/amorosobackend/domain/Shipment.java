package org.example.amorosobackend.domain;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "shipments")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Shipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long shipmentId;

    @OneToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    private String trackingNumber;
    private String courierName;

    @Column(length = 50)
    private String shipmentStatus;  // READY, IN_TRANSIT, DELIVERED 등

    private LocalDateTime shippedAt;
    private LocalDateTime deliveredAt;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Builder
    private Shipment(Order order,
                     String trackingNumber,
                     String courierName,
                     String shipmentStatus,
                     LocalDateTime shippedAt,
                     LocalDateTime deliveredAt) {
        this.order = order;
        this.trackingNumber = trackingNumber;
        this.courierName = courierName;
        this.shipmentStatus = shipmentStatus;
        this.shippedAt = shippedAt;
        this.deliveredAt = deliveredAt;
    }

    @PrePersist
    public void onPrePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onPreUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
