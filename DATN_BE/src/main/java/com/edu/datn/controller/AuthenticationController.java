package com.edu.datn.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.edu.datn.dto.AuthenticationResponse;
import com.edu.datn.entities.UserEntity;
import com.edu.datn.service.AuthenticationService;
import com.edu.datn.jpa.UserJPA; // Thêm import cho UserJPA

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController // Đánh dấu lớp này là một REST controller, xử lý các request HTTP
public class AuthenticationController {
  private final AuthenticationService authService; // Service xử lý xác thực người dùng
  private final UserJPA userJPA; // Thêm UserJPA vào controller

  // Constructor khởi tạo AuthenticationService và UserJPA
  public AuthenticationController(AuthenticationService authService, UserJPA userJPA) {
    this.authService = authService;
    this.userJPA = userJPA; // Khởi tạo UserJPA
  }

  // Endpoint đăng ký người dùng mới
  @PostMapping("/register")
  public ResponseEntity<AuthenticationResponse> register(
      @RequestBody UserEntity request // Nhận thông tin người dùng từ body của request
  ) {
    // Gọi service để đăng ký người dùng và trả về kết quả
    return ResponseEntity.ok(authService.register(request));
  }

  // Endpoint đăng nhập người dùng
  @PostMapping("/login")
  public ResponseEntity<AuthenticationResponse> login(@RequestBody UserEntity request) {
    try {
      AuthenticationResponse authResponse = authService.authenticate(request);
      return ResponseEntity.ok(authResponse);
    } catch (RuntimeException e) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body(new AuthenticationResponse(null, null, null, e.getMessage(), null));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new AuthenticationResponse(null, null, null, "Đã xảy ra lỗi không mong muốn", null));
    }
  }

  // Endpoint làm mới token
  @PostMapping("/refresh_token")
  public ResponseEntity<AuthenticationResponse> refreshToken(
      HttpServletRequest request, // Nhận request để lấy token từ header
      HttpServletResponse response // Trả về response cho client
  ) {
    // Gọi service để làm mới token và trả về kết quả
    return authService.refreshToken(request, response);
  }

  // Endpoint đăng xuất người dùng
  @PostMapping("/logout")
  public ResponseEntity<String> logout(HttpServletRequest request) {
    // Lấy token từ header Authorization
    String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      return ResponseEntity.status(401).body("Token không hợp lệ");
    }

    // Lấy token và loại bỏ phần "Bearer "
    String token = authHeader.substring(7);

    // Lấy thông tin người dùng hiện tại từ SecurityContext
    Authentication authentication = SecurityContextHolder
        .getContext()
        .getAuthentication();
    if (authentication == null ||
        !(authentication.getPrincipal() instanceof UserEntity)) {
      return ResponseEntity.status(401).body("Không thể xác thực người dùng");
    }

    // Lấy thông tin người dùng
    UserEntity user = (UserEntity) authentication.getPrincipal();

    // Gọi phương thức trong AuthenticationService để hủy token
    try {
      authService.revokeAllTokenByUser(user); // Hủy tất cả token hợp lệ của người dùng
      return ResponseEntity.ok("Đăng xuất thành công");
    } catch (Exception e) {
      return ResponseEntity.status(500).body("Lỗi khi đăng xuất");
    }
  }

  // Endpoint lấy thông tin người dùng theo userId
  @GetMapping("/user/{userId}")
  public ResponseEntity<UserEntity> getUserById(@PathVariable Integer userId) {
    try {
      UserEntity user = userJPA.findUserOrThrow(userId); // Lấy người dùng hoặc ném ngoại lệ
      return ResponseEntity.ok(user); // Trả về thông tin người dùng
    } catch (EntityNotFoundException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Nếu không tìm thấy người dùng
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); // Xử lý lỗi khác
    }
  }

}
