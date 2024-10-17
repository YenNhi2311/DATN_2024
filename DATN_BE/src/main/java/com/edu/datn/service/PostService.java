package com.edu.datn.service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.edu.datn.dto.PostStatsDTO;
import com.edu.datn.entities.ImgpostEntity;
import com.edu.datn.entities.PostEntity;
import com.edu.datn.entities.UserEntity;
import com.edu.datn.jpa.ImgPostJPA;
import com.edu.datn.jpa.LikeJPA;
import com.edu.datn.jpa.PostJPA;
import com.edu.datn.utils.ImageUtils;

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
  private ImgPostJPA imgPostJPA;

  @Autowired
  private ImageUtils imageUtils;

  public List<PostEntity> getAllPosts() {
    return postJPA.findAll();
  }

  public PostEntity createPost(
      PostEntity post,
      List<MultipartFile> images,
      String token) {
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

      // Thiết lập thời gian tạo và cập nhật cho bài viết
      post.setCreateAt(LocalDateTime.now());
      post.setUpdateAt(LocalDateTime.now());
      post.setLikes(new HashSet<>()); // Likes rỗng
      post.setComments(new HashSet<>()); // Comments rỗng

      // Lưu bài viết vào cơ sở dữ liệu trước
      PostEntity savedPost = postJPA.save(post);

      // Lưu hình ảnh nếu có
      if (images != null && !images.isEmpty()) {
        for (MultipartFile image : images) {
          String fileName = ImageUtils.saveImage(image); // Hàm saveImage sẽ lưu file và trả về tên file

          ImgpostEntity imgPost = new ImgpostEntity();
          imgPost.setImg(fileName); // Lưu đường dẫn/tên file của ảnh
          imgPost.setPost(savedPost); // Gán bài viết đã lưu

          // Lưu ảnh vào bảng imgposts
          imgPostJPA.save(imgPost);
        }
      }

      return savedPost;
    } catch (Exception e) {
      // Xử lý ngoại lệ khi lưu bài viết không thành công
      throw new RuntimeException("Lỗi khi lưu bài viết: " + e.getMessage(), e);
    }
  }

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
