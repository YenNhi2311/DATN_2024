package com.edu.datn.controller;

import com.edu.datn.dto.FriendDTO;
import com.edu.datn.entities.FriendEntity;
import com.edu.datn.entities.PostEntity;
import com.edu.datn.entities.UserEntity;
import com.edu.datn.model.*;
import com.edu.datn.model.Notification;
import com.edu.datn.service.FriendService;
import com.edu.datn.service.NotificationService;
import com.edu.datn.service.PostService;
import com.edu.datn.service.UserService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/friends")
public class FriendController {
  @Autowired
  private FriendService friendService;

  @Autowired
  private UserService userService;

  @Autowired
  private NotificationService notificationService;

  @GetMapping
  public ResponseEntity<List<FriendEntity>> getAllFriends() {
    List<FriendEntity> friends = friendService.getAllFriends();
    return ResponseEntity.ok(friends);
  }

  @PostMapping("/add")
  public ResponseEntity<FriendEntity> addFriend(
    @RequestParam Integer userId,
    @RequestParam Integer friendId
  ) {
    FriendEntity friend = friendService.addFriend(userId, friendId);

    UserEntity name = userService.findById(friendId);

    Notification notification = new Notification();
    notification.setReceiverId(friendId); // Gửi cho chủ bài viết
    notification.setMessage(name.getFullname() + " đã gửi lời mời kết bạn.");
    notification.setType("add"); // Loại thông báo là bình luận
    notificationService.sendNotificationToUser(friendId, notification);
    return ResponseEntity.ok(friend);
  }

  @DeleteMapping("/delete")
  public ResponseEntity<?> deleteFriend(
    @RequestParam Integer userId,
    @RequestParam Integer friendId
  ) {
    friendService.deleteFriendByUserIdAndFriendId(userId, friendId);
    return ResponseEntity.ok("Friendship deleted successfully.");
  }
}
