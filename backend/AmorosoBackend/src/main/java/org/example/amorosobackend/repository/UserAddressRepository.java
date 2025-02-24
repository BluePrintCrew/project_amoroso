package org.example.amorosobackend.repository;

import org.example.amorosobackend.domain.User;
import org.example.amorosobackend.domain.UserAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserAddressRepository extends JpaRepository<UserAddress, Long> {

    // 기본 배송지 조회 (isDefault = true 인 주소 찾기)
    Optional<UserAddress> findByUserAndIsDefaultTrue(User user);

    // 사용자의 모든 배송지 조회
    List<UserAddress> findByUser(User user);

    // 특정 배송지를 업데이트하는 JPQL (주소 정보만 수정)
    @Query("UPDATE UserAddress a SET a.postalCode = :postalCode, a.address = :address, a.detailAddress = :detailAddress, a.updatedAt = CURRENT_TIMESTAMP WHERE a.addressId = :addressId")
    void updateAddress(
            @Param("addressId") Long addressId,
            @Param("postalCode") String postalCode,
            @Param("address") String address,
            @Param("detailAddress") String detailAddress
    );
}
