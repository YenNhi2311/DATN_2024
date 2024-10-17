package com.edu.datn.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edu.datn.model.Notification;
import com.edu.datn.service.NotificationService;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;

    // Endpoint lấy tất cả thông báo
    @GetMapping
    public List<Notification> getNotifications() {
        return notificationService.getAllNotifications();
    }

    // Endpoint lấy thông báo theo ID người nhận
    @GetMapping("/receiver/{id}")
    public List<Notification> getNotificationsByReceiverId(
            @PathVariable("id") Integer receiverId) {
        return notificationService.getNotificationsByReceiverId(receiverId);
    }
}
