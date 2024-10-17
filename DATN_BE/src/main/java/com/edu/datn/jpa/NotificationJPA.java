package com.edu.datn.jpa;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.edu.datn.model.Notification;

@Repository
public interface NotificationJPA extends MongoRepository<Notification, String> {
    List<Notification> findByReceiverId(Integer receiverId);

    void deleteByReceiverIdAndPostId(Integer receiverId, Integer postId);
}
