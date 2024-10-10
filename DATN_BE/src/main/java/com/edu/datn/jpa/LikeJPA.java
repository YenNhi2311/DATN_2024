package com.edu.datn.jpa;

import com.edu.datn.entities.LikeEntity;
import com.edu.datn.entities.PostEntity;
import com.edu.datn.entities.UserEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface LikeJPA extends JpaRepository<LikeEntity, Integer> {
  Optional<LikeEntity> findByPostAndUser(PostEntity post, UserEntity user);

  boolean existsByPostAndUser(PostEntity post, UserEntity user);

  @Query("SELECT COUNT(l) FROM LikeEntity l WHERE l.post = :post")
  Integer countLikesByPost(@Param("post") PostEntity post);

  @Query(
    "SELECT COUNT(l) FROM LikeEntity l WHERE l.user.userId = :userId AND FUNCTION('MONTH', l.createAt) = FUNCTION('MONTH', CURRENT_DATE) AND FUNCTION('YEAR', l.createAt) = FUNCTION('YEAR', CURRENT_DATE)"
  )
  Integer countLikesByUserInCurrentMonth(@Param("userId") Integer userId);
}
