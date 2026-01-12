package com.edutech.eventmanagementsystem.entity;


import javax.persistence.*;

@Table(name = "users") // do not change table name
public class User {
    // implement entity
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
     private Long id;  //Primary Key and Auto Increment 
    private String username; 
    private String password; 
    private String role; // Role can be 'PLANNER', 'STAFF', 'CLIENT' 
    private String email;


    
    public User(Long id, String username, String password, String role, String email) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.role = role;
        this.email = email;
    }
    public User() {
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    
    

    







}