package com.healthconnect.repository;

import com.healthconnect.model.AwarenessPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AwarenessPostRepository extends JpaRepository<AwarenessPost, Long> {
    List<AwarenessPost> findByIsPublishedTrueOrderByCreatedAtDesc();
    List<AwarenessPost> findByCategory(String category);
}
