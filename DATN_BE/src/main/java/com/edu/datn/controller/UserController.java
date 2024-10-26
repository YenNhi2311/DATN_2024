package com.edu.datn.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.edu.datn.dto.AuthenticationResponse;
import com.edu.datn.dto.ChangePasswordRequest;
import com.edu.datn.dto.UserDTO;
import com.edu.datn.entities.UserEntity;
import com.edu.datn.service.JwtService;
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

            // Đảm bảo UserDTO có ID
            userDTO.setUserId(userId);

            // Cập nhật thông tin và xử lý ảnh nếu có
            userService.updateUser(userDTO, img);

            return ResponseEntity.ok("User updated successfully");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error updating user: " + e.getMessage());
        }
    }


    @PutMapping("/password")
    public ResponseEntity<?> updatePassword(
            @RequestHeader("user_id") Integer userId,
            @RequestBody ChangePasswordRequest changePasswordRequest) {

        // Kiểm tra nếu không có userId
        if (userId == null) {
            return ResponseEntity.badRequest().body("Người dùng không tìm thấy");
        }

        try {
            // Kiểm tra mật khẩu mới có null hoặc trống
            String newPassword = changePasswordRequest.getNewPassword();
            if (newPassword == null || newPassword.isEmpty()) {
                return ResponseEntity.badRequest().body("Mật khẩu không được để trống");
            }

            // Cập nhật userId vào DTO trước khi gửi đến service
            changePasswordRequest.setUserId(userId.toString());

            // In ra để kiểm tra xem giá trị mật khẩu có đúng không
            System.out.println("Received newPassword: " + newPassword);

            // Gọi đến service để cập nhật mật khẩu
            userService.updateUserPass(changePasswordRequest);

            // Nếu thành công
            return ResponseEntity.ok("Mật khẩu đã được cập nhật thành công");
        } catch (EntityNotFoundException e) {
            // Trường hợp người dùng không tồn tại
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Người dùng không tồn tại");
        } catch (Exception e) {
            // Xử lý các lỗi hệ thống khác
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi hệ thống: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<UserEntity>> getAllUsers() {
        List<UserEntity> users = userService.getAllUsersExceptAdmin();
        return ResponseEntity.ok(users);
    }

}
