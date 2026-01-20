package com.edutech.eventmanagementsystem.entity;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentID;
    
    @ManyToOne
    @JoinColumn(name = "event_eventID", nullable = false)
    private Event event;
    
    @Column(nullable = false)
    private Double amount;
    
    @Column(nullable = false)
    private String paymentMethod; // UPI, Card, NetBanking
    
    @Column(nullable = false)
    private String paymentStatus; // PENDING, SUCCESS, FAILED
    
    @Column
    private String transactionId;
    
    @Column
    private String upiId;
    
    @Column
    private LocalDateTime paymentDate;
    
    @Column
    private String customerName;
    
    @Column
    private String customerEmail;
    
    @Column
    private String customerPhone;
    
    // Constructors
    public Payment() {
        this.paymentDate = LocalDateTime.now();
        this.paymentStatus = "PENDING";
    }
    
    public Payment(Event event, Double amount, String paymentMethod) {
        this.event = event;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.paymentDate = LocalDateTime.now();
        this.paymentStatus = "PENDING";
    }
    
    // Getters and Setters
    public Long getPaymentID() {
        return paymentID;
    }
    
    public void setPaymentID(Long paymentID) {
        this.paymentID = paymentID;
    }
    
    public Event getEvent() {
        return event;
    }
    
    public void setEvent(Event event) {
        this.event = event;
    }
    
    public Double getAmount() {
        return amount;
    }
    
    public void setAmount(Double amount) {
        this.amount = amount;
    }
    
    public String getPaymentMethod() {
        return paymentMethod;
    }
    
    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
    
    public String getPaymentStatus() {
        return paymentStatus;
    }
    
    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }
    
    public String getTransactionId() {
        return transactionId;
    }
    
    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }
    
    public String getUpiId() {
        return upiId;
    }
    
    public void setUpiId(String upiId) {
        this.upiId = upiId;
    }
    
    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }
    
    public void setPaymentDate(LocalDateTime paymentDate) {
        this.paymentDate = paymentDate;
    }
    
    public String getCustomerName() {
        return customerName;
    }
    
    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }
    
    public String getCustomerEmail() {
        return customerEmail;
    }
    
    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }
    
    public String getCustomerPhone() {
        return customerPhone;
    }
    
    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }
}