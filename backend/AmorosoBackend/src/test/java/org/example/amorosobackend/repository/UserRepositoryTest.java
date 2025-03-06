package org.example.amorosobackend.repository;

import org.example.amorosobackend.domain.User;
import org.example.amorosobackend.enums.UserRole;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
class UserRepositoryTest {

    @Autowired
    UserRepository userRepository; // 스프링 컨텍스트에서 주입

    @Test
    void findByEmail() {

        // given
        User user = User.builder()
                .email("test@example.com")
                .name("Test")
                .password("123456")
                .role("USER")  // role 필드 추가
                .build();

        userRepository.save(user);
        // when
        User byEmail = userRepository.findByEmail("test@example.com")
                .orElseThrow(() -> new NullPointerException("there is not email"));

        //then
        assertThat(user).isEqualTo(byEmail);
    }

    @Test
    void findBySocialProviderAndSocialId() {
        // given
        User user = User.builder()
                .email("test@example.com")
                .name("Test")
                .password("123456")
                .socialProvider("naver")
                .socialId("9999")
                .role("USER")  // role 필드 추가
                .build();

        userRepository.save(user);
        // when
        User bySocialId = userRepository.findBySocialProviderAndSocialId("naver", "9999")
                .orElseThrow(() -> new NullPointerException("there is not email"));

        //then
        assertThat(user).isEqualTo(bySocialId);

    }

    @Test
    void existsByEmail() {
        User user = User.builder()
                .email("test@example.com")
                .name("Test")
                .password("123456")
                .role("USER")  // role 필드 추가
                .build();

        userRepository.save(user);
        // when
        boolean exists = userRepository.existsByEmail("test@example.com");
        //then
        assertThat(exists).isTrue();
    }
}