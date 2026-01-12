package com.edutech.eventmanagementsystem.controller;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.edutech.eventmanagementsystem.entity.Event;
import com.edutech.eventmanagementsystem.service.EventService;


@RestController
public class ClientController {

 private final EventService eventService;

    public ClientController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping("/api/client/booking-details/{eventId}")
    public ResponseEntity<List<Event>> getBookingDetails(@PathVariable Long eventId) {
        Event event = eventService.getEventDetails(eventId);
        if (event == null) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        return ResponseEntity.ok(Collections.singletonList(event));
    }


}
