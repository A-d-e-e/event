package com.edutech.eventmanagementsystem.controller;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
 
import com.edutech.eventmanagementsystem.entity.Allocation;
import com.edutech.eventmanagementsystem.entity.Event;
import com.edutech.eventmanagementsystem.entity.Resource;
import com.edutech.eventmanagementsystem.service.EventService;
import com.edutech.eventmanagementsystem.service.ResourceService;
 
import javax.persistence.EntityNotFoundException;
import java.util.List;
 
@RestController
public class EventPlannerController {
 
    @Autowired
    private ResourceService resourceService;
    @Autowired
    private EventService eventService;
 
    @PostMapping("/api/planner/event")
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
        return ResponseEntity.status(HttpStatus.CREATED).body(eventService.createEvent(event));
    }
 
    @GetMapping("/api/planner/events")
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }
 
    /** NEW: Delete event by ID */
    @DeleteMapping("/api/planner/event/{eventId}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long eventId) {
        try {
            eventService.deleteEvent(eventId);
            return ResponseEntity.noContent().build(); // 204
        } catch (EntityNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // 404
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // 500
        }
    }
 
    @PostMapping("/api/planner/resource")
    public ResponseEntity<Resource> addResource(@RequestBody Resource resource) {
        return ResponseEntity.status(HttpStatus.CREATED).body(resourceService.addResource(resource));
    }
 
    @GetMapping("/api/planner/resources")
    public ResponseEntity<List<Resource>> getAllResources() {
        return ResponseEntity.ok(resourceService.getAllResources());
    }
 
    @PostMapping("/api/planner/allocate-resources")
    public ResponseEntity<String> allocateResources(@RequestParam Long eventId,
                                                    @RequestParam Long resourceId,
                                                    @RequestBody Allocation allocation) {
        try {
            resourceService.allocateResources(eventId, resourceId, allocation);
            return new ResponseEntity<>(
                "{\"message\": \"Resource allocated successfully for Event ID: " + eventId + "\"}",
                HttpStatus.CREATED
            );
        } catch (Exception e) {
            return new ResponseEntity<>("{\"message\": \"Failed to allocate resource\"}",
                HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}