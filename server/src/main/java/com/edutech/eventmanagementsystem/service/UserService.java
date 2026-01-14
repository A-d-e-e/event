package com.edutech.eventmanagementsystem.service;
 
 
import org.apache.logging.log4j.util.Supplier;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.edutech.eventmanagementsystem.entity.User;
import com.edutech.eventmanagementsystem.repository.UserRepository;

import java.util.ArrayList;
 
@Service
public class UserService implements UserDetailsService{
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
   
    public User registerUser(User user){
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }
 
    public User getUserByUsername(String username){
        return userRepository.findByUsername(username);
         
    }
 
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException
    {
        User user=userRepository.findByUsername(username);
        if(user == null)
        {
            throw new UsernameNotFoundException("User not found" +username);
        }
        return new org.springframework.security.core.userdetails.User(
            user.getUsername(),
            user.getPassword(),
            new ArrayList<>());
 
    }
 
 
}
 
 