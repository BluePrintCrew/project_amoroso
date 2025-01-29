package org.example.amorosobackend.repository;

import org.example.amorosobackend.domain.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest // Jpa repository에 대한 테스트를 자동으로 구성
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

    }

    @Test
    void existsByEmail() {
    }
}