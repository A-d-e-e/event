package com.edutech.eventmanagementsystem.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edutech.eventmanagementsystem.entity.Event;
import com.edutech.eventmanagementsystem.entity.Feedback;
import com.edutech.eventmanagementsystem.repository.EventRepository;
import com.edutech.eventmanagementsystem.repository.FeedbackRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class FeedbackService {
    
    @Autowired
    private FeedbackRepository feedbackRepository;
    
    @Autowired
    private EventRepository eventRepository;
    
    // Submit feedback for an event
    public Feedback submitFeedback(Long eventId, Feedback feedback) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found"));
        
        feedback.setEvent(event);
        feedback.setIsVerified(true); // Auto-verify for now, can change to false for moderation
        
        return feedbackRepository.save(feedback);
    }
    
    // Get all verified feedbacks for an event
    public List<Feedback> getEventFeedbacks(Long eventId) {
        return feedbackRepository.findByEvent_EventIDAndIsVerifiedTrue(eventId);
    }
    
    // Get all verified feedbacks (general)
    public List<Feedback> getAllVerifiedFeedbacks() {
        return feedbackRepository.findByIsVerifiedTrueOrderByFeedbackDateDesc();
    }
    
    // Get feedback statistics for an event
    public Map<String, Object> getEventFeedbackStats(Long eventId) {
        List<Feedback> feedbacks = feedbackRepository.findByEvent_EventIDAndIsVerifiedTrue(eventId);
        
        Map<String, Object> stats = new HashMap<>();
        
        if (feedbacks.isEmpty()) {
            stats.put("averageRating", 0.0);
            stats.put("totalFeedbacks", 0);
            stats.put("ratingDistribution", new int[]{0, 0, 0, 0, 0});
            return stats;
        }
        
        int[] distribution = new int[5];
        double totalRating = 0.0;
        
        for (Feedback fb : feedbacks) {
            totalRating += fb.getRating();
            distribution[fb.getRating() - 1]++;
        }
        
        stats.put("averageRating", totalRating / feedbacks.size());
        stats.put("totalFeedbacks", feedbacks.size());
        stats.put("ratingDistribution", distribution);
        
        return stats;
    }
    
    // Verify/Unverify feedback (for moderation)
    public Feedback toggleVerification(Long feedbackId) {
        Feedback feedback = feedbackRepository.findById(feedbackId)
            .orElseThrow(() -> new RuntimeException("Feedback not found"));
        
        feedback.setIsVerified(!feedback.getIsVerified());
        return feedbackRepository.save(feedback);
    }
}