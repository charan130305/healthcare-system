package com.healthconnect.controller;

import com.healthconnect.model.*;
import com.healthconnect.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private HospitalRepository hospitalRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private EmergencyRequestRepository emergencyRepository;

    @Autowired
    private VaccinationRecordRepository vaccinationRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    // User Management
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestParam String roleName) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Role role = roleRepository.findByName("ROLE_" + roleName.toUpperCase())
                .orElseThrow(() -> new RuntimeException("Role not found"));
        
        user.setRole(role);
        userRepository.save(user);
        return ResponseEntity.ok("User role updated successfully!");
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted successfully!");
    }

    // Hospital Facility Management
    @PostMapping("/hospitals")
    public ResponseEntity<?> addHospital(@RequestBody Hospital hospital) {
        Hospital saved = hospitalRepository.save(hospital);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/hospitals/{id}")
    public ResponseEntity<?> updateHospital(@PathVariable Long id, @RequestBody Hospital hospitalDetails) {
        Hospital hospital = hospitalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hospital not found"));
        
        hospital.setName(hospitalDetails.getName());
        hospital.setAddress(hospitalDetails.getAddress());
        hospital.setPhone(hospitalDetails.getPhone());
        hospital.setLatitude(hospitalDetails.getLatitude());
        hospital.setLongitude(hospitalDetails.getLongitude());
        hospital.setType(hospitalDetails.getType());
        hospital.setSpecialties(hospitalDetails.getSpecialties());
        hospital.setIsEmergencyReady(hospitalDetails.getIsEmergencyReady());
        
        hospitalRepository.save(hospital);
        return ResponseEntity.ok("Hospital updated successfully!");
    }

    @DeleteMapping("/hospitals/{id}")
    public ResponseEntity<?> deleteHospital(@PathVariable Long id) {
        hospitalRepository.deleteById(id);
        return ResponseEntity.ok("Hospital deleted successfully!");
    }

    // Public Health Analytics Dashboard
    @GetMapping("/analytics")
    public ResponseEntity<?> getSystemAnalytics() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalUsers", userRepository.count());
        stats.put("totalHospitals", hospitalRepository.count());
        stats.put("totalAppointments", appointmentRepository.count());
        stats.put("totalComplaints", complaintRepository.count());
        stats.put("totalSOSAlerts", emergencyRepository.count());
        
        // Count statuses
        long pendingComplaints = complaintRepository.findByStatus("PENDING").size();
        long resolvedComplaints = complaintRepository.findByStatus("RESOLVED").size();
        stats.put("pendingComplaints", pendingComplaints);
        stats.put("resolvedComplaints", resolvedComplaints);
        
        long pendingSOS = emergencyRepository.findByStatus("PENDING").size();
        stats.put("activeSOSAlerts", pendingSOS);

        // Simulated distribution for charts
        stats.put("diseaseTrends", List.of(
            Map.of("name", "Malaria", "cases", 24),
            Map.of("name", "Dengue", "cases", 45),
            Map.of("name", "Influenza", "cases", 78),
            Map.of("name", "Waterborne", "cases", 15)
        ));

        stats.put("regionalStats", List.of(
            Map.of("region", "Rampur Village", "citizens", 120, "cases", 12),
            Map.of("region", "Sujanpur", "citizens", 85, "cases", 8),
            Map.of("region", "Gopalganj", "citizens", 210, "cases", 23),
            Map.of("region", "Fatehpur", "citizens", 95, "cases", 5)
        ));

        return ResponseEntity.ok(stats);
    }

    // Broadcast Notifications
    @PostMapping("/broadcast")
    public ResponseEntity<?> broadcastNotification(@RequestParam String title, @RequestParam String message) {
        List<User> allUsers = userRepository.findAll();
        for (User user : allUsers) {
            Notification notif = Notification.builder()
                    .user(user)
                    .title(title)
                    .message(message)
                    .type("ALERT")
                    .isRead(false)
                    .build();
            notificationRepository.save(notif);
        }
        return ResponseEntity.ok("Notification broadcasted to " + allUsers.size() + " users!");
    }
}
