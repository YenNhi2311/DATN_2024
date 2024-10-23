package com.edu.datn.jpa;

import com.edu.datn.entities.FriendEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface FriendJPA extends JpaRepository<FriendEntity, Integer> {
  @Query(
    "SELECT f FROM FriendEntity f WHERE f.user.userId = :userId AND f.friend.userId = :friendId"
  )
  FriendEntity findByUserIdAndFriendId(
    @Param("userId") Integer userId,
    @Param("friendId") Integer friendId
  );
}
