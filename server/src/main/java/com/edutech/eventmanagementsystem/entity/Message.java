package com.edutech.eventmanagementsystem.entity;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "messages")
public class Message {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long messageID;
    
    private Long eventID;
    
    private String senderRole; // "PLANNER" or "STAFF"
    
    @Column(length = 1000)
    private String messageContent;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date sentAt;
    
    private boolean isRead;
    
    public Message() {
        this.sentAt = new Date();
        this.isRead = false;
    }
    
    // Getters and Setters
    public Long getMessageID() {
        return messageID;
    }
    
    public void setMessageID(Long messageID) {
        this.messageID = messageID;
    }
    
    public Long getEventID() {
        return eventID;
    }
    
    public void setEventID(Long eventID) {
        this.eventID = eventID;
    }
    
    public String getSenderRole() {
        return senderRole;
    }
    
    public void setSenderRole(String senderRole) {
        this.senderRole = senderRole;
    }
    
    public String getMessageContent() {
        return messageContent;
    }
    
    public void setMessageContent(String messageContent) {
        this.messageContent = messageContent;
    }
    
    public Date getSentAt() {
        return sentAt;
    }
    
    public void setSentAt(Date sentAt) {
        this.sentAt = sentAt;
    }
    
    public boolean isRead() {
        return isRead;
    }
    
    public void setRead(boolean isRead) {
        this.isRead = isRead;
    }
}