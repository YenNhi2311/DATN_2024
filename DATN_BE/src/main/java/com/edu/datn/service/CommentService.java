package com.edu.datn.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edu.datn.entities.CommentEntity;
import com.edu.datn.jpa.CommentJPA;

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

  public void deleteComment(Integer commentId) {
    // Kiểm tra nếu bình luận tồn tại
    if (!commentJPA.existsById(commentId)) {
      throw new RuntimeException("Comment not found with id: " + commentId);
    }
    commentJPA.deleteById(commentId);
  }
}