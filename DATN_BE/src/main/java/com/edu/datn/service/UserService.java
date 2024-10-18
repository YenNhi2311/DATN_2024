package com.edu.datn.service;

import java.io.IOException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.edu.datn.dto.UserDTO;
import com.edu.datn.entities.UserEntity;
import com.edu.datn.jpa.UserJPA;
import com.edu.datn.utils.ImageUtils;

import jakarta.persistence.EntityNotFoundException;

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
    return userJPA.findById(id).orElseThrow(() -> new EntityNotFoundException("User not found"));
  }

 public void updateUser(UserDTO userDTO, MultipartFile img) throws IOException {
    Optional<UserEntity> existingUserOptional = userJPA.findById(userDTO.getUserId());
    if (existingUserOptional.isPresent()) {
        UserEntity existingUser = existingUserOptional.get();

        if (userDTO.getEmail() != null) {
            existingUser.setEmail(userDTO.getEmail());
        }
        if (userDTO.getFullname() != null) {
            existingUser.setFullname(userDTO.getFullname());
        }
        if (userDTO.getPhone() != null) {
            existingUser.setPhone(userDTO.getPhone());
        }
        if (userDTO.getUsername() != null) {
            existingUser.setUsername(userDTO.getUsername());
        }

        // Cập nhật mật khẩu nếu có
        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }

        // Cập nhật ảnh nếu có
        if (img != null && !img.isEmpty()) {
            String imagePath = ImageUtils.saveImage(img);
            existingUser.setImg(imagePath);
        }

        userJPA.save(existingUser);
    } else {
        throw new RuntimeException("User does not exist");
    }
}


  public void updateUserPass(UserEntity user) throws IOException {
    // Kiểm tra xem người dùng có tồn tại trong cơ sở dữ liệu không
    Optional<UserEntity> existingUserOptional = userJPA.findById(user.getUserId());

    if (existingUserOptional.isPresent()) {
      UserEntity existingUser = existingUserOptional.get();
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

  // Phương thức lấy tên người dùng từ token
  public String getUsernameFromToken(String token) {
    if (token.startsWith("Bearer ")) {
      token = token.substring(7);
    }
    return jwtService.extractUsername(token);
  }
}
