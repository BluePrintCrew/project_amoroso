package org.example.amorosobackend.service;

import lombok.AllArgsConstructor;
import org.example.amorosobackend.domain.User;
import org.example.amorosobackend.domain.UserAddress;
import org.example.amorosobackend.dto.UserAddressDto;
import org.example.amorosobackend.dto.UserControllerDTO;
import org.example.amorosobackend.enums.ElevatorType;
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

    public UserAddressDto.GetAddress registerAddress(UserControllerDTO.UserUpdateOrRegisterRequest request){
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("User not found"));


        if (user.getAddresses().size() >= 3) {
            throw new IllegalStateException("User can register up to 3 addresses only.");
        }

        UserAddress address = UserAddress.builder()
                        .user(user)
                        .postalCode(request.getPostalCode())
                        .detailAddress(request.getDetailAddress())
                        .address(request.getAddress())
                        .build();

        user.addAddress(address);
        userRepository.save(user);

        return toDto(address);
    }

    public UserAddressDto.GetAddress getDefaultAddress() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return userAddressRepository.findByUserAndIsDefaultTrue(user)
                .map(this::toDto)
                .orElseGet(() -> {
                    // Set only addressId to null, others to default values (null or false)
                    UserAddressDto.GetAddress empty = new UserAddressDto.GetAddress();
                    empty.setAddressId(null);
                    // recipientName, phoneNumber, postalCode, address, detailAddress remain null
                    return empty;
                });
    }

    @Transactional
    public void updateUserAddress(UserControllerDTO.UserUpdateOrRegisterRequest request) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Find default address
        UserAddress address = userAddressRepository.findByUserAndIsDefaultTrue(user)
                .orElseGet(() -> {
                    // Create new default address if not exists
                    UserAddress newAddress = UserAddress.builder()
                            .user(user)
                            .postalCode(request.getPostalCode())
                            .address(request.getAddress())
                            .detailAddress(request.getDetailAddress())
                            .isDefault(true)
                            .build();
                    
                    // Set default values for required fields
                    newAddress.setFreeLoweringService(false);
                    newAddress.setProductInstallationAgreement(false);
                    newAddress.setVehicleEntryPossible(false);
                    newAddress.setElevatorType(ElevatorType.ONE_TO_SEVEN); // Set default value
                    
                    user.addAddress(newAddress);
                    return newAddress;
                });

        // Update existing address information
        address.updateAddress(
                request.getPostalCode(),
                request.getAddress(),
                request.getDetailAddress()
        );
    }

    @Transactional
    public void createUserAddress(UserControllerDTO.UserUpdateOrRegisterRequest request) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Find default address (throw exception if not exists)
        UserAddress address = userAddressRepository.findByUserAndIsDefaultTrue(user)
                .orElseThrow(() -> new IllegalStateException("Default address not found"));

        // Update existing address information
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




