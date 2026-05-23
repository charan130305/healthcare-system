package com.healthconnect.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "awareness_posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AwarenessPost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false, length = 100)
    private String category; // 'Disease Alert', 'Vaccination', 'General Health', 'Nutrition'

    @Column(name = "image_url", length = 255)
    private String imageUrl;

    @Column(name = "video_url", length = 255)
    private String videoUrl;

    @Column(name = "is_published")
    private Boolean isPublished;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (isPublished == null) isPublished = true;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
