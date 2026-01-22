package com.edutech.eventmanagementsystem.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edutech.eventmanagementsystem.entity.Feedback;
import com.edutech.eventmanagementsystem.service.FeedbackService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class FeedbackController {
    
    @Autowired
    private FeedbackService feedbackService;
    
    // Submit feedback for an event (CLIENT)
    @PostMapping("/client/feedback/{eventId}")
    public ResponseEntity<Map<String, Object>> submitFeedback(
            @PathVariable Long eventId,
            @RequestBody Feedback feedback) {
        try {
            Feedback savedFeedback = feedbackService.submitFeedback(eventId, feedback);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Feedback submitted successfully");
            response.put("feedback", savedFeedback);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Failed to submit feedback: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Get all verified feedbacks for an event (PUBLIC - no auth needed)
    @GetMapping("/public/feedbacks/{eventId}")
    public ResponseEntity<List<Feedback>> getEventFeedbacks(@PathVariable Long eventId) {
        try {
            List<Feedback> feedbacks = feedbackService.getEventFeedbacks(eventId);
            return ResponseEntity.ok(feedbacks);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    // Get all verified feedbacks (PUBLIC)
    @GetMapping("/public/feedbacks")
    public ResponseEntity<List<Feedback>> getAllVerifiedFeedbacks() {
        try {
            List<Feedback> feedbacks = feedbackService.getAllVerifiedFeedbacks();
            return ResponseEntity.ok(feedbacks);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    // Get feedback statistics for an event (PUBLIC)
    @GetMapping("/public/feedbacks/{eventId}/stats")
    public ResponseEntity<Map<String, Object>> getEventFeedbackStats(@PathVariable Long eventId) {
        try {
            Map<String, Object> stats = feedbackService.getEventFeedbackStats(eventId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    // Toggle feedback verification (PLANNER - for moderation)
    @PutMapping("/planner/feedback/{feedbackId}/verify")
    public ResponseEntity<Map<String, Object>> toggleVerification(@PathVariable Long feedbackId) {
        try {
            Feedback feedback = feedbackService.toggleVerification(feedbackId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Feedback verification updated");
            response.put("feedback", feedback);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Failed to update verification: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}