package com.edu.datn.controller;


import com.edu.datn.dto.PostStatsDTO;
import com.edu.datn.entities.LikeEntity;
import com.edu.datn.entities.PostEntity;
import com.edu.datn.entities.UserEntity;
import com.edu.datn.model.Notification;
import com.edu.datn.service.LikeService;
import com.edu.datn.service.NotificationService;
import com.edu.datn.service.PostService;
import com.edu.datn.service.UserService;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/api/post")
public class PostController {
  @Autowired
  private PostService postService;

  @Autowired
  private LikeService likeService;

  @Autowired
  private UserService userService;

  @Autowired
  private NotificationService notificationService;

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
      @PathVariable Integer userId) {
    List<PostEntity> posts = postService.getPostsByUserId(userId);
    return new ResponseEntity<>(posts, HttpStatus.OK);
  }

  @PostMapping("/create")
  public ResponseEntity<?> createPost(

    @RequestParam("content") String content, // Nội dung bài đăng
    @RequestParam(
      value = "images",
      required = false
    ) List<MultipartFile> images, // Các file ảnh (có thể null)
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

      // Tạo đối tượng PostEntity
      PostEntity post = new PostEntity();
      post.setContent(content); // Thiết lập nội dung bài viết

      // Gọi service để xử lý tạo bài đăng và lưu ảnh
      PostEntity newPost = postService.createPost(post, images, token);

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
      @RequestBody PostEntity postUpdateRequest) {
    PostEntity updatedPost = postService.updatePost(
        postId,
        postUpdateRequest.getContent());
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

  // @PostMapping("/like")
  // public ResponseEntity<?> likePost(
  //   @RequestParam Integer postId,
  //   @RequestParam Integer userId
  // ) {
  //   // Gọi service để xử lý việc like bài viết
  //   likeService.likePost(postId, userId);

  //   // Lấy thông tin người dùng thực hiện hành động like
  //   UserEntity user = userService.findById(userId);

  //   // Lấy thông tin bài viết mà người dùng đã like
  //   PostEntity post = postService
  //     .getPostById(postId)
  //     .orElseThrow(() -> new RuntimeException("Post not found"));

  //   return ResponseEntity.ok("Liked and notification sent.");
  // }

  @PostMapping("/like")
  public ResponseEntity<?> likePost(

    @RequestParam Integer postId,
    @RequestParam Integer userId
  ) {

    // Gọi service để xử lý việc like bài viết
    likeService.likePost(postId, userId);

    // Lấy thông tin người dùng thực hiện hành động like
    UserEntity user = userService.findById(userId);

    // Lấy thông tin bài viết mà người dùng đã like
    PostEntity post = postService

      .getPostById(postId)
      .orElseThrow(() -> new RuntimeException("Post not found"));

    // Nếu người thực hiện like không phải là chủ bài viết
    if (!post.getUser().getUserId().equals(userId)) {
      Notification notification = new Notification();
      notification.setPostId(postId);
      notification.setReceiverId(post.getUser().getUserId()); // Gửi cho chủ bài viết
      notification.setMessage(
        "Người dùng " + user.getFullname() + " đã thích bài viết của bạn."
      );
      notification.setType("like"); // Loại thông báo là thích
      notificationService.sendNotificationToUser(
        post.getUser().getUserId(),
        notification
      );

    }

    return ResponseEntity.ok("Liked and notification sent.");
  }

  // @PostMapping("/unlike")
  // public ResponseEntity<?> unlikePost(
  //   @RequestParam Integer postId,
  //   @RequestParam Integer userId
  // ) {
  //   likeService.unlikePost(postId, userId);
  //   UserEntity user = userService.findById(userId);

  //   // Lấy thông tin bài viết mà người dùng đã like
  //   PostEntity post = postService
  //     .getPostById(postId)
  //     .orElseThrow(() -> new RuntimeException("Post not found"));

  //   return ResponseEntity.ok("Unliked");
  // }

  @PostMapping("/unlike")
  public ResponseEntity<?> unlikePost(

    @RequestParam Integer postId,
    @RequestParam Integer userId
  ) {
    // Gọi service để xử lý việc unlike bài viết
    likeService.unlikePost(postId, userId);

    // Lấy thông tin người dùng thực hiện hành động unlike
    UserEntity user = userService.findById(userId);

    // Lấy thông tin bài viết mà người dùng đã unlike
    PostEntity post = postService
      .getPostById(postId)
      .orElseThrow(() -> new RuntimeException("Post not found"));

    return ResponseEntity.ok("Unliked and notification sent.");

  }

  @GetMapping("/isLiked")
  public ResponseEntity<Boolean> isPostLiked(
      @RequestParam Integer postId,
      @RequestParam Integer userId) {
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
      @PathVariable Integer userId) {
    PostStatsDTO stats = postService.getUserStatsForCurrentMonth(userId);
    return ResponseEntity.ok(stats);
  }
}
