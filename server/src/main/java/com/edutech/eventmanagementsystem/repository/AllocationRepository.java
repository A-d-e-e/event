package com.edutech.eventmanagementsystem.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.edutech.eventmanagementsystem.entity.Allocation;

@Repository
public interface AllocationRepository extends JpaRepository<Allocation, Long> {
    // extend jpa repository and add custom methods if needed
}