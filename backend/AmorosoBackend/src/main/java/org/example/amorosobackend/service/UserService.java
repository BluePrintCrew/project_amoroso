package org.example.amorosobackend.service;


import lombok.RequiredArgsConstructor;
import org.example.amorosobackend.controller.UserController;
import org.example.amorosobackend.domain.User;
import org.example.amorosobackend.dto.*;
import org.example.amorosobackend.repository.UserRepository;
import org.example.amorosobackend.security.JwtProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;
import org.example.amorosobackend.dto.UserControllerDTO.*;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;

    public void registerUser(UserControllerDTO.UserRegistrationRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .phoneNumber(request.getPhoneNumber())
                .role("ROLE_USER")
                .build();
        userRepository.save(user);
    }

    // access token 받은 후 , 유저 로그인 하도록 처리
    public LoginResponse loginUser(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        // 매치가 되지 않는다면, invalid 처리
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String accessToken = jwtProvider.createToken(user.getEmail(), user.getRole().name());
        LoginResponse loginResponse = new LoginResponse(accessToken);
        return loginResponse;
    }

    public UserControllerDTO.OAuth2LoginResponse socialLogin(String provider, UserControllerDTO.OAuth2LoginRequest request) {
        // Implementation using CustomOAuth2UserService logic.
        return null; // Placeholder
    }

    public UserControllerDTO.UserProfileResponse getCurrentUserProfile() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("User not found"));

        return new UserProfileResponse(user.getEmail(), user.getName(), user.getPhoneNumber(), user.getRole().name(), user.getNickname());
    }

    public void updateUserProfile(UserControllerDTO.UserUpdateRequest request) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.updateProfile(request.getName(), request.getPhoneNumber(), request.getNickname());
        userRepository.save(user);
    }

    public void deleteCurrentUser() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("User not found"));

        userRepository.delete(user);
    }
}