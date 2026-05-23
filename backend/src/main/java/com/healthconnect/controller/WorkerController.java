package com.healthconnect.controller;

import com.healthconnect.model.*;
import com.healthconnect.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/worker")
public class WorkerController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private HealthRecordRepository healthRecordRepository;

    @Autowired
    private VaccinationRecordRepository vaccinationRepository;

    @Autowired
    private EmergencyRequestRepository emergencyRepository;

    @Autowired
    private AwarenessPostRepository awarenessPostRepository;

    private User getCurrentWorker() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username).orElseThrow();
    }

    // Appointment Management
    @GetMapping("/appointments")
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    @PutMapping("/appointments/{id}/status")
    public ResponseEntity<?> updateAppointmentStatus(@PathVariable Long id, @RequestParam String status) {
        Appointment app = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        app.setStatus(status.toUpperCase());
        appointmentRepository.save(app);
        return ResponseEntity.ok("Appointment status updated successfully!");
    }

    // Complaint / Environmental Health Management
    @GetMapping("/complaints")
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    @PutMapping("/complaints/{id}")
    public ResponseEntity<?> updateComplaint(@PathVariable Long id, 
                                             @RequestParam String status, 
                                             @RequestBody(required = false) String adminResponse) {
        Complaint comp = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        comp.setStatus(status.toUpperCase());
        if (adminResponse != null) {
            comp.setAdminResponse(adminResponse);
        }
        complaintRepository.save(comp);
        return ResponseEntity.ok("Complaint updated successfully!");
    }

    // Add Medical Record
    @PostMapping("/health-records")
    public ResponseEntity<?> addHealthRecord(@RequestParam Long citizenId, @RequestBody HealthRecord record) {
        User citizen = userRepository.findById(citizenId)
                .orElseThrow(() -> new RuntimeException("Citizen not found"));
        
        record.setCitizen(citizen);
        record.setRecordedBy(getCurrentWorker());
        
        HealthRecord saved = healthRecordRepository.save(record);
        return ResponseEntity.ok(saved);
    }

    // Add Vaccination Record
    @PostMapping("/vaccinations")
    public ResponseEntity<?> addVaccinationRecord(@RequestParam Long citizenId, @RequestBody VaccinationRecord record) {
        User citizen = userRepository.findById(citizenId)
                .orElseThrow(() -> new RuntimeException("Citizen not found"));
        
        record.setCitizen(citizen);
        record.setAdministeredBy(getCurrentWorker());
        
        VaccinationRecord saved = vaccinationRepository.save(record);
        return ResponseEntity.ok(saved);
    }

    // Publish Awareness post
    @PostMapping("/awareness")
    public ResponseEntity<?> createPost(@RequestBody AwarenessPost post) {
        post.setAuthor(getCurrentWorker());
        AwarenessPost saved = awarenessPostRepository.save(post);
        return ResponseEntity.ok(saved);
    }

    // SOS Dispatch Controls
    @GetMapping("/emergency")
    public List<EmergencyRequest> getAllEmergencies() {
        return emergencyRepository.findAll();
    }

    @PutMapping("/emergency/{id}/dispatch")
    public ResponseEntity<?> dispatchEmergency(@PathVariable Long id, @RequestParam String status) {
        EmergencyRequest req = emergencyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SOS request not found"));
        
        req.setStatus(status.toUpperCase());
        if ("RESOLVED".equals(status.toUpperCase())) {
            req.setResolvedAt(LocalDateTime.now());
        }
        emergencyRepository.save(req);
        return ResponseEntity.ok("Emergency request updated to: " + status);
    }
}
