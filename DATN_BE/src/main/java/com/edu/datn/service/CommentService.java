package com.edu.datn.service;

import com.edu.datn.entities.CommentEntity;
import com.edu.datn.jpa.CommentJPA;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CommentService {
  @Autowired
  private CommentJPA commentJPA;

  public List<CommentEntity> getCommentsByPostId(Integer postId) {
    return commentJPA.findByPostPostIdOrderByCreateAtDesc(postId);
  }

  public CommentEntity addComment(CommentEntity commentEntity) {
    commentEntity.setCreateAt(LocalDateTime.now());
    commentEntity.setUpdateAt(LocalDateTime.now());
    return commentJPA.save(commentEntity);
  }
}
