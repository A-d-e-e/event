package com.edutech.eventmanagementsystem.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edutech.eventmanagementsystem.entity.Event;
import com.edutech.eventmanagementsystem.service.EventService;

@RestController
public class StaffController {
    @Autowired
    private EventService eventService;


    @GetMapping("/api/staff/event-details/{eventId}")
    public ResponseEntity<Event> getEventDetails(@PathVariable Long eventId) {
        // get the event details by eventId and return the event with status code 200 ok
        return ResponseEntity.status(200).body(eventService.getEventDetails(eventId));
    }

    @PutMapping("/api/staff/update-setup/{eventId}")
    public ResponseEntity<Event> updateEventSetup(@PathVariable Long eventId, @RequestBody Event updatedEvent) {
        // update the event setup and return the updated event with status code 200 ok
        return ResponseEntity.status(200).body(eventService.updateEventSetup(eventId, updatedEvent));
    }
}