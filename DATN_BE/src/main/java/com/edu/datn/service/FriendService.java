package com.edu.datn.service;


import com.edu.datn.entities.FriendEntity;
import com.edu.datn.entities.UserEntity;
import com.edu.datn.jpa.FriendJPA;
import com.edu.datn.jpa.UserJPA;
import java.time.*;
import java.util.*;
import java.util.stream.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FriendService {
  @Autowired
  private FriendJPA friendJPA;

  @Autowired
  private UserJPA userJPA;

  public List<FriendEntity> getAllFriends() {
    // Lấy tất cả FriendEntity từ database
    return friendJPA.findAll();
  }

  // Tạo mới mối quan hệ bạn bè
  public FriendEntity addFriend(Integer userId, Integer friendId) {
    UserEntity user = userJPA
      .findById(userId)
      .orElseThrow(() -> new RuntimeException("User not found"));
    UserEntity friend = userJPA
      .findById(friendId)
      .orElseThrow(() -> new RuntimeException("Friend not found"));

    FriendEntity friendEntity = new FriendEntity();
    friendEntity.setUser(user);
    friendEntity.setFriend(friend);
    friendEntity.setStatus(false); // Trạng thái kết bạn
    friendEntity.setCreateAt(LocalDateTime.now());

    return friendJPA.save(friendEntity);
  }

  public void deleteFriendByUserIdAndFriendId(
    Integer userId,
    Integer friendId
  ) {
    // Tìm mối quan hệ bạn bè dựa trên userId và friendId
    FriendEntity friendEntity = friendJPA.findByUserIdAndFriendId(
      userId,
      friendId
    );

    // Kiểm tra nếu mối quan hệ tồn tại
    if (friendEntity != null) {
      // Xóa mối quan hệ bạn bè
      friendJPA.delete(friendEntity);
    } else {
      // Nếu không tìm thấy, ném ngoại lệ
      throw new IllegalArgumentException(
        "Friendship between userId " +
        userId +
        " and friendId " +
        friendId +
        " not found."
      );
    }
  }
}
