package com.edutech.eventmanagementsystem.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.edutech.eventmanagementsystem.entity.Feedback;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    
    // Find all verified feedbacks for an event
    List<Feedback> findByEvent_EventIDAndIsVerifiedTrue(Long eventId);
    
    // Find all feedbacks for an event (for planner/admin)
    List<Feedback> findByEvent_EventID(Long eventId);
    
    // Find all verified feedbacks (for general viewing)
    List<Feedback> findByIsVerifiedTrueOrderByFeedbackDateDesc();
    
    // Count verified feedbacks by rating for statistics
    Long countByEvent_EventIDAndRatingAndIsVerifiedTrue(Long eventId, Integer rating);
}