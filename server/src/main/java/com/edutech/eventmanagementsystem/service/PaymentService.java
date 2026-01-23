package com.edutech.eventmanagementsystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.edutech.eventmanagementsystem.entity.Event;
import com.edutech.eventmanagementsystem.entity.Payment;
import com.edutech.eventmanagementsystem.repository.EventRepository;
import com.edutech.eventmanagementsystem.repository.PaymentRepository;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private EventRepository eventRepository;

    @Transactional
    public Payment initiatePayment(Long eventId, Payment payment) {
        try {
            System.out.println("=== INITIATING PAYMENT ===");
            System.out.println("Event ID: " + eventId);
            
            Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found with ID: " + eventId));
            
            System.out.println("Event Title: " + event.getTitle());
            
            payment.setEvent(event);
            payment.setPaymentStatus("PENDING");
            payment.setPaymentDate(LocalDateTime.now());
            
            Payment saved = paymentRepository.save(payment);
            paymentRepository.flush();
            
            System.out.println("✅ Payment initiated successfully");
            System.out.println("   Payment ID: " + saved.getPaymentID());
            
            return saved;
        } catch (Exception e) {
            System.err.println("❌ ERROR in initiatePayment: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Transactional
    public Payment processUpiPayment(Long paymentId, String upiId) {
        try {
            System.out.println("=== PROCESSING UPI PAYMENT ===");
            System.out.println("Payment ID: " + paymentId);
            
            Payment payment = paymentRepository.findById(paymentId).orElse(null);
            
            if (payment == null) {
                System.err.println("❌ Payment not found: " + paymentId);
                throw new EntityNotFoundException("Payment not found with ID: " + paymentId);
            }
            
            Event event = payment.getEvent();
            if (event == null) {
                throw new RuntimeException("Payment has no associated event");
            }
            
            System.out.println("Event ID: " + event.getEventID());
            
            payment.setUpiId(upiId);
            payment.setPaymentStatus("SUCCESS");
            payment.setTransactionId(generateTransactionId());
            payment.setPaymentDate(LocalDateTime.now());
            
            Payment savedPayment = paymentRepository.save(payment);
            paymentRepository.flush();
            
            System.out.println("✅ Payment updated: " + savedPayment.getTransactionId());
            
            event.setPaymentCompleted(true);
            event.setPaymentStatus("PAID");
            Event savedEvent = eventRepository.save(event);
            eventRepository.flush();
            
            System.out.println("✅ Event updated: payment_completed=" + savedEvent.getPaymentCompleted());
            
            return savedPayment;
            
        } catch (Exception e) {
            System.err.println("❌ ERROR: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public Payment getPaymentById(Long paymentId) {
        return paymentRepository.findById(paymentId)
            .orElseThrow(() -> new EntityNotFoundException("Payment not found"));
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public List<Payment> getPaymentsByEventId(Long eventId) {
        Event event = eventRepository.findById(eventId).orElse(null);
        if (event == null) return List.of();
        return paymentRepository.findByEvent(event);
    }

    public boolean hasSuccessfulPayment(Long eventId) {
        try {
            System.out.println("=== CHECKING PAYMENT STATUS ===");
            System.out.println("Event ID: " + eventId);
            
            Event event = eventRepository.findById(eventId).orElse(null);
            if (event == null) {
                System.out.println("❌ Event not found");
                return false;
            }
            
            System.out.println("payment_completed: " + event.getPaymentCompleted());
            
            if (Boolean.TRUE.equals(event.getPaymentCompleted())) {
                System.out.println("✅ Event is PAID");
                return true;
            }
            
            boolean hasPayment = paymentRepository.existsByEventAndPaymentStatus(event, "SUCCESS");
            System.out.println("Payment record exists: " + hasPayment);
            
            if (hasPayment) {
                System.out.println("⚠️ FIXING event status");
                event.setPaymentCompleted(true);
                event.setPaymentStatus("PAID");
                eventRepository.save(event);
                eventRepository.flush();
            }
            
            return hasPayment;
            
        } catch (Exception e) {
            System.err.println("❌ ERROR: " + e.getMessage());
            return false;
        }
    }

    public Payment getLatestSuccessfulPayment(Long eventId) {
        Event event = eventRepository.findById(eventId).orElse(null);
        if (event == null) return null;
        return paymentRepository.findFirstByEventAndPaymentStatusOrderByPaymentDateDesc(event, "SUCCESS")
            .orElse(null);
    }

    public Double calculateTotalAmount(Event event) {
        if (event == null || event.getAllocations() == null || event.getAllocations().isEmpty()) {
            return 0.0;
        }
        
        return event.getAllocations().stream()
            .mapToDouble(allocation -> {
                if (allocation.getResource() != null && allocation.getResource().getPrice() != null) {
                    return allocation.getQuantity() * allocation.getResource().getPrice();
                }
                return 0.0;
            })
            .sum();
    }

    private String generateTransactionId() {
        return "TXN" + System.currentTimeMillis() + new Random().nextInt(1000);
    }
}