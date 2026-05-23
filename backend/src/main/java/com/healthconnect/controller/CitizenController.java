package com.healthconnect.controller;

import com.healthconnect.model.*;
import com.healthconnect.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/citizen")
public class CitizenController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HospitalRepository hospitalRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private EmergencyRequestRepository emergencyRepository;

    @Autowired
    private HealthRecordRepository healthRecordRepository;

    @Autowired
    private VaccinationRecordRepository vaccinationRepository;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private AwarenessPostRepository awarenessPostRepository;

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username).orElseThrow();
    }

    // Public / Citizen awareness feed
    @GetMapping("/awareness")
    public List<AwarenessPost> getAwarenessPosts() {
        return awarenessPostRepository.findByIsPublishedTrueOrderByCreatedAtDesc();
    }

    // Hospital Finder
    @GetMapping("/hospitals")
    public List<Hospital> getAllHospitals() {
        return hospitalRepository.findAll();
    }

    // Appointments
    @GetMapping("/appointments")
    public List<Appointment> getMyAppointments() {
        return appointmentRepository.findByCitizenId(getCurrentUser().getId());
    }

    @PostMapping("/appointments")
    public ResponseEntity<?> bookAppointment(@RequestBody Appointment appointment) {
        User citizen = getCurrentUser();
        appointment.setCitizen(citizen);
        
        // Lookup hospital
        Hospital hospital = hospitalRepository.findById(appointment.getHospital().getId())
                .orElseThrow(() -> new RuntimeException("Hospital not found"));
        appointment.setHospital(hospital);
        
        appointment.setQueueNumber((int) (Math.random() * 20) + 1);
        Appointment saved = appointmentRepository.save(appointment);
        return ResponseEntity.ok(saved);
    }

    // Complaints
    @GetMapping("/complaints")
    public List<Complaint> getMyComplaints() {
        return complaintRepository.findByCitizenId(getCurrentUser().getId());
    }

    @PostMapping("/complaints")
    public ResponseEntity<?> fileComplaint(@RequestBody Complaint complaint) {
        complaint.setCitizen(getCurrentUser());
        Complaint saved = complaintRepository.save(complaint);
        return ResponseEntity.ok(saved);
    }

    // Emergency SOS Trigger
    @GetMapping("/emergency")
    public List<EmergencyRequest> getMyEmergencies() {
        User user = getCurrentUser();
        return emergencyRepository.findAll().stream()
                .filter(req -> req.getCitizen() != null && req.getCitizen().getId().equals(user.getId()))
                .toList();
    }

    @PostMapping("/emergency")
    public ResponseEntity<?> triggerSOS(@RequestBody EmergencyRequest request) {
        request.setCitizen(getCurrentUser());
        request.setStatus("PENDING");
        EmergencyRequest saved = emergencyRepository.save(request);
        return ResponseEntity.ok(saved);
    }

    // Health History
    @GetMapping("/health-records")
    public List<HealthRecord> getMyHealthRecords() {
        return healthRecordRepository.findByCitizenIdOrderByCreatedAtDesc(getCurrentUser().getId());
    }

    // Immunizations
    @GetMapping("/vaccinations")
    public List<VaccinationRecord> getMyVaccinationRecords() {
        return vaccinationRepository.findByCitizenId(getCurrentUser().getId());
    }

    // Chat Support
    @GetMapping("/chat/{recipientId}")
    public List<ChatMessage> getChatHistory(@PathVariable Long recipientId) {
        return chatMessageRepository.findChatHistory(getCurrentUser().getId(), recipientId);
    }

    @PostMapping("/chat")
    public ResponseEntity<?> sendMessage(@RequestBody ChatMessage message) {
        message.setSender(getCurrentUser());
        
        User receiver = userRepository.findById(message.getReceiver().getId())
                .orElseThrow(() -> new RuntimeException("Recipient not found"));
        message.setReceiver(receiver);
        
        ChatMessage saved = chatMessageRepository.save(message);
        return ResponseEntity.ok(saved);
    }
}
