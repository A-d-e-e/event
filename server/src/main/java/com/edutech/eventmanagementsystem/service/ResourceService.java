package com.edutech.eventmanagementsystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edutech.eventmanagementsystem.entity.Allocation;
import com.edutech.eventmanagementsystem.entity.Event;
import com.edutech.eventmanagementsystem.entity.Resource;
import com.edutech.eventmanagementsystem.repository.AllocationRepository;
import com.edutech.eventmanagementsystem.repository.EventRepository;
import com.edutech.eventmanagementsystem.repository.ResourceRepository;

import javax.persistence.EntityNotFoundException;
import java.util.List;

@Service

public class ResourceService {


    
    private final ResourceRepository resourceRepository;
    private final EventRepository eventRepository;
    private final AllocationRepository allocationRepository;

    public ResourceService(ResourceRepository resourceRepository,
                           EventRepository eventRepository,
                           AllocationRepository allocationRepository) {
        this.resourceRepository = resourceRepository;
        this.eventRepository = eventRepository;
        this.allocationRepository = allocationRepository;
    }

    public Resource addResource(Resource resource) {
        return resourceRepository.save(resource);
    }

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public void allocateResources(Long eventId, Long resourceId, Allocation allocation) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found: " + eventId));

        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new IllegalArgumentException("Resource not found: " + resourceId));

        // Basic allocation logic
        allocation.setEvent(event);
        allocation.setResource(resource);

        allocationRepository.save(allocation);
    }


}
