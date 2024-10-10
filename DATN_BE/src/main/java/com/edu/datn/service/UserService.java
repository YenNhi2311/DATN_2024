package com.edu.datn.service;

import com.edu.datn.entities.UserEntity;
import com.edu.datn.jpa.UserJPA;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
  @Autowired
  private UserJPA userJPA;

  @Autowired
  private JwtService jwtService;

  @Transactional
  public UserEntity findByUsername(String username) {
    return userJPA.findByUsername(username).orElseThrow();
  }

  public UserEntity findById(Integer id) {
    return userJPA.findById(id).orElseThrow();
  }

  public String getUsernameFromToken(String token) {
    // Giả sử token bắt đầu bằng "Bearer ", cần cắt bỏ phần đó
    if (token.startsWith("Bearer ")) {
      token = token.substring(7);
    }
    // Sử dụng JwtService để trích xuất username từ token
    return jwtService.extractUsername(token);
  }
}
