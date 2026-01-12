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

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class EventPlannerController {

private final EventService eventService;
    private final ResourceService resourceService;

    public EventPlannerController(EventService eventService, ResourceService resourceService) {
        this.eventService = eventService;
        this.resourceService = resourceService;
    }

    @PostMapping("/api/planner/event")
    public ResponseEntity<Map<String, String>> createEvent(@RequestBody Event event) {
        Event created = eventService.createEvent(event);
        Map<String, String> body = new HashMap<>();
        if (created != null) {
            body.put("message", "Event created successfully");
            return new ResponseEntity<>(body, HttpStatus.CREATED);
        } else {
            body.put("message", "Failed to create event");
            return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping({"/api/planner/events"})
    public ResponseEntity<List<Event>> getEvents() {
        List<Event> events = eventService.getAllEvents();
        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @PostMapping("/api/planner/resource")
    public ResponseEntity<Map<String, String>> addResource(@RequestBody Resource resource) {
        Resource saved = resourceService.addResource(resource);
        Map<String, String> body = new HashMap<>();
        if (saved != null) {
            body.put("message", "Resource added successfully");
            return new ResponseEntity<>(body, HttpStatus.CREATED);
        } else {
            body.put("message", "Failed to add resource");
            return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping({"/api/planner/resources", "/api/planner/resource"})
    public ResponseEntity<List<Resource>> getResources() {
        List<Resource> resources = resourceService.getAllResources();
        return new ResponseEntity<>(resources, HttpStatus.OK);
    }

    @PostMapping("/api/planner/allocate-resources")
    public ResponseEntity<Map<String, String>> allocateResources(
            @RequestParam Long eventId,
            @RequestParam Long resourceId,
            @RequestBody Allocation allocation) {

        Map<String, String> body = new HashMap<>();
        try {
            resourceService.allocateResources(eventId, resourceId, allocation);
            body.put("message", "Resource allocated successfully for Event ID: " + eventId);
            return new ResponseEntity<>(body, HttpStatus.CREATED);
        } catch (Exception e) {
            body.put("message", "Failed to allocate resource");
            return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}
