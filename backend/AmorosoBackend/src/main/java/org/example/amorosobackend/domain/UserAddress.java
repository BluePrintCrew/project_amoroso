package org.example.amorosobackend.domain;
import jakarta.persistence.*;
import lombok.*;
import org.example.amorosobackend.enums.ElevatorType;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_addresses")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserAddress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long addressId;

    @ManyToOne
    @Setter
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String recipientName;
    private String phoneNumber;

    @Column(nullable = false)
    private String postalCode; // 우편번호

    @Column(nullable = false)
    private String address; // 기본 주소 (도로명 주소 또는 지번 주소)
    @Column(nullable = false)
    private String detailAddress; // 상세 주소 (건물명, 동호수 등)

    private Boolean isDefault;

    @Setter
    private Boolean freeLoweringService;
    @Setter
    private Boolean productInstallationAgreement;
    @Setter
    private Boolean vehicleEntryPossible;

    @Setter
    @Enumerated(EnumType.STRING)
    private ElevatorType elevatorType;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Builder
    public UserAddress(User user,
                       String recipientName,
                       String phoneNumber,
                       String postalCode,
                       String address,
                       String detailAddress,
                       Boolean isDefault) {
        this.user = user;
        this.recipientName = recipientName;
        this.phoneNumber = phoneNumber;
        this.postalCode = postalCode;
        this.address = address;
        this.detailAddress = detailAddress;
        this.isDefault = (isDefault != null) ? isDefault : false;
    }

    @PrePersist
    public void onPrePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.isDefault == null) {
            this.isDefault = false;
        }
    }

    @PreUpdate
    public void onPreUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void updateAddress(String postalCode, String address, String detailAddress) {
        this.postalCode = postalCode;
        this.detailAddress = detailAddress;
        this.address =address;
    }
}