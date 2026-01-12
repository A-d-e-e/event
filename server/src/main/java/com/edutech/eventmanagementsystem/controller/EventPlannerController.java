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

import java.util.List;

@RestController

public class EventPlannerController {

    @Autowired
    private ResourceService resourceService;
    @Autowired
    private EventService eventService;

    @PostMapping("/api/planner/event")
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
        // create event and return created event with status code 201 (CREATED)
        return ResponseEntity.status(201).body(eventService.createEvent(event));
        // try {
        //     eventService.createEvent(event);
        //     return new ResponseEntity<>("{\"message\": \"Event created successfully\"}", HttpStatus.CREATED);
        // } catch (Exception e) {
        //     return new ResponseEntity<>("{\"message\": \"Failed to create event\"}", HttpStatus.INTERNAL_SERVER_ERROR);
        // }

    }

    @GetMapping("/api/planner/events")
    public ResponseEntity<List<Event>> getAllEvents() {
        // get all events and return the list with status code 200 (OK)
        return ResponseEntity.status(200).body(eventService.getAllEvents());
    }

    @PostMapping("/api/planner/resource")
    public ResponseEntity<Resource> addResource(@RequestBody Resource resource) {
        // add resource and return added resource with status code 201 (CREATED)
        // return
       return ResponseEntity.status(201).body(resourceService.addResource(resource));
        // try {
        //     resourceService.addResource(resource);
        //     return new ResponseEntity<>("{\"message\": \"Resource added successfully\"}", HttpStatus.CREATED);
        // } catch (Exception e) {
        //     return new ResponseEntity<>("{\"message\": \"Failed to add resource\"}", HttpStatus.INTERNAL_SERVER_ERROR);
        // }
    }

    @GetMapping("/api/planner/resources")
    public ResponseEntity<List<Resource>> getAllResources() {
        // get all resources and return the list with status code 200 (OK)
        return ResponseEntity.status(200).body(resourceService.getAllResources());
    }

    @PostMapping("/api/planner/allocate-resources")
    public ResponseEntity<String> allocateResources(@RequestParam Long eventId, @RequestParam Long resourceId,
            @RequestBody Allocation allocation) {
        try {
            resourceService.allocateResources(eventId, resourceId, allocation);
            return new ResponseEntity<>(
                    "{\"message\": \"Resource allocated successfully for Event ID: " + eventId + "\"}",
                    HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("{\"message\": \"Failed to allocate resource\"}",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}