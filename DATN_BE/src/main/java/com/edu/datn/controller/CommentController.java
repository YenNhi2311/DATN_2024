package com.edu.datn.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edu.datn.entities.CommentEntity;
import com.edu.datn.entities.PostEntity;
import com.edu.datn.entities.UserEntity;
import com.edu.datn.service.CommentService;
import com.edu.datn.service.NotificationService;
import com.edu.datn.service.PostService;
import com.edu.datn.service.UserService;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
  @Autowired
  private CommentService commentService;

  @Autowired
  private NotificationService notificationService;

  @Autowired
  private PostService postService;

  @Autowired
  private UserService userService;

  @GetMapping("/post/{postId}")
  public List<CommentEntity> getCommentsByPostId(@PathVariable Integer postId) {
    return commentService.getCommentsByPostId(postId);
  }

  @PostMapping
  public ResponseEntity<?> addComment(
      @RequestBody CommentEntity commentEntity) {
    try {
      // Lưu comment vào database
      CommentEntity savedComment = commentService.addComment(commentEntity);

      // Lấy thông tin chủ bài viết
      PostEntity post = postService
          .getPostById(commentEntity.getPost().getPostId())
          .orElseThrow(() -> new RuntimeException("Post not found"));

      // Lấy thông tin người dùng đã comment
      UserEntity commentingUser = userService.findById(
          commentEntity.getUser().getUserId());

      // Tạo thông báo cho chủ bài viết
      if (!post.getUser().getUserId().equals(commentingUser.getUserId())) {
        String message = commentingUser.getFullname() + " đã bình luận bài viết của bạn.";
        notificationService.createNotification(
            post.getUser().getUserId(),
            post.getPostId(),
            message,
            "comment");
      }

      // Trả về kết quả thành công
      return new ResponseEntity<>(savedComment, HttpStatus.CREATED);
    } catch (Exception e) {
      // Trả về phản hồi lỗi
      return new ResponseEntity<>(
          "Error adding comment: " + e.getMessage(),
          HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // API để xóa bình luận
  @DeleteMapping("/{id}")
  public ResponseEntity<String> deleteComment(
      @PathVariable("id") Integer commentId) {
    try {
      commentService.deleteComment(commentId);
      return ResponseEntity.ok("Comment deleted successfully.");
    } catch (RuntimeException e) {
      return ResponseEntity.status(404).body(e.getMessage());
    }
  }
}