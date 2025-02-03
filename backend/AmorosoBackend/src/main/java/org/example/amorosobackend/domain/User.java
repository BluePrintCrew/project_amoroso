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

    @Column(length = 20)
    private String role;  // USER, ADMIN 등

    private Boolean isActive;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

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
                 Boolean isActive) {
        this.email = email;
        this.password = password;
        this.socialProvider = socialProvider;
        this.socialId = socialId;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.role = role;
        // 기본값 설정
        this.isActive = (isActive != null) ? isActive : true;
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

    public void updateProfile(String name, String phoneNumber, String nickname) {
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.nickname = nickname;
    }
}
