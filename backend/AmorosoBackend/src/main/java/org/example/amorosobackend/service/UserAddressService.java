package org.example.amorosobackend.service;

import lombok.AllArgsConstructor;
import org.example.amorosobackend.domain.User;
import org.example.amorosobackend.domain.UserAddress;
import org.example.amorosobackend.dto.UserAddressDto;
import org.example.amorosobackend.dto.UserControllerDTO;
import org.example.amorosobackend.repository.UserAddressRepository;
import org.example.amorosobackend.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserAddressService {

    UserAddressRepository userAddressRepository;
    UserRepository userRepository;

    public void registerAddress(UserControllerDTO.UserUpdateRequest request){
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("User not found"));


        if (user.getAddresses().size() >= 3) {
            throw new IllegalStateException("사용자는 최대 3개의 배송지만 등록할 수 있습니다.");
        }

        UserAddress address = UserAddress.builder()
                        .postalCode(request.getPostalCode())
                        .detailAddress(request.getDetailAddress())
                        .address(request.getAddress())
                        .build();

        user.addAddress(address);
        userRepository.save(user);

    }

    public UserAddressDto.GetAddress getDefaultAddress() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return toDto(userAddressRepository.findByUserAndIsDefaultTrue(user)
                .orElseThrow(() -> new IllegalStateException("기본 배송지가 설정되지 않았습니다.")));
    }

    @Transactional
    public void updateUserAddress(UserControllerDTO.UserUpdateRequest request) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // 기본 배송지를 찾음 (없으면 예외 발생)
        UserAddress address = userAddressRepository.findByUserAndIsDefaultTrue(user)
                .orElseThrow(() -> new IllegalStateException("기본 배송지를 찾을 수 없습니다."));

        // 기존 배송지 정보 업데이트
        address.updateAddress(
                request.getPostalCode(),
                request.getAddress(),
                request.getDetailAddress()
        );
    }

    public List<UserAddressDto.GetAddress> getAllAddresses() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<UserAddress> byUser = userAddressRepository.findByUser(user);
        return byUser.stream().map(this::toDto).collect(Collectors.toList());
    }

    public UserAddressDto.GetAddress toDto(UserAddress userAddress) {
        return UserAddressDto.GetAddress.builder()
                .addressId(userAddress.getAddressId())
                .recipientName(userAddress.getRecipientName())
                .phoneNumber(userAddress.getPhoneNumber())
                .postalCode(userAddress.getPostalCode())
                .address(userAddress.getAddress())
                .detailAddress(userAddress.getDetailAddress())
                .isDefault(userAddress.getIsDefault())
                .freeLoweringService(userAddress.getFreeLoweringService())
                .productInstallationAgreement(userAddress.getProductInstallationAgreement())
                .vehicleEntryPossible(userAddress.getVehicleEntryPossible())
                .elevatorType(userAddress.getElevatorType().name())
                .build();
    }
}




