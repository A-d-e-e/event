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

    @PostMapping("/initiate/{eventId}")
    public ResponseEntity<?> initiatePayment(@PathVariable Long eventId, @RequestBody Payment payment) {
        try {
            System.out.println("=== INITIATE PAYMENT API CALLED ===");
            System.out.println("Event ID: " + eventId);
            
            Payment createdPayment = paymentService.initiatePayment(eventId, payment);
            System.out.println("✅ Payment created: " + createdPayment.getPaymentID());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPayment);
            
        } catch (EntityNotFoundException e) {
            System.err.println("❌ Event not found: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                Map.of("error", "Event not found", "message", e.getMessage())
            );
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                Map.of("error", "Failed to initiate payment", "message", e.getMessage())
            );
        }
    }

    @PostMapping("/process-upi/{paymentId}")
    public ResponseEntity<?> processUpiPayment(@PathVariable Long paymentId, @RequestBody Map<String, String> upiData) {
        try {
            System.out.println("=== PROCESS UPI API CALLED ===");
            System.out.println("Payment ID: " + paymentId);
            
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
            
            System.out.println("✅ Payment successful");
            
            return ResponseEntity.ok(response);
            
        } catch (EntityNotFoundException e) {
            System.err.println("❌ Payment not found: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                Map.of("success", false, "message", e.getMessage())
            );
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                Map.of("success", false, "message", "Payment processing failed: " + e.getMessage())
            );
        }
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<?> getPaymentById(@PathVariable Long paymentId) {
        try {
            Payment payment = paymentService.getPaymentById(paymentId);
            return ResponseEntity.ok(payment);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                Map.of("error", "Payment not found")
            );
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Payment>> getAllPayments() {
        List<Payment> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Payment>> getPaymentsByEventId(@PathVariable Long eventId) {
        List<Payment> payments = paymentService.getPaymentsByEventId(eventId);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/calculate/{eventId}")
    public ResponseEntity<?> calculateAmount(@PathVariable Long eventId) {
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
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                Map.of("success", false, "message", e.getMessage())
            );
        }
    }
}
