package com.edutech.eventmanagementsystem.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "feedbacks")
public class Feedback {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long feedbackID;
    
    @ManyToOne
    @JoinColumn(name = "event_id")
    @JsonIgnore
    private Event event;
    
    @Column(nullable = false)
    private String customerName;
    
    @Column(nullable = false)
    private String customerEmail;
    
    @Column(nullable = false)
    private Integer rating; // 1 to 5
    
    @Column(length = 1000)
    private String feedbackText;
    
    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date feedbackDate;
    
    @Column(nullable = false)
    private Boolean isVerified; // Only verified feedbacks are shown
    
    // Constructors
    public Feedback() {
        this.feedbackDate = new Date();
        this.isVerified = false;
    }
    
    public Feedback(Event event, String customerName, String customerEmail, 
                   Integer rating, String feedbackText) {
        this.event = event;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.rating = rating;
        this.feedbackText = feedbackText;
        this.feedbackDate = new Date();
        this.isVerified = false;
    }
    
    // Getters and Setters
    public Long getFeedbackID() {
        return feedbackID;
    }
    
    public void setFeedbackID(Long feedbackID) {
        this.feedbackID = feedbackID;
    }
    
    public Event getEvent() {
        return event;
    }
    
    public void setEvent(Event event) {
        this.event = event;
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
    
    public Integer getRating() {
        return rating;
    }
    
    public void setRating(Integer rating) {
        this.rating = rating;
    }
    
    public String getFeedbackText() {
        return feedbackText;
    }
    
    public void setFeedbackText(String feedbackText) {
        this.feedbackText = feedbackText;
    }
    
    public Date getFeedbackDate() {
        return feedbackDate;
    }
    
    public void setFeedbackDate(Date feedbackDate) {
        this.feedbackDate = feedbackDate;
    }
    
    public Boolean getIsVerified() {
        return isVerified;
    }
    
    public void setIsVerified(Boolean isVerified) {
        this.isVerified = isVerified;
    }
}