package com.edu.datn.dto;

public class PostStatsDTO {
  private Integer totalPosts;
  private Integer totalLikes;

  public PostStatsDTO(Integer totalPosts, Integer totalLikes) {
    this.totalPosts = totalPosts;
    this.totalLikes = totalLikes;
  }

  public Integer getTotalPosts() {
    return totalPosts;
  }

  public void setTotalPosts(Integer totalPosts) {
    this.totalPosts = totalPosts;
  }

  public Integer getTotalLikes() {
    return totalLikes;
  }

  public void setTotalLikes(Integer totalLikes) {
    this.totalLikes = totalLikes;
  }
}
