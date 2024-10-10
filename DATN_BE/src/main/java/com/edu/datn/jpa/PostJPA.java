package com.edu.datn.jpa;

import com.edu.datn.entities.PostEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PostJPA extends JpaRepository<PostEntity, Integer> {
  List<PostEntity> findByUser_UserId(Integer id);

  @Query(
    "SELECT COUNT(p) FROM PostEntity p WHERE p.user.userId = :userId AND FUNCTION('MONTH', p.createAt) = FUNCTION('MONTH', CURRENT_DATE) AND FUNCTION('YEAR', p.createAt) = FUNCTION('YEAR', CURRENT_DATE)"
  )
  Integer countPostsByUserInCurrentMonth(@Param("userId") Integer userId);
}
