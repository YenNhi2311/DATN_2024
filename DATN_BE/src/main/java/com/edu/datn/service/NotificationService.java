package com.edu.datn.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edu.datn.jpa.NotificationJPA;
import com.edu.datn.model.Notification;

@Service
public class NotificationService {
    @Autowired
    private NotificationJPA notificationJPA;

    public void createNotification(
            Integer receiverId,
            Integer postId,
            String message,
            String type) {
        Notification notification = new Notification();
        notification.setPostId(postId);
        notification.setReceiverId(receiverId);
        notification.setMessage(message);
        notification.setType(type);
        notificationJPA.save(notification);
    }

    public List<Notification> getAllNotifications() {
        return notificationJPA.findAll();
    }

    // Phương thức lấy thông báo theo ID người nhận
    public List<Notification> getNotificationsByReceiverId(Integer receiverId) {
        return notificationJPA.findByReceiverId(receiverId); // Phương thức này cần được định nghĩa trong
                                                             // NotificationRepository
    }

    public void deleteNotificationForLike(Integer postId, Integer receiverId) {
        // Tìm và xóa thông báo tương ứng trong database
        // Giả sử bạn có một phương thức để tìm và xóa thông báo
        notificationJPA.deleteByReceiverIdAndPostId(receiverId, postId);
    }
}
