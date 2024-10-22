package com.edu.datn.service;

import com.edu.datn.jpa.NotificationJPA;
import com.edu.datn.model.Notification;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {
  @Autowired
  private NotificationJPA notificationJPA;

  @Autowired
  private SimpMessagingTemplate messagingTemplate;

  // public void createNotification(
  //   Integer receiverId,
  //   Integer postId,
  //   String message,
  //   String type
  // ) {
  //   Notification notification = new Notification();
  //   notification.setPostId(postId);
  //   notification.setReceiverId(receiverId);
  //   notification.setMessage(message);
  //   notification.setType(type);
  //   notificationJPA.save(notification);
  // }

  // public List<Notification> getAllNotifications() {
  //   return notificationJPA.findAll();
  // }

  // // Phương thức lấy thông báo theo ID người nhận
  // public List<Notification> getNotificationsByReceiverId(Integer receiverId) {
  //   return notificationJPA.findByReceiverId(receiverId); // Phương thức này cần được định nghĩa trong
  //   // notificationJPA
  // }

  // public void deleteNotificationForLike(Integer postId, Integer receiverId) {
  //   // Tìm và xóa thông báo tương ứng trong database
  //   // Giả sử bạn có một phương thức để tìm và xóa thông báo
  //   notificationJPA.deleteByReceiverIdAndPostId(receiverId, postId);
  // }

  // public void sendNotification(
  //   Integer postId,
  //   Integer receiverId,
  //   String message,
  //   String type
  // ) {
  //   // Tạo một thông báo mới
  //   Notification notification = new Notification();
  //   notification.setPostId(postId);
  //   notification.setReceiverId(receiverId);
  //   notification.setMessage(message);
  //   notification.setType(type);
  //   notification.setCreatedAt(LocalDateTime.now());
  //   notification.setRead(false);

  //   // Lưu thông báo vào MongoDB
  //   notificationJPA.save(notification);

  //   // Gửi thông báo qua WebSocket đến người nhận
  //   messagingTemplate.convertAndSendToUser(
  //     receiverId.toString(),
  //     "/queue/notifications",
  //     message
  //   );
  // }

  // /**
  //  * Lấy danh sách thông báo của một người dùng
  //  *
  //  * @param receiverId ID của người nhận thông báo
  //  * @return Danh sách thông báo
  //  */
  // public List<Notification> getNotificationsForUser(Integer receiverId) {
  //   return notificationJPA.findByReceiverId(receiverId);
  // }

  // /**
  //  * Đánh dấu thông báo là đã đọc
  //  *
  //  * @param notificationId ID của thông báo
  //  */
  // public void markAsRead(String notificationId) {
  //   Notification notification = notificationJPA
  //     .findById(notificationId)
  //     .orElseThrow(() -> new RuntimeException("Notification not found"));
  //   notification.setRead(true);
  //   notificationJPA.save(notification);
  // }

  // Lưu thông báo vào MongoDB
  public Notification saveNotification(Notification notification) {
    return notificationJPA.save(notification);
  }

  // Lấy tất cả thông báo của người dùng theo receiverId
  public List<Notification> getNotificationsByReceiverId(Integer receiverId) {
    return notificationJPA.findByReceiverId(receiverId);
  }

  // Gửi thông báo qua WebSocket
  public void sendNotificationToUser(
    Integer receiverId,
    Notification notification
  ) {
    // Lưu thông báo vào MongoDB
    Notification savedNotification = saveNotification(notification);

    // Gửi thông báo đến client qua WebSocket
    messagingTemplate.convertAndSendToUser(
      receiverId.toString(),
      "/queue/notifications",
      savedNotification
    );
  }
}
