package com.edu.datn.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.edu.datn.dto.UserDTO;
import com.edu.datn.entities.UserEntity;
import com.edu.datn.jpa.UserJPA;
import com.edu.datn.service.UserService;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.web.bind.annotation.RequestHeader;

@RestController
@RequestMapping("/api/user")
public class UserController {

  @Autowired
  private UserJPA userJPA;

  @Autowired
  private UserService userService;

  @GetMapping("/profile")
  public ResponseEntity<UserEntity> getUserById(@RequestHeader("user_id") Integer userId) {
    try {
      UserEntity user = userService.findById(userId);
      return ResponseEntity.ok(user);
    } catch (EntityNotFoundException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Trả về 404 nếu không tìm thấy người dùng
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null); // Trả về 400 nếu có lỗi khác
    }
  }

  // API để cập nhật thông tin người dùng bao gồm cả hình ảnh
  @PutMapping("/profile")
  public ResponseEntity<String> updateUser(
      @RequestHeader("user_id") Integer userId, // Nhận user_id từ header
      @RequestPart("user") UserDTO userDTO,
      @RequestPart(value = "img", required = false) MultipartFile img) {

    System.out.println("Updating user with ID: " + userId);
    System.out.println("User data: " + userDTO);
    if (img != null) {
      System.out.println("Image file: " + img.getOriginalFilename());
    }
    if (userId == null) {
      return ResponseEntity.badRequest().body("User ID must not be null");
  }
    try {
      // Tìm người dùng và cập nhật thông tin, bao gồm xử lý hình ảnh nếu có
      UserEntity existingUser = userService.findById(userId);

      existingUser.setFullname(userDTO.getFullname());
      existingUser.setEmail(userDTO.getEmail());
      existingUser.setPhone(userDTO.getPhone());
      existingUser.setUsername(userDTO.getUsername());

      // Cập nhật mật khẩu nếu có
      if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
        existingUser.setPassword(userDTO.getPassword());
      }

      // Cập nhật thông tin và xử lý ảnh
      // userService.updateUser(existingUser, img);
      userService.updateUser(userDTO, img);

      return ResponseEntity.ok("User updated successfully");
    } catch (Exception e) {
      System.out.println("Error: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error updating user: " + e.getMessage());
    }
  }
}
