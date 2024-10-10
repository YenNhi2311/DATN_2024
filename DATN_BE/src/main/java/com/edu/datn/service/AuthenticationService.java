package com.edu.datn.service;

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
import java.util.List;
import java.util.Set;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {
  // Các biến thành viên `private final` để giữ các phụ thuộc (dependencies) của
  // service
  private final UserJPA repository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final TokenJPA tokenRepository;
  private final AuthenticationManager authenticationManager;
  private final RoleJPA roleRepository; // Thêm repository để truy cập RoleEntity
  private final User_RoleJPA userRoleRepository;

  // Constructor cho phép khởi tạo `AuthenticationService` với các phụ thuộc cần
  // thiết
  public AuthenticationService(
    UserJPA repository,
    PasswordEncoder passwordEncoder,
    JwtService jwtService,
    TokenJPA tokenRepository,
    AuthenticationManager authenticationManager,
    RoleJPA roleRepository,
    User_RoleJPA userRoleRepository
  ) { // Thêm tham số vào constructor
    this.repository = repository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
    this.tokenRepository = tokenRepository;
    this.authenticationManager = authenticationManager;
    this.roleRepository = roleRepository; // Khởi tạo repository
    this.userRoleRepository = userRoleRepository;
  }

  // Phương thức đăng ký người dùng mới
  public AuthenticationResponse register(UserEntity request) {
    // Kiểm tra xem người dùng đã tồn tại chưa
    if (repository.findByUsername(request.getUsername()).isPresent()) {
      return new AuthenticationResponse(
        null,
        null,
        null,
        "Người dùng đã tồn tại",
        null
      );
    }

    // Tạo thông tin người dùng mới
    UserEntity user = new UserEntity();
    user.setEmail(request.getEmail());
    user.setFullname(request.getFullname());
    user.setPhone(request.getPhone());
    user.setUsername(request.getUsername());
    user.setPassword(passwordEncoder.encode(request.getPassword()));

    // Lưu người dùng vào cơ sở dữ liệu
    user = repository.save(user);

    // Lấy vai trò 'user'
    RoleEntity role = roleRepository
      .findByName("user")
      .orElseThrow(() -> new RuntimeException("Vai trò 'user' không tồn tại"));

    // Tạo và lưu thông tin UserRole
    UserRoleEntity userRole = new UserRoleEntity();
    userRole.setRole(role);
    userRole.setUser(user);
    userRole.setPermission("Khach Hang");
    userRoleRepository.save(userRole);

    // Thiết lập vai trò cho người dùng
    user.setUserRoles(Set.of(userRole));

    // Tạo token JWT
    String accessToken = jwtService.generateAccessToken(user);
    String refreshToken = jwtService.generateRefreshToken(user);

    // Lưu token vào cơ sở dữ liệu
    saveUserToken(accessToken, refreshToken, user);

    // Trả về thông tin người dùng cùng với token
    String roleName = role.getName();
    return new AuthenticationResponse(
      accessToken,
      refreshToken,
      roleName,
      "Đăng ký thành công",
      user.getUserId()
    );
  }

  // Phương thức xác thực người dùng
  public AuthenticationResponse authenticate(UserEntity request) {
    // Xác thực người dùng
    authenticationManager.authenticate(
      new UsernamePasswordAuthenticationToken(
        request.getUsername(),
        request.getPassword()
      )
    );

    // Tìm kiếm người dùng trong cơ sở dữ liệu
    UserEntity user = repository
      .findByUsername(request.getUsername())
      .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

    // Lấy danh sách các vai trò của người dùng từ bảng userRoles
    Set<UserRoleEntity> userRoles = userRoleRepository.findByUser(user);

    // Kiểm tra xem người dùng có vai trò admin hay không
    boolean isAdmin = userRoles
      .stream()
      .anyMatch(
        userRole -> userRole.getRole().getName().equalsIgnoreCase("admin")
      );

    // Tạo các token JWT mới
    String accessToken = jwtService.generateAccessToken(user);
    String refreshToken = jwtService.generateRefreshToken(user);

    // Hủy tất cả các token hợp lệ trước đó
    revokeAllTokenByUser(user);

    // Lưu các token mới vào cơ sở dữ liệu
    saveUserToken(accessToken, refreshToken, user);

    // Trả về thông tin người dùng cùng với token
    String role = isAdmin ? "admin" : "user";
    return new AuthenticationResponse(
      accessToken,
      refreshToken,
      role,
      "Đăng nhập thành công",
      user.getUserId()
    );
  }

  // Phương thức hủy tất cả các token hợp lệ trước đó của người dùng
  public void revokeAllTokenByUser(UserEntity user) {
    List<TokenEntity> validTokens = tokenRepository.findAllAccessTokensByUser(
      user.getUserId()
    );
    if (!validTokens.isEmpty()) {
      validTokens.forEach(t -> t.setLoggedOut(true)); // Đánh dấu token đã đăng xuất
      tokenRepository.saveAll(validTokens);
    }
  }

  // Phương thức lưu các token JWT vào cơ sở dữ liệu
  private void saveUserToken(
    String accessToken,
    String refreshToken,
    UserEntity user
  ) {
    TokenEntity token = new TokenEntity();
    token.setAccessToken(accessToken);
    token.setRefreshToken(refreshToken);
    token.setLoggedOut(false); // Đánh dấu token này chưa đăng xuất
    token.setUser(user); // Liên kết token với người dùng
    tokenRepository.save(token);
  }

  // Phương thức làm mới token (refresh token)
  public ResponseEntity<AuthenticationResponse> refreshToken(
    HttpServletRequest request,
    HttpServletResponse response
  ) {
    // Lấy token từ header authorization
    String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      return new ResponseEntity<>(HttpStatus.UNAUTHORIZED); // Nếu không có token hoặc token không hợp lệ
    }

    String token = authHeader.substring(7); // Bỏ phần "Bearer " để lấy token

    // Lấy tên người dùng từ token
    String username = jwtService.extractUsername(token);

    // Kiểm tra xem người dùng có tồn tại trong cơ sở dữ liệu không
    UserEntity user = repository
      .findByUsername(username)
      .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

    // Lấy danh sách các vai trò của người dùng từ `UserRoleEntity`
    Set<UserRoleEntity> userRoles = userRoleRepository.findByUser(user);

    // Lấy tên vai trò (roleName) từ vai trò đầu tiên của người dùng
    String roleName = userRoles
      .stream()
      .findFirst()
      .map(userRole -> userRole.getRole().getName())
      .orElse("user"); // Mặc định là 'user' nếu không tìm thấy vai trò nào

    // Kiểm tra tính hợp lệ của refresh token
    if (jwtService.isValidRefreshToken(token, user)) {
      // Tạo các token mới
      String accessToken = jwtService.generateAccessToken(user);
      String refreshToken = jwtService.generateRefreshToken(user);

      // Hủy tất cả các token hợp lệ trước đó của người dùng
      revokeAllTokenByUser(user);

      // Lưu các token mới vào cơ sở dữ liệu
      saveUserToken(accessToken, refreshToken, user);

      // Trả về các token mới và vai trò của người dùng
      return new ResponseEntity<>(
        new AuthenticationResponse(
          accessToken,
          refreshToken,
          roleName,
          "Token mới đã được tạo",
          user.getUserId()
        ),
        HttpStatus.OK
      );
    }

    return new ResponseEntity<>(HttpStatus.UNAUTHORIZED); // Trả về trạng thái không được phép nếu token không hợp
    // lệ
  }
}
