package com.edu.datn.service;

import com.edu.datn.dto.PostStatsDTO;
import com.edu.datn.entities.LikeEntity;
import com.edu.datn.entities.PostEntity;
import com.edu.datn.entities.UserEntity;
import com.edu.datn.jpa.ImgPostJPA;
import com.edu.datn.jpa.LikeJPA;
import com.edu.datn.jpa.PostJPA;
import com.edu.datn.jpa.UserJPA;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PostService {
  @Autowired
  private PostJPA postJPA;

  @Autowired
  private JwtService jwtService;

  @Autowired
  private UserService userService;

  @Autowired
  private LikeJPA likeJPA;

  @Autowired
  private UserJPA userJPA;

  public List<PostEntity> getAllPosts() {
    return postJPA.findAll();
  }

  public PostEntity createPost(PostEntity post, String token) {
    // Kiểm tra dữ liệu đầu vào (ví dụ: nội dung bài viết không được rỗng)
    if (post.getContent() == null || post.getContent().trim().isEmpty()) {
      throw new IllegalArgumentException("Nội dung bài viết không được rỗng");
    }

    try {
      // Kiểm tra token có hợp lệ không
      String username = jwtService.extractUsername(token);
      if (username == null) {
        throw new IllegalArgumentException("Invalid token");
      }

      // Tìm UserEntity từ username
      UserEntity user = userService.findByUsername(username);
      if (user == null) {
        throw new IllegalArgumentException("User not found");
      }

      // Gán user vào post
      post.setUser(user);

      // Kiểm tra dữ liệu đầu vào (ví dụ: nội dung bài viết không được rỗng)
      if (post.getContent() == null || post.getContent().trim().isEmpty()) {
        throw new IllegalArgumentException("Nội dung bài viết không được rỗng");
      }

      // Thiết lập thời gian tạo và cập nhật cho bài viết
      post.setCreateAt(LocalDateTime.now());
      post.setUpdateAt(LocalDateTime.now());
      post.setLikes(new HashSet<>()); // Likes rỗng
      post.setComments(new HashSet<>()); // Comments rỗng
      post.setImgposts(new HashSet<>()); // Các ảnh rỗng

      // Lưu bài viết vào cơ sở dữ liệu
      return postJPA.save(post);
    } catch (Exception e) {
      // Xử lý ngoại lệ khi lưu bài viết không thành công
      throw new RuntimeException("Lỗi khi lưu bài viết: " + e.getMessage(), e);
    }
  }

  // public PostEntity updatePost(Integer postId, PostEntity postDetails) {
  //   PostEntity post = postJPA.findById(postId).orElseThrow();

  //   post.setContent(postDetails.getContent());
  //   post.setUpdateAt(postDetails.getUpdateAt());
  //   return postJPA.save(post);
  // }

  public PostEntity updatePost(Integer postId, String content) {
    Optional<PostEntity> postOpt = postJPA.findById(postId);
    if (postOpt.isPresent()) {
      PostEntity post = postOpt.get();
      post.setContent(content);
      return postJPA.save(post);
    }
    return null;
  }

  public void deletePost(Integer postId) {
    PostEntity post = postJPA.findById(postId).orElseThrow();
    postJPA.delete(post);
  }

  public Optional<PostEntity> getPostById(Integer postId) {
    return postJPA.findById(postId);
  }

  public List<PostEntity> getPostsByUserId(Integer userId) {
    return postJPA.findByUser_UserId(userId);
  }

  public PostStatsDTO getUserStatsForCurrentMonth(Integer userId) {
    Integer totalPosts = postJPA.countPostsByUserInCurrentMonth(userId);
    Integer totalLikes = likeJPA.countLikesByUserInCurrentMonth(userId);

    return new PostStatsDTO(totalPosts, totalLikes);
  }
}
