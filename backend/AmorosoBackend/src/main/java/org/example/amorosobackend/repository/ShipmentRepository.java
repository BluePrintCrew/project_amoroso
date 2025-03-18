package org.example.amorosobackend.repository;

import org.example.amorosobackend.domain.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShipmentRepository extends JpaRepository<Shipment, Long> {

}
