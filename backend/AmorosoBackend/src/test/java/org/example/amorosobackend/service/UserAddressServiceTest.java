package org.example.amorosobackend.service;

import org.example.amorosobackend.domain.User;
import org.example.amorosobackend.domain.UserAddress;
import org.example.amorosobackend.dto.UserControllerDTO;
import org.example.amorosobackend.enums.ElevatorType;
import org.example.amorosobackend.enums.UserRole;
import org.example.amorosobackend.repository.UserAddressRepository;
import org.example.amorosobackend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.ArrayList;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserAddressServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserAddressRepository userAddressRepository;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private UserAddressService userAddressService;

    private static final String TEST_EMAIL = "test@example.com";
    private User testUser;
    private UserAddress testAddress;
    private UserControllerDTO.UserUpdateOrRegisterRequest testRequest;

    @BeforeEach
    void setUp() {
        // Setup SecurityContext mock
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(TEST_EMAIL);
        SecurityContextHolder.setContext(securityContext);

        // Setup test user
        testUser = User.builder()
                .email(TEST_EMAIL)
                .name("Test User")
                .password("password")
                .role(UserRole.ROLE_USER.name())
                .build();

        // Setup test address
        testAddress = UserAddress.builder()
                .user(testUser)
                .postalCode("12345")
                .address("Test Address")
                .detailAddress("Test Detail Address")
                .isDefault(true)
                .build();
        testAddress.setElevatorType(ElevatorType.ONE_TO_SEVEN);

        // Setup test request
        testRequest = new UserControllerDTO.UserUpdateOrRegisterRequest();
        testRequest.setPostalCode("54321");
        testRequest.setAddress("New Address");
        testRequest.setDetailAddress("New Detail Address");
    }

    @Test
    @DisplayName("Should update user address successfully when default address exists")
    void updateUserAddress_WithExistingDefaultAddress_ShouldUpdateSuccessfully() {
        // Given
        when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(testUser));
        when(userAddressRepository.findByUserAndIsDefaultTrue(testUser)).thenReturn(Optional.of(testAddress));

        // When
        userAddressService.updateUserAddress(testRequest);

        // Then
        assertThat(testAddress.getPostalCode()).isEqualTo(testRequest.getPostalCode());
        assertThat(testAddress.getAddress()).isEqualTo(testRequest.getAddress());
        assertThat(testAddress.getDetailAddress()).isEqualTo(testRequest.getDetailAddress());
        verify(userRepository, times(1)).findByEmail(TEST_EMAIL);
        verify(userAddressRepository, times(1)).findByUserAndIsDefaultTrue(testUser);
    }

    @Test
    @DisplayName("Should create new default address when no default address exists")
    void updateUserAddress_WithNoDefaultAddress_ShouldCreateNewAddress() {
        // Given
        when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(testUser));
        when(userAddressRepository.findByUserAndIsDefaultTrue(testUser)).thenReturn(Optional.empty());

        // When
        userAddressService.updateUserAddress(testRequest);

        // Then
        verify(userRepository, times(1)).findByEmail(TEST_EMAIL);
        verify(userAddressRepository, times(1)).findByUserAndIsDefaultTrue(testUser);
        assertThat(testUser.getAddresses()).hasSize(1);
        
        UserAddress newAddress = testUser.getAddresses().get(0);
        assertThat(newAddress.getPostalCode()).isEqualTo(testRequest.getPostalCode());
        assertThat(newAddress.getAddress()).isEqualTo(testRequest.getAddress());
        assertThat(newAddress.getDetailAddress()).isEqualTo(testRequest.getDetailAddress());
        assertThat(newAddress.getIsDefault()).isTrue();
        assertThat(newAddress.getElevatorType()).isEqualTo(ElevatorType.ONE_TO_SEVEN);
    }

    @Test
    @DisplayName("Should throw exception when user not found")
    void updateUserAddress_WithNonExistentUser_ShouldThrowException() {
        // Given
        when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> userAddressService.updateUserAddress(testRequest))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("User not found");
    }

    @Test
    @DisplayName("Should throw exception when trying to register more than 3 addresses")
    void registerAddress_WithMoreThanThreeAddresses_ShouldThrowException() {
        // Given
        testUser.getAddresses().add(UserAddress.builder().build());
        testUser.getAddresses().add(UserAddress.builder().build());
        testUser.getAddresses().add(UserAddress.builder().build());
        when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(testUser));

        // When & Then
        assertThatThrownBy(() -> userAddressService.registerAddress(testRequest))
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("User can register up to 3 addresses only.");
    }
} 