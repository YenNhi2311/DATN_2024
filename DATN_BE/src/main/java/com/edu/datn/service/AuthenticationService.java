package com.edu.datn.service;

import java.util.List;
import java.util.Set;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.edu.datn.dto.AuthenticationResponse;
import com.edu.datn.entities.RoleEntity;
import com.edu.datn.entities.TokenEntity;
import com.edu.datn.entities.UserEntity;
import com.edu.datn.entities.UserRoleEntity;
import com.edu.datn.jpa.RoleJPA;
import com.edu.datn.jpa.TokenJPA;
import com.edu.datn.jpa.UserJPA;
import com.edu.datn.jpa.User_RoleJPA;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Service
public class AuthenticationService {
  private final UserJPA userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final TokenJPA tokenRepository;
  private final AuthenticationManager authenticationManager;
  private final RoleJPA roleRepository;
  private final User_RoleJPA userRoleRepository;

  public AuthenticationService(
      UserJPA userRepository,
      PasswordEncoder passwordEncoder,
      JwtService jwtService,
      TokenJPA tokenRepository,
      AuthenticationManager authenticationManager,
      RoleJPA roleRepository,
      User_RoleJPA userRoleRepository) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
    this.tokenRepository = tokenRepository;
    this.authenticationManager = authenticationManager;
    this.roleRepository = roleRepository;
    this.userRoleRepository = userRoleRepository;
  }

  // Đăng ký người dùng mới
  public AuthenticationResponse register(UserEntity request) {
    if (userRepository.findByUsername(request.getUsername()).isPresent()) {
      return new AuthenticationResponse(null, null, null, "Người dùng đã tồn tại", null);
    }

    // Tạo người dùng mới
    UserEntity user = createUser(request);

    // Gán vai trò 'user' mặc định
    assignDefaultRole(user);

    // Tạo token JWT
    String accessToken = jwtService.generateAccessToken(user);
    String refreshToken = jwtService.generateRefreshToken(user);
    saveUserToken(accessToken, refreshToken, user);

    return new AuthenticationResponse(accessToken, refreshToken, "user", "Đăng ký thành công", user.getUserId());
  }

  private UserEntity createUser(UserEntity request) {
    UserEntity user = new UserEntity();
    user.setEmail(request.getEmail());
    user.setFullname(request.getFullname());
    user.setPhone(request.getPhone());
    user.setUsername(request.getUsername());
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    return userRepository.save(user);
  }

  private void assignDefaultRole(UserEntity user) {
    RoleEntity role = roleRepository.findByName("user")
        .orElseThrow(() -> new RuntimeException("Vai trò 'user' không tồn tại"));

    UserRoleEntity userRole = new UserRoleEntity();
    userRole.setRole(role);
    userRole.setUser(user);
    userRole.setPermission("Khách hàng");
    userRoleRepository.save(userRole);
    user.setUserRoles(Set.of(userRole));
  }

  // Xác thực người dùng
  public AuthenticationResponse authenticate(UserEntity request) {
    UserEntity user = userRepository.findByUsername(request.getUsername())
        .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

    try {
      authenticationManager.authenticate(
          new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
    } catch (BadCredentialsException e) {
      throw new RuntimeException("Mật khẩu không chính xác");
    } catch (DisabledException e) {
      throw new RuntimeException("Tài khoản đã bị khóa");
    } catch (Exception e) {
      throw new RuntimeException("Đã xảy ra lỗi trong quá trình xác thực");
    }

    // Lấy các vai trò của người dùng
    Set<UserRoleEntity> userRoles = userRoleRepository.findByUser(user);
    String role = determineUserRole(userRoles);

    String accessToken = jwtService.generateAccessToken(user);
    String refreshToken = jwtService.generateRefreshToken(user);

    revokeAllTokenByUser(user);
    saveUserToken(accessToken, refreshToken, user);

    return new AuthenticationResponse(accessToken, refreshToken, role, "Đăng nhập thành công", user.getUserId());
  }

  private String determineUserRole(Set<UserRoleEntity> userRoles) {
    return userRoles.stream()
        .anyMatch(userRole -> userRole.getRole().getName().equalsIgnoreCase("admin")) ? "admin" : "user";
  }

  // Hủy tất cả các token hợp lệ trước đó của người dùng
  public void revokeAllTokenByUser(UserEntity user) {
    List<TokenEntity> validTokens = tokenRepository.findAllAccessTokensByUser(user.getUserId());
    if (!validTokens.isEmpty()) {
      validTokens.forEach(t -> t.setLoggedOut(true)); // Đánh dấu token đã đăng xuất
      tokenRepository.saveAll(validTokens);
    }
  }

  // Lưu token vào cơ sở dữ liệu

  public void saveUserToken(String accessToken, String refreshToken, UserEntity user) {
    TokenEntity token = new TokenEntity();
    token.setAccessToken(accessToken);
    token.setRefreshToken(refreshToken);
    token.setLoggedOut(false);
    token.setUser(user);
    tokenRepository.save(token);
  }

  // Làm mới token
  public ResponseEntity<AuthenticationResponse> refreshToken(HttpServletRequest request,
      HttpServletResponse response) {
    String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    String token = authHeader.substring(7);
    String username = jwtService.extractUsername(token);

    UserEntity user = userRepository.findByUsername(username)
        .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

    if (jwtService.isValidRefreshToken(token, user)) {
      String accessToken = jwtService.generateAccessToken(user);
      String refreshToken = jwtService.generateRefreshToken(user);

      revokeAllTokenByUser(user);
      saveUserToken(accessToken, refreshToken, user);

      String roleName = determineUserRole(userRoleRepository.findByUser(user));

      return new ResponseEntity<>(
          new AuthenticationResponse(accessToken, refreshToken, roleName, "Token mới đã được tạo",
              user.getUserId()),
          HttpStatus.OK);
    }

    return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
  }
}
