package com.edutech.eventmanagementsystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edutech.eventmanagementsystem.entity.Event;
import com.edutech.eventmanagementsystem.service.EventService;
import com.edutech.eventmanagementsystem.service.PaymentService;

import javax.persistence.EntityNotFoundException;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class ClientController {

    @Autowired
    private EventService eventService;
    
    @Autowired
    private PaymentService paymentService;

    @GetMapping("/api/client/booking-details/{eventId}")
    public ResponseEntity<Event> getBookingDetails(@PathVariable Long eventId) {
        try {
            System.out.println("=== GET BOOKING DETAILS ===");
            System.out.println("Event ID: " + eventId);
            
            Event event = eventService.getEventDetails(eventId);
            if (event == null) {
                System.out.println("❌ Event not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            
            System.out.println("Event: " + event.getTitle());
            
            boolean hasPaid = paymentService.hasSuccessfulPayment(eventId);
            event.setPaymentCompleted(hasPaid);
            event.setPaymentStatus(hasPaid ? "PAID" : "PENDING");
            
            System.out.println("Payment Status: " + event.getPaymentStatus());
            
            return ResponseEntity.ok(event);
            
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/api/client/booking-details/search")
    public ResponseEntity<Event> searchBookingDetailsByTitle(@RequestParam String title) {
        try {
            System.out.println("=== SEARCH BOOKING ===");
            System.out.println("Title: " + title);
            
            if (title == null || title.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            List<Event> events = eventService.searchEventsByTitle(title.trim());
            
            if (events == null || events.isEmpty()) {
                System.out.println("❌ No events found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            
            Event event = events.get(0);
            System.out.println("Found: " + event.getTitle());
            
            boolean hasPaid = paymentService.hasSuccessfulPayment(event.getEventID());
            event.setPaymentCompleted(hasPaid);
            event.setPaymentStatus(hasPaid ? "PAID" : "PENDING");
            
            System.out.println("Payment Status: " + event.getPaymentStatus());
            
            return ResponseEntity.ok(event);
            
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/api/client/allEvents")
    public ResponseEntity<List<Event>> getAllEventsForClient() {
        try {
            List<Event> events = eventService.getAllEvents();
            
            events.forEach(event -> {
                try {
                    boolean hasPaid = paymentService.hasSuccessfulPayment(event.getEventID());
                    event.setPaymentCompleted(hasPaid);
                    event.setPaymentStatus(hasPaid ? "PAID" : "PENDING");
                } catch (Exception e) {
                    event.setPaymentCompleted(false);
                    event.setPaymentStatus("PENDING");
                }
            });
            
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/api/client/event-detailsbyTitleforClient/{title}")
    public ResponseEntity<Event> getEventDetailsByTitleForClient(@PathVariable String title) {
        try {
            if (title == null || title.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            List<Event> events = eventService.searchEventsByTitle(title.trim());
            
            if (events == null || events.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            
            Event event = events.get(0);
            
            boolean hasPaid = paymentService.hasSuccessfulPayment(event.getEventID());
            event.setPaymentCompleted(hasPaid);
            event.setPaymentStatus(hasPaid ? "PAID" : "PENDING");
            
            return ResponseEntity.ok(event);
            
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}