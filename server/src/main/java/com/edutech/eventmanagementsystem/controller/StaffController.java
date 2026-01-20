package com.edutech.eventmanagementsystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edutech.eventmanagementsystem.entity.Event;
import com.edutech.eventmanagementsystem.entity.Message;
import com.edutech.eventmanagementsystem.service.EventService;
import com.edutech.eventmanagementsystem.service.MessageService;

import java.util.Collections;
import java.util.List;

@RestController
public class StaffController {
    
    @Autowired
    private EventService eventService;
    
    @Autowired
    private MessageService messageService;
    
    @GetMapping("/api/staff/event-details/{eventId}")
    public ResponseEntity<Event> getEventDetails(@PathVariable Long eventId) {
        return ResponseEntity.status(200).body(eventService.getEventDetails(eventId));
    }
    
    @PutMapping("/api/staff/update-setup/{eventId}")
    public ResponseEntity<Event> updateEventSetup(@PathVariable Long eventId, @RequestBody Event updatedEvent) {
        return ResponseEntity.status(200).body(eventService.updateEventSetup(eventId, updatedEvent));
    }
    
    // ==================== MESSAGE ENDPOINTS ====================
    
    @PostMapping("/api/staff/messages")
    public ResponseEntity<?> sendMessageToPlanner(@RequestBody Message message) {
        try {
            message.setSenderRole("STAFF");
            Message savedMessage = messageService.sendMessage(message);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedMessage);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("message", "Failed to send message"));
        }
    }

    @GetMapping("/api/staff/messages/{eventId}")
    public ResponseEntity<List<Message>> getMessages(@PathVariable Long eventId) {
        try {
            List<Message> messages = messageService.getMessagesByEventId(eventId);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}