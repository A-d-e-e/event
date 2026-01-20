package com.edutech.eventmanagementsystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edutech.eventmanagementsystem.entity.Event;
import com.edutech.eventmanagementsystem.entity.Payment;
import com.edutech.eventmanagementsystem.service.EventService;
import com.edutech.eventmanagementsystem.service.PaymentService;

import javax.persistence.EntityNotFoundException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private EventService eventService;

    /**
     * Initiate payment for an event
     * POST /api/payment/initiate/{eventId}
     */
    @PostMapping("/initiate/{eventId}")
    public ResponseEntity<Payment> initiatePayment(@PathVariable Long eventId,
                                                   @RequestBody Payment payment) {
        try {
            Payment createdPayment = paymentService.initiatePayment(eventId, payment);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPayment);
        } catch (EntityNotFoundException e) {
            System.err.println("Event not found: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            System.err.println("Error initiating payment: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Process UPI payment
     * POST /api/payment/process-upi/{paymentId}
     */
    @PostMapping("/process-upi/{paymentId}")
    public ResponseEntity<Map<String, Object>> processUpiPayment(@PathVariable Long paymentId,
                                                                  @RequestBody Map<String, String> upiData) {
        try {
            String upiId = upiData.get("upiId");
            if (upiId == null || upiId.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(
                    Map.of("success", false, "message", "UPI ID is required")
                );
            }

            Payment payment = paymentService.processUpiPayment(paymentId, upiId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Payment processed successfully");
            response.put("payment", payment);
            
            return ResponseEntity.ok(response);
        } catch (EntityNotFoundException e) {
            System.err.println("Payment not found: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                Map.of("success", false, "message", e.getMessage())
            );
        } catch (Exception e) {
            System.err.println("Error processing UPI payment: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                Map.of("success", false, "message", "Failed to process payment")
            );
        }
    }

    /**
     * Get payment details by ID
     * GET /api/payment/{paymentId}
     */
    @GetMapping("/{paymentId}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Long paymentId) {
        try {
            Payment payment = paymentService.getPaymentById(paymentId);
            return ResponseEntity.ok(payment);
        } catch (EntityNotFoundException e) {
            System.err.println("Payment not found: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            System.err.println("Error fetching payment: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get all payments
     * GET /api/payment/all
     */
    @GetMapping("/all")
    public ResponseEntity<List<Payment>> getAllPayments() {
        try {
            List<Payment> payments = paymentService.getAllPayments();
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            System.err.println("Error fetching payments: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get payments by event ID
     * GET /api/payment/event/{eventId}
     */
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Payment>> getPaymentsByEventId(@PathVariable Long eventId) {
        try {
            List<Payment> payments = paymentService.getPaymentsByEventId(eventId);
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            System.err.println("Error fetching payments for event: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Calculate total amount for an event
     * GET /api/payment/calculate/{eventId}
     */
    @GetMapping("/calculate/{eventId}")
    public ResponseEntity<Map<String, Object>> calculateAmount(@PathVariable Long eventId) {
        try {
            Event event = eventService.getEventDetails(eventId);
            if (event == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    Map.of("success", false, "message", "Event not found")
                );
            }
            
            Double totalAmount = paymentService.calculateTotalAmount(event);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("eventId", eventId);
            response.put("eventTitle", event.getTitle());
            response.put("totalAmount", totalAmount);
            response.put("allocations", event.getAllocations());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error calculating amount: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                Map.of("success", false, "message", "Failed to calculate amount")
            );
        }
    }
}