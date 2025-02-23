package org.example.amorosobackend.repository;

import org.example.amorosobackend.domain.UserAddress;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAddressRepository extends JpaRepository<UserAddress, Long> {

}
