package com.edu.datn.controller;

import com.edu.datn.entities.CommentEntity;
import com.edu.datn.service.CommentService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
  @Autowired
  private CommentService commentService;

  @GetMapping("/post/{postId}")
  public List<CommentEntity> getCommentsByPostId(@PathVariable Integer postId) {
    return commentService.getCommentsByPostId(postId);
  }

  @PostMapping
  public ResponseEntity<?> addComment(
    @RequestBody CommentEntity commentEntity
  ) {
    try {
      CommentEntity savedComment = commentService.addComment(commentEntity);
      return new ResponseEntity<>(savedComment, HttpStatus.CREATED);
    } catch (Exception e) {
      // Trả về phản hồi lỗi
      return new ResponseEntity<>(
        "Error adding comment: " + e.getMessage(),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
