package com.edutech.eventmanagementsystem.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.edutech.eventmanagementsystem.entity.Event;

@Repository
public interface EventRepository extends JpaRepository<Event, Long>{
    // extend jpa repository and add custom method if needed
    // @Query("SELECT e FROM Event e WHERE LOWER(e.title) LIKE LOWER(CONCAT('%', :title, '%'))")
    // List<Event> searchByTitle(@Param("title") String title);

    Event searchByTitle(String title);
}