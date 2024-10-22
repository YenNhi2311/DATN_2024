package com.edu.datn.jpa;

import com.edu.datn.model.Notification;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationJPA extends MongoRepository<Notification, String> {
  List<Notification> findByReceiverId(Integer receiverId);

  void deleteByReceiverIdAndPostId(Integer receiverId, Integer postId);
}
