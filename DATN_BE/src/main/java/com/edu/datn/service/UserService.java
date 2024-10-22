package com.edu.datn.service;

import java.io.IOException;
import java.util.List;
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
  private AuthenticationService authenService;

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

      // Cập nhật các thuộc tính khác
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
        // Lưu hình ảnh mới và cập nhật đường dẫn
        String imagePath = ImageUtils.saveImage(img);
        existingUser.setImg(imagePath);
      }

      // Lưu người dùng đã cập nhật
      userJPA.save(existingUser);
    } else {
      throw new RuntimeException("User does not exist");
    }
  }

  public void updateUserPass(UserDTO userDTO) throws IOException {
    // Kiểm tra xem người dùng có tồn tại trong cơ sở dữ liệu không
    Optional<UserEntity> existingUserOptional = userJPA.findById(userDTO.getUserId());

    if (existingUserOptional.isPresent()) {
        UserEntity existingUser = existingUserOptional.get();
        
        // Cập nhật mật khẩu nếu nó đã thay đổi
        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(userDTO.getPassword()));

            // Tạo token mới cho người dùng sau khi thay đổi mật khẩu
            String newAccessToken = jwtService.generateAccessToken(existingUser);
            String newRefreshToken = jwtService.generateRefreshToken(existingUser);
            
            // Hủy tất cả các token cũ của người dùng
            authenService.revokeAllTokenByUser(existingUser);
            authenService.saveUserToken(newAccessToken, newRefreshToken, existingUser);
            
            // Có thể trả về token mới nếu cần
            // return new AuthenticationResponse(newAccessToken, newRefreshToken, "role", "Mật khẩu đã được cập nhật thành công", existingUser.getUserId());
        } else {
            // Nếu không có mật khẩu mới, không thực hiện việc tạo token
            throw new RuntimeException("Mật khẩu không được để trống");
        }

        // Lưu người dùng đã cập nhật
        userJPA.save(existingUser);
    } else {
        throw new RuntimeException("Người dùng không tồn tại");
    }
}



  public void resetUserPass(UserEntity user) throws IOException {
    // Kiểm tra xem người dùng có tồn tại trong cơ sở dữ liệu không
    Optional<UserEntity> existingUserOptional = userJPA.findById( user.getUserId());

    if (existingUserOptional.isPresent()) {
      UserEntity existingUser = existingUserOptional.get();
      // Cập nhật mật khẩu nếu nó đã thay đổi
      if ( user.getPassword() != null && ! user.getPassword().isEmpty()) {
        existingUser.setPassword(passwordEncoder.encode(user.getPassword()));
      }

      // Lưu người dùng đã cập nhật
      userJPA.save(existingUser);
    } else {
      throw new RuntimeException("Người dùng không tồn tại");
    }
  }


  public List<UserEntity> getAllUsersExceptAdmin() {
    return userJPA
      .findAll()
      .stream()
      .filter(user -> !user.getUsername().equalsIgnoreCase("admin"))
      .toList();
  }

  
  // Phương thức lấy tên người dùng từ token
  public String getUsernameFromToken(String token) {
    if (token.startsWith("Bearer ")) {
      token = token.substring(7);
    }
    return jwtService.extractUsername(token);
  }
}
