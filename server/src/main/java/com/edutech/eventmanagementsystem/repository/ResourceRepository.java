package com.edutech.eventmanagementsystem.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.edutech.eventmanagementsystem.entity.Resource;

@Repository
public interface ResourceRepository extends JpaRepository<Resource,Long> {
    // extend jpa repository and add custom method if needed
}