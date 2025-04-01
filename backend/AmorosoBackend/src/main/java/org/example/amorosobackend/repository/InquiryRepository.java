package org.example.amorosobackend.repository;

import io.micrometer.observation.ObservationFilter;
import org.example.amorosobackend.domain.Inquiry;
import org.example.amorosobackend.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InquiryRepository extends JpaRepository<Inquiry, Long> {
    Page<Inquiry> findAllByProduct_ProductId(Long productId, Pageable pageable); // 특정 상품의 문의만 페이징 조회


    Page<Inquiry> findAllByUser(User user, Pageable pageable);

}
