package com.healthconnect.repository;

import com.healthconnect.model.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Long> {
    List<Hospital> findByType(String type);
    List<Hospital> findByIsEmergencyReady(Boolean isEmergencyReady);
}
