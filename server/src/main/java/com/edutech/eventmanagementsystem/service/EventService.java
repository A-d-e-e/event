package com.edutech.eventmanagementsystem.service;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
 
import com.edutech.eventmanagementsystem.entity.Event;
import com.edutech.eventmanagementsystem.repository.EventRepository;
 
import javax.persistence.EntityNotFoundException;
import java.util.List;
 
@Service
public class EventService {
 
    @Autowired
    private EventRepository eventRepository;
 
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
        Event oldEvent = eventRepository.findById(eventId).orElseThrow(
            () -> new EntityNotFoundException("Event not found with ID: " + eventId)
        );
        updatedEvent.setEventID(oldEvent.getEventID());
        return eventRepository.save(updatedEvent);
    }
 
    /** NEW: Delete an event by ID */
    public void deleteEvent(Long eventId) {
        boolean exists = eventRepository.existsById(eventId);
        if (!exists) {
            throw new EntityNotFoundException("Event not found with ID: " + eventId);
        }
        eventRepository.deleteById(eventId);
    }
}