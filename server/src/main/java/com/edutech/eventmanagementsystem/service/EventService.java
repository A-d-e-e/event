package com.edutech.eventmanagementsystem.service;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
 
import com.edutech.eventmanagementsystem.entity.Event;
import com.edutech.eventmanagementsystem.repository.EventRepository;
 
import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.stream.Collectors;
 
@Service
public class EventService {
 
    @Autowired
    private EventRepository eventRepository;
 
    /**
     * Create a new event
     * @param event Event object to create
     * @return Created event with generated ID
     */
    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }
 
    /**
     * Get all events from the database
     * @return List of all events with their allocations
     */
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }
 
    /**
     * Get event details by event ID
     * @param eventId The ID of the event to retrieve
     * @return Event object if found, null otherwise
     */
    public Event getEventDetails(Long eventId) {
        return eventRepository.findById(eventId).orElse(null);
    }
 
    /**
     * Update event setup/details
     * @param eventId ID of the event to update
     * @param updatedEvent Event object with updated information
     * @return Updated event object
     * @throws EntityNotFoundException if event with given ID is not found
     */
    public Event updateEventSetup(Long eventId, Event updatedEvent) {
        Event oldEvent = eventRepository.findById(eventId).orElseThrow(
            () -> new EntityNotFoundException("Event not found with ID: " + eventId)
        );
        // Preserve the original event ID
        updatedEvent.setEventID(oldEvent.getEventID());
        return eventRepository.save(updatedEvent);
    }
 
    /**
     * Delete an event by ID
     * @param eventId ID of the event to delete
     * @throws EntityNotFoundException if event with given ID is not found
     */
    public void deleteEvent(Long eventId) {
        boolean exists = eventRepository.existsById(eventId);
        if (!exists) {
            throw new EntityNotFoundException("Event not found with ID: " + eventId);
        }
        eventRepository.deleteById(eventId);
    }

    /**
     * Search events by title (case-insensitive partial match)
     * This method filters all events to find those whose title contains the search term
     * @param title The title or partial title to search for
     * @return List of events matching the search criteria
     */
    public List<Event> searchEventsByTitle(String title) {
        if (title == null || title.trim().isEmpty()) {
            return eventRepository.findAll();
        }
        
        List<Event> allEvents = eventRepository.findAll();
        return allEvents.stream()
            .filter(event -> event.getTitle() != null && 
                           event.getTitle().toLowerCase().contains(title.toLowerCase().trim()))
            .collect(Collectors.toList());
    }

    /**
     * Get event by exact title match (case-insensitive)
     * @param title The exact title to search for
     * @return Event object if found, null otherwise
     */
    public Event getEventByTitle(String title) {
        if (title == null || title.trim().isEmpty()) {
            return null;
        }
        
        List<Event> events = searchEventsByTitle(title.trim());
        if (events != null && !events.isEmpty()) {
            // Try to find exact match first
            for (Event event : events) {
                if (event.getTitle().equalsIgnoreCase(title.trim())) {
                    return event;
                }
            }
            // If no exact match, return first partial match
            return events.get(0);
        }
        return null;
    }

    /**
     * Get events by status
     * @param status Status to filter by (e.g., "upcoming", "ongoing", "completed", "cancelled")
     * @return List of events with the specified status
     */
    public List<Event> getEventsByStatus(String status) {
        if (status == null || status.trim().isEmpty()) {
            return eventRepository.findAll();
        }
        
        List<Event> allEvents = eventRepository.findAll();
        return allEvents.stream()
            .filter(event -> event.getStatus() != null && 
                           event.getStatus().equalsIgnoreCase(status.trim()))
            .collect(Collectors.toList());
    }

    /**
     * Get events by location (case-insensitive partial match)
     * @param location Location to search for
     * @return List of events at or near the specified location
     */
    public List<Event> getEventsByLocation(String location) {
        if (location == null || location.trim().isEmpty()) {
            return eventRepository.findAll();
        }
        
        List<Event> allEvents = eventRepository.findAll();
        return allEvents.stream()
            .filter(event -> event.getLocation() != null && 
                           event.getLocation().toLowerCase().contains(location.toLowerCase().trim()))
            .collect(Collectors.toList());
    }

    /**
     * Check if an event exists by ID
     * @param eventId ID to check
     * @return true if event exists, false otherwise
     */
    public boolean existsById(Long eventId) {
        return eventRepository.existsById(eventId);
    }

    /**
     * Count total number of events
     * @return Total count of events in database
     */
    public long countAllEvents() {
        return eventRepository.count();
    }

    /**
     * Count events by status
     * @param status Status to count
     * @return Number of events with the specified status
     */
    public long countEventsByStatus(String status) {
        return getEventsByStatus(status).size();
    }
}