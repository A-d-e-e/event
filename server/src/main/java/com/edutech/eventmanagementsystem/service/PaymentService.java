package com.edutech.eventmanagementsystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    /**
     * Initiate a payment for an event
     * @param eventId Event ID
     * @param payment Payment details
     * @return Created payment object
     */
    public Payment initiatePayment(Long eventId, Payment payment) {
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new EntityNotFoundException("Event not found with ID: " + eventId));
        
        payment.setEvent(event);
        payment.setPaymentStatus("PENDING");
        payment.setPaymentDate(LocalDateTime.now());
        
        return paymentRepository.save(payment);
    }

    /**
     * Process UPI payment (dummy implementation)
     * @param paymentId Payment ID
     * @param upiId UPI ID used for payment
     * @return Updated payment object
     */
    public Payment processUpiPayment(Long paymentId, String upiId) {
        Payment payment = paymentRepository.findById(paymentId)
            .orElseThrow(() -> new EntityNotFoundException("Payment not found with ID: " + paymentId));
        
        // Simulate payment processing
        payment.setUpiId(upiId);
        payment.setPaymentStatus("SUCCESS");
        payment.setTransactionId(generateTransactionId());
        payment.setPaymentDate(LocalDateTime.now());
        
        return paymentRepository.save(payment);
    }

    /**
     * Get payment by ID
     * @param paymentId Payment ID
     * @return Payment object
     */
    public Payment getPaymentById(Long paymentId) {
        return paymentRepository.findById(paymentId)
            .orElseThrow(() -> new EntityNotFoundException("Payment not found with ID: " + paymentId));
    }

    /**
     * Get all payments
     * @return List of all payments
     */
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    /**
     * Get payments by event ID
     * @param eventId Event ID
     * @return List of payments for the event
     */
    public List<Payment> getPaymentsByEventId(Long eventId) {
        return paymentRepository.findAll().stream()
            .filter(payment -> payment.getEvent() != null && 
                             payment.getEvent().getEventID().equals(eventId))
            .collect(java.util.stream.Collectors.toList());
    }

    /**
     * Generate a random transaction ID
     * @return Transaction ID string
     */
    private String generateTransactionId() {
        String prefix = "TXN";
        Random random = new Random();
        long number = 100000000000L + (long)(random.nextDouble() * 900000000000L);
        return prefix + number;
    }

    /**
     * Calculate total amount for an event based on allocations
     * @param event Event object with allocations
     * @return Total amount
     */
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
}