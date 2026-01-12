package com.edutech.eventmanagementsystem.entity;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "resources")
public class Resource {

    // i. Primary Key and Auto Increment
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ii. resourceType
    private String resourceType;

    // iii. description
    private String description;

    // iv. event (MTO1)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Event event;

    // --- Getters and Setters ---

    public Long getId() {
        return id;
    }

    public String getResourceType() {
        return resourceType;
    }

    public String getDescription() {
        return description;
    }

    public Event getEvent() {
        return event;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setEvent(Event event) {
        this.event = event;
    }
}

