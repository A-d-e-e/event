package com.edutech.eventmanagementsystem.controller;


import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edutech.eventmanagementsystem.entity.Event;
import com.edutech.eventmanagementsystem.service.EventService;

@RestController
public class StaffController {

        
    private final EventService eventService;

    public StaffController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping("/api/staff/event-details/{eventId}")
    public ResponseEntity<?> getEventDetails(@PathVariable Long eventId) {
        Event event = eventService.getEventDetails(eventId);
        if (event != null) {
            return new ResponseEntity<>(event, HttpStatus.OK);
        } else {
            Map<String, String> body = new HashMap<>();
            body.put("message", "Event not found");
            return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/api/staff/update-setup/{eventId}")
    public ResponseEntity<?> updateEventSetup(@PathVariable Long eventId,
                                              @RequestBody Event updatedEvent) {
        try {
            Event event = eventService.updateEventSetup(eventId, updatedEvent);
            if (event != null) {
                return new ResponseEntity<>(event, HttpStatus.OK);
            } else {
                Map<String, String> body = new HashMap<>();
                body.put("message", "Failed to update event setup");
                return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (Exception e) {
            Map<String, String> body = new HashMap<>();
            body.put("message", "Failed to update event setup");
            return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

   
        // get the event details by eventId and return the event with status code 200 ok
    

  
    
        // update the event setup and return the updated event with status code 200 ok
    
}
