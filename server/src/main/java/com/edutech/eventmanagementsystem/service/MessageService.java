package com.edutech.eventmanagementsystem.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edutech.eventmanagementsystem.entity.Message;
import com.edutech.eventmanagementsystem.repository.MessageRepository;

import java.util.Date;
import java.util.List;

@Service
public class MessageService {
    
    @Autowired
    private MessageRepository messageRepository;
    
    public Message sendMessage(Message message) {
        message.setSentAt(new Date());
        message.setRead(false);
        return messageRepository.save(message);
    }
    
    public List<Message> getMessagesByEventId(Long eventID) {
        return messageRepository.findByEventIDOrderBySentAtAsc(eventID);
    }
    
    public Message markAsRead(Long messageID) {
        Message message = messageRepository.findById(messageID).orElse(null);
        if (message != null) {
            message.setRead(true);
            return messageRepository.save(message);
        }
        return null;
    }
}