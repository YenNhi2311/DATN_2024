package com.edu.datn.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.edu.datn.entities.UserEntity;
import com.edu.datn.jpa.UserJPA;

@Service
public class UserService {
  @Autowired
  private UserJPA userJPA;

  @Autowired
  private JwtService jwtService;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Transactional
  public UserEntity findByUsername(String username) {
    return userJPA.findByUsername(username).orElse(null); // Trả về null nếu không tìm thấy
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

  // Phương thức cập nhật thông tin người dùng
  public void updateUser(UserEntity user) {
    // Kiểm tra xem người dùng có tồn tại trong cơ sở dữ liệu không
    Optional<UserEntity> existingUserOptional = userJPA.findById(user.getUserId());
    if (existingUserOptional.isPresent()) {
      UserEntity existingUser = existingUserOptional.get();

      // Cập nhật các thuộc tính khác của người dùng nếu chúng không null hoặc không
      // rỗng
      if (user.getEmail() != null && !user.getEmail().isEmpty()) {
        existingUser.setEmail(user.getEmail());
      }
      if (user.getFullname() != null && !user.getFullname().isEmpty()) {
        existingUser.setFullname(user.getFullname());
      }
      if (user.getPhone() != null && !user.getPhone().isEmpty()) {
        existingUser.setPhone(user.getPhone());
      }
      if (user.getUsername() != null && !user.getUsername().isEmpty()) {
        existingUser.setUsername(user.getUsername());
      }

      // Cập nhật mật khẩu nếu nó đã thay đổi
      if (user.getPassword() != null && !user.getPassword().isEmpty()) {
        existingUser.setPassword(passwordEncoder.encode(user.getPassword()));
      }

      // Lưu người dùng đã cập nhật
      userJPA.save(existingUser);
    } else {
      throw new RuntimeException("Người dùng không tồn tại");
    }
  }

}
