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
    @Autowired
    private ResourceRepository resourceRepository;
    @Autowired
    private AllocationRepository allocationRepository;
    @Autowired
    private EventRepository eventRepository;

    public Resource addResource(Resource resource) {
        return resourceRepository.save(resource);
    }

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public void allocateResources(Long eventId, Long resourceId, Allocation allocation) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));
        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new EntityNotFoundException("Resource not found"));
        allocation.setEvent(event);
        allocation.setResource(resource);
        // Save allocation
        allocationRepository.save(allocation);
        // Add allocation to the event's allocation list
        event.getAllocations().add(allocation);
        eventRepository.save(event);
        // Update resource availability
        resource.setAvailability(false);
        resourceRepository.save(resource);
     
    }

   public Resource updateResource(Long resourceId, Resource updatedResource) {
    Resource existingResource = resourceRepository.findById(resourceId)
        .orElseThrow(() -> new EntityNotFoundException("Resource not found with id: " + resourceId));
    
    // Update only non-null fields
    if (updatedResource.getName() != null) {
        existingResource.setName(updatedResource.getName());
    }
    if (updatedResource.getType() != null) {
        existingResource.setType(updatedResource.getType());
    }
    // For boolean primitive, just update directly (no null check needed)
    existingResource.setAvailability(updatedResource.isAvailability());
    
    return resourceRepository.save(existingResource);
}

}