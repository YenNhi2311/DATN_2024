package com.edu.datn.controller;

import com.edu.datn.dto.PostStatsDTO;
import com.edu.datn.entities.PostEntity;
import com.edu.datn.handler.NotificationHandler;
import com.edu.datn.service.LikeService;
import com.edu.datn.service.PostService;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/post")
public class PostController {
  @Autowired
  private PostService postService;

  @Autowired
  private LikeService likeService;

  @Autowired
  private NotificationHandler notificationHandler;

  @GetMapping("/all")
  public List<PostEntity> getAllPosts() {
    return postService.getAllPosts();
  }

  @GetMapping("/{postId}")
  public ResponseEntity<PostEntity> getPostById(@PathVariable Integer postId) {
    Optional<PostEntity> post = postService.getPostById(postId);
    return post
      .map(postEntity -> new ResponseEntity<>(postEntity, HttpStatus.OK))
      .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
  }

  @GetMapping("/user/{userId}")
  public ResponseEntity<List<PostEntity>> getPostsByUserId(
    @PathVariable Integer userId
  ) {
    List<PostEntity> posts = postService.getPostsByUserId(userId);
    return new ResponseEntity<>(posts, HttpStatus.OK);
  }

  @PostMapping("/create")
  public ResponseEntity<?> createPost(
    @RequestBody PostEntity post,
    HttpServletRequest request
  ) {
    try {
      // Lấy JWT token từ header Authorization
      String authHeader = request.getHeader("Authorization");
      if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        return ResponseEntity
          .status(HttpStatus.UNAUTHORIZED)
          .body("Missing or invalid Authorization header");
      }

      String token = authHeader.substring(7); // Bỏ chữ "Bearer " để lấy token

      // Gọi service để xử lý tạo bài đăng
      PostEntity newPost = postService.createPost(post, token);

      return ResponseEntity.status(HttpStatus.CREATED).body(newPost);
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body("An error occurred: " + e.getMessage());
    }
  }

  @PutMapping("/{postId}")
  public ResponseEntity<PostEntity> updatePost(
    @PathVariable Integer postId,
    @RequestBody PostEntity postUpdateRequest
  ) {
    PostEntity updatedPost = postService.updatePost(
      postId,
      postUpdateRequest.getContent()
    );
    if (updatedPost != null) {
      return ResponseEntity.ok(updatedPost);
    } else {
      return ResponseEntity.notFound().build();
    }
  }

  @DeleteMapping("/{postId}")
  public ResponseEntity<?> deletePost(@PathVariable Integer postId) {
    postService.deletePost(postId);
    return ResponseEntity.ok().build();
  }

  @PostMapping("/like")
  public ResponseEntity<?> likePost(
    @RequestParam Integer postId,
    @RequestParam Integer userId
  ) {
    likeService.likePost(postId, userId);
    String notificationMessage =
      "User " + userId + " đã like bài viết " + postId;

    // Gửi thông báo qua WebSocket
    notificationHandler.sendNotification(notificationMessage);
    return ResponseEntity.ok("Liked");
  }

  @PostMapping("/unlike")
  public ResponseEntity<?> unlikePost(
    @RequestParam Integer postId,
    @RequestParam Integer userId
  ) {
    likeService.unlikePost(postId, userId);
    return ResponseEntity.ok("Unliked");
  }

  @GetMapping("/isLiked")
  public ResponseEntity<Boolean> isPostLiked(
    @RequestParam Integer postId,
    @RequestParam Integer userId
  ) {
    boolean isLiked = likeService.isPostLikedByUser(postId, userId);
    return ResponseEntity.ok(isLiked);
  }

  @GetMapping("/{postId}/likes/count")
  public ResponseEntity<Integer> getLikesCount(@PathVariable Integer postId) {
    PostEntity post = postService.getPostById(postId).orElseThrow();
    Integer likesCount = likeService.getLikesCountForPost(post);
    return ResponseEntity.ok(likesCount);
  }

  @GetMapping("/{userId}/stats")
  public ResponseEntity<PostStatsDTO> getUserStats(
    @PathVariable Integer userId
  ) {
    PostStatsDTO stats = postService.getUserStatsForCurrentMonth(userId);
    return ResponseEntity.ok(stats);
  }
}
