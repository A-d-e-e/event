package com.edutech.eventmanagementsystem.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.edutech.eventmanagementsystem.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    // extend jpa repository and add custom method if needed
    User findByUsername(String userName);
}

