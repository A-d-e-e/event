package com.edutech.eventmanagementsystem.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edutech.eventmanagementsystem.entity.Event;
import com.edutech.eventmanagementsystem.repository.EventRepository;

import javax.persistence.EntityNotFoundException;
import java.util.List;

@Service
public class EventService {
    
private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventDetails(Long eventId) {
        return eventRepository.findById(eventId).orElse(null);
    }

    public Event updateEventSetup(Long eventId, Event updatedEvent) {
        return eventRepository.findById(eventId).map(existing -> {
            existing.setTitle(updatedEvent.getTitle());
            existing.setDescription(updatedEvent.getDescription());
            existing.setDateTime(updatedEvent.getDateTime());
            existing.setLocation(updatedEvent.getLocation());
            existing.setStatus(updatedEvent.getStatus());
            return eventRepository.save(existing);
        }).orElse(null);
    }


}
