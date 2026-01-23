package com.edutech.eventmanagementsystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.edutech.eventmanagementsystem.entity.Payment;
import com.edutech.eventmanagementsystem.entity.Event;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    // Find all payments for a specific event
    List<Payment> findByEvent(Event event);
    
    // Find all payments for an event with specific status
    List<Payment> findByEventAndPaymentStatus(Event event, String paymentStatus);
    
    // Find the latest successful payment for an event
    Optional<Payment> findFirstByEventAndPaymentStatusOrderByPaymentDateDesc(Event event, String paymentStatus);
    
    // Check if an event has any payment with specific status
    boolean existsByEventAndPaymentStatus(Event event, String paymentStatus);
}