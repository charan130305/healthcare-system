package com.healthconnect.repository;

import com.healthconnect.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByCitizenId(Long citizenId);
    List<Appointment> findByHospitalId(Long hospitalId);
    List<Appointment> findByStatus(String status);
}
