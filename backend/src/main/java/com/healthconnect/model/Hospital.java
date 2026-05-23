package com.healthconnect.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "hospitals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hospital {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 255)
    private String address;

    @Column(nullable = false, length = 20)
    private String phone;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(nullable = false, length = 50)
    private String type; // 'Government' or 'Private'

    @Column(columnDefinition = "TEXT")
    private String specialties; // Comma-separated or JSON list

    @Column(name = "is_emergency_ready")
    private Boolean isEmergencyReady;

    @Column(precision = 2, scale = 1)
    private Double rating;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (isEmergencyReady == null) isEmergencyReady = true;
        if (rating == null) rating = 4.0;
    }
}
