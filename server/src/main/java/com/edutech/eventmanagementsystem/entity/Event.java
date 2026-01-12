package com.edutech.eventmanagementsystem.entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "events")
public class Event {

    // i. Primary Key and Auto Increment
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ii. name
    private String name;

    // iii. description
    private String description;

    // iv. materials
    private String materials;

    // v. resourceAllocations (1TOM)
    @OneToMany(mappedBy = "event", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Resource> resourceAllocations = new ArrayList<>();

    // --- Getters and Setters ---

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getMaterials() {
        return materials;
    }

    public List<Resource> getResourceAllocations() {
        return resourceAllocations;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setMaterials(String materials) {
        this.materials = materials;
    }

    public void setResourceAllocations(List<Resource> resourceAllocations) {
        this.resourceAllocations = resourceAllocations;
    }
}
