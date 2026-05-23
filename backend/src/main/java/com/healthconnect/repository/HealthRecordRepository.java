package com.healthconnect.repository;

import com.healthconnect.model.HealthRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HealthRecordRepository extends JpaRepository<HealthRecord, Long> {
    List<HealthRecord> findByCitizenIdOrderByCreatedAtDesc(Long citizenId);
}
