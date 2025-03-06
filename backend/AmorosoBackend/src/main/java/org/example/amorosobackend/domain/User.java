package org.example.amorosobackend.domain;



import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import org.example.amorosobackend.enums.UserRole;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(nullable = false, length = 50)
    private String name;

    private String socialProvider;  // kakao, naver, google 등
    private String socialId; // 각 플랫폼에서 제공받은 고유 id

    private String nickname;


    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private UserRole role;  // USER, ADMIN 등

    private Boolean isActive;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime birthDate;

    // 마케팅 및 위치정보 동의
    private Boolean emailConsent;     // 이메일 동의
    private Boolean smsConsent;       // SMS 동의
    private Boolean dmConsent;        // DM 동의
    private Boolean locationConsent;  // 위치정보 제공 동의

    // --- 연관관계 매핑 ---
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserAddress> addresses = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Wishlist> wishlists = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> cartItems = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Order> orders = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

//    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<ReformRequest> reformRequests = new ArrayList<>();

    // === 빌더 생성자 ===
    @Builder
    private User(String email,
                 String password,
                 String socialProvider,
                 String socialId,
                 String name,
                 String phoneNumber,
                 String role,
                 Boolean isActive,
                 Boolean emailConsent,
                 Boolean smsConsent,
                 Boolean dmConsent,
                 Boolean locationConsent) {
        this.email = email;
        this.password = password;
        this.socialProvider = socialProvider;
        this.socialId = socialId;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.role = UserRole.valueOf(role);
        // 기본값 설정
        this.isActive = (isActive != null) ? isActive : true;
        this.emailConsent = (emailConsent != null) ? emailConsent : false;
        this.smsConsent = (smsConsent != null) ? smsConsent : false;
        this.dmConsent = (dmConsent != null) ? dmConsent : false;
        this.locationConsent = (locationConsent != null) ? locationConsent : false;
    }

    @PrePersist
    public void onPrePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.isActive == null) {
            this.isActive = true;
        }
    }

    @PreUpdate
    public void onPreUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void updateProfile(String name, String email, String brithDate, String phoneNumber,
                             Boolean emailConsent, Boolean smsConsent, Boolean dmConsent, Boolean locationConsent) {


        this.name = name;
        this.email = email;
        this.birthDate = LocalDateTime.parse(brithDate, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        this.phoneNumber = phoneNumber;
        this.emailConsent = emailConsent;
        this.smsConsent = smsConsent;
        this.dmConsent = dmConsent;
        this.locationConsent = locationConsent;

    }
    public void addAddress(UserAddress address) {
        this.addresses.add(address);
    }

    public void removeAddress(UserAddress address) {
        this.addresses.remove(address);
    }
    public boolean canAddMoreAddresses() {
        return this.addresses.size() < 3;
    }

    public boolean isSeller() {
        return this.role == UserRole.ROLE_SELLER;
    }
}
