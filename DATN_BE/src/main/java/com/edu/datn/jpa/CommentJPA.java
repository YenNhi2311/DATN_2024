package com.edu.datn.jpa;

import com.edu.datn.entities.CommentEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentJPA extends JpaRepository<CommentEntity, Integer> {
  List<CommentEntity> findByPostPostIdOrderByCreateAtDesc(Integer postId);
}
