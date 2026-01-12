package com.edutech.eventmanagementsystem.entity;
 
 
import com.fasterxml.jackson.annotation.JsonIgnore;
 
import javax.persistence.*;
 
@Entity
@Table(name = "allocations") // do not change table name
public class Allocation {
    // implement entity
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long allocationID;
 
    @ManyToOne
    @JsonIgnore
    private Event event;
   
    @ManyToOne
    private Resource resource;
    private int quantity;
 
 
    public Allocation() {
    }
 
    public Allocation(Long allocationID, Event event, Resource resource, int quantity) {
        this.allocationID = allocationID;
        this.event = event;
        this.resource = resource;
        this.quantity = quantity;
    }
 
 
 
    public Long getAllocationID() {
        return allocationID;
    }
 
 
 
    public void setAllocationID(Long allocationID) {
        this.allocationID = allocationID;
    }
 
 
 
    public Event getEvent() {
        return event;
    }
 
 
 
    public void setEvent(Event event) {
        this.event = event;
    }
 
 
 
    public Resource getResource() {
        return resource;
    }
 
 
 
    public void setResource(Resource resource) {
        this.resource = resource;
    }
 
 
 
    public int getQuantity() {
        return quantity;
    }
 
 
 
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
 
   
 
   
 
 
}
 
 