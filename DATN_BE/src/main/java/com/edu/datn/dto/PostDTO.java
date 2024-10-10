package com.edu.datn.dto;

import com.edu.datn.entities.PostEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class PostDTO {
  private Integer postId;
  private String content;
  private boolean isLikedByCurrentUser; // Thêm thuộc tính này

  // Constructor, Getters, Setters
  public PostDTO(PostEntity post) {
    this.postId = post.getPostId();
    this.content = post.getContent();
    // Các trường khác bạn muốn sao chép từ PostEntity vào PostDTO
  }
}
