// package com.edu.datn.controller;

// import javax.management.Notification;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.messaging.handler.annotation.MessageMapping;
// import org.springframework.messaging.handler.annotation.SendTo;
// import org.springframework.messaging.simp.SimpMessagingTemplate;
// import org.springframework.web.bind.annotation.RestController;

// @RestController
// public class NotificationController {
//   @Autowired
//   private SimpMessagingTemplate messagingTemplate;

//   // Method để gửi thông báo khi like hoặc comment
//   @MessageMapping("/notify")
//   @SendTo("/topic/notifications")
//   public Notification sendNotification(Notification notification) {
//     return notification;
//   }

//   // Gửi thông báo từ API HTTP
//   public void sendNotificationToClients(String message) {
//     messagingTemplate.convertAndSend("/topic/notifications", message);
//   }
// }
