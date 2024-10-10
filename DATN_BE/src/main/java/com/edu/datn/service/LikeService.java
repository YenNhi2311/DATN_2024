package com.edu.datn.service;

import com.edu.datn.dto.PostDTO;
import com.edu.datn.entities.LikeEntity;
import com.edu.datn.entities.PostEntity;
import com.edu.datn.entities.UserEntity;
import com.edu.datn.jpa.LikeJPA;
import com.edu.datn.jpa.PostJPA;
import com.edu.datn.jpa.UserJPA;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LikeService {
  @Autowired
  private PostJPA postJPA;

  @Autowired
  private LikeJPA likeJPA;

  @Autowired
  private UserJPA userJPA;

  public PostEntity likePost(Integer postId, Integer userId) {
    PostEntity post = postJPA.findById(postId).orElseThrow();
    UserEntity user = userJPA.findById(userId).orElseThrow();

    Optional<LikeEntity> likeEntity = likeJPA.findByPostAndUser(post, user);

    if (!likeEntity.isPresent()) {
      LikeEntity newLike = new LikeEntity();
      newLike.setPost(post);
      newLike.setUser(user);
      newLike.setCreateAt(LocalDateTime.now());
      likeJPA.save(newLike);
    }
    return post;
  }

  public PostEntity unlikePost(Integer postId, Integer userId) {
    PostEntity post = postJPA.findById(postId).orElseThrow();
    UserEntity user = userJPA.findById(userId).orElseThrow();

    LikeEntity likeEntity = likeJPA.findByPostAndUser(post, user).orElseThrow();
    likeJPA.delete(likeEntity);

    return post;
  }

  public boolean isPostLikedByUser(Integer postId, Integer userId) {
    PostEntity post = postJPA.findById(postId).orElseThrow();
    UserEntity user = userJPA.findById(userId).orElseThrow();

    return likeJPA.findByPostAndUser(post, user).isPresent();
  }

  public Integer getLikesCountForPost(PostEntity post) {
    return likeJPA.countLikesByPost(post);
  }
}
