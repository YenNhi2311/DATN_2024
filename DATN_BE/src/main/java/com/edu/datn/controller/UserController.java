package com.edu.datn.controller;

import java.util.List;

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
import com.edu.datn.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.web.bind.annotation.RequestHeader;

@RestController
@RequestMapping("/user")
public class UserController {

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
            @RequestHeader("user_id") Integer userId,
            @RequestPart("user") String userJson,
            @RequestPart(value = "img", required = false) MultipartFile img) {

        if (userId == null) {
            return ResponseEntity.badRequest().body("User ID must not be null");
        }

        try {
            // Parse JSON string to UserDTO
            ObjectMapper objectMapper = new ObjectMapper();
            UserDTO userDTO = objectMapper.readValue(userJson, UserDTO.class);

            // Tìm người dùng và cập nhật thông tin
            UserEntity existingUser = userService.findById(userId);
            existingUser.setFullname(userDTO.getFullname());
            existingUser.setEmail(userDTO.getEmail());
            existingUser.setPhone(userDTO.getPhone());
            // existingUser.setUsername(userDTO.getUsername());

            // Cập nhật mật khẩu nếu có
            if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
                existingUser.setPassword(userDTO.getPassword());
            }

            // Cập nhật thông tin và xử lý ảnh nếu có
            userService.updateUser(userDTO, img);

            return ResponseEntity.ok("User updated successfully");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error updating user: " + e.getMessage());
        }
    }

    // API để thay đổi mật khẩu người dùng
    @PutMapping("/password")
    public ResponseEntity<?> updatePassword(
            @RequestHeader("user_id") Integer userId,
            @RequestPart("user") String userJson) {

        if (userId == null) {
            return ResponseEntity.badRequest().body("Người dùng không tìm thấy");
        }

        try {
            // Parse JSON string to UserDTO
            ObjectMapper objectMapper = new ObjectMapper();
            UserDTO userDTO = objectMapper.readValue(userJson, UserDTO.class);

            // Thiết lập userId vào userDTO để sử dụng trong service
            userDTO.setUserId(userId);

            // Cập nhật mật khẩu
            userService.updateUserPass(userDTO);

            return ResponseEntity.ok("Mật khẩu thay đổi thành công");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Người dùng không tồn tại");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Lỗi: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Có lỗi xảy ra: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<UserEntity>> getAllUsers() {
        List<UserEntity> users = userService.getAllUsersExceptAdmin();
        return ResponseEntity.ok(users);
    }

}
