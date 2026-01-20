package com.edutech.eventmanagementsystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edutech.eventmanagementsystem.entity.Event;
import com.edutech.eventmanagementsystem.service.EventService;

import javax.persistence.EntityNotFoundException;
import java.util.List;

@RestController
@CrossOrigin(origins = "*") // Enable CORS for all origins
public class ClientController {

    @Autowired
    private EventService eventService;

    /**
     * Get booking details by Event ID
     * Endpoint: GET /api/client/booking-details/{eventId}
     * Returns: Event object with all details including allocations and prices
     */
    @GetMapping("/api/client/booking-details/{eventId}")
    public ResponseEntity<Event> getBookingDetails(@PathVariable Long eventId) {
        try {
            Event event = eventService.getEventDetails(eventId);
            if (event != null) {
                return ResponseEntity.ok(event);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (EntityNotFoundException e) {
            System.err.println("Event not found: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            System.err.println("Error fetching booking details: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Search booking details by Event Title
     * Endpoint: GET /api/client/booking-details/search?title={title}
     * Returns: First matching Event object with allocations and prices
     */
    @GetMapping("/api/client/booking-details/search")
    public ResponseEntity<Event> searchBookingDetailsByTitle(@RequestParam String title) {
        try {
            if (title == null || title.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            List<Event> events = eventService.searchEventsByTitle(title.trim());
            
            if (events != null && !events.isEmpty()) {
                // Return the first matching event
                return ResponseEntity.ok(events.get(0));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (Exception e) {
            System.err.println("Error searching booking details by title: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get all events for client view
     * Endpoint: GET /api/client/allEvents
     * Returns: List of all events with allocations
     */
    @GetMapping("/api/client/allEvents")
    public ResponseEntity<List<Event>> getAllEventsForClient() {
        try {
            List<Event> events = eventService.getAllEvents();
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            System.err.println("Error fetching all events for client: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get event details by title for client (alternative endpoint)
     * Endpoint: GET /api/client/event-detailsbyTitleforClient/{title}
     * Returns: Event object matching the title
     */
    @GetMapping("/api/client/event-detailsbyTitleforClient/{title}")
    public ResponseEntity<Event> getEventDetailsByTitleForClient(@PathVariable String title) {
        try {
            if (title == null || title.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            List<Event> events = eventService.searchEventsByTitle(title.trim());
            
            if (events != null && !events.isEmpty()) {
                return ResponseEntity.ok(events.get(0));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (Exception e) {
            System.err.println("Error fetching event details by title for client: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}