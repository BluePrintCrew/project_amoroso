package org.example.amorosobackend.repository;

import org.example.amorosobackend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findBySocialProviderAndSocialId(String socialProvider, String socialId);
    boolean existsByEmail(String email);
}