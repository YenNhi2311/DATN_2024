package com.edu.datn.controller;

import com.edu.datn.model.Notification;
import com.edu.datn.service.NotificationService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class NotificationController {
  @Autowired
  private NotificationService notificationService;

  // API để lấy danh sách thông báo của người dùng
  @GetMapping("/api/notifications/receiver/{receiverId}")
  public List<Notification> getNotifications(@PathVariable Integer receiverId) {
    return notificationService.getNotificationsByReceiverId(receiverId);
  }

  // WebSocket để nhận thông báo từ client và gửi lại cho người dùng
  @MessageMapping("/notifications") // /app/notifications
  public void receiveNotification(Notification notification) {
    // Gửi thông báo qua WebSocket và lưu vào MongoDB
    notificationService.sendNotificationToUser(
      notification.getReceiverId(),
      notification
    );
  }
}
