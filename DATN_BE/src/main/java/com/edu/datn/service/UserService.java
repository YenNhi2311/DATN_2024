package com.edu.datn.service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.edu.datn.dto.ChangePasswordRequest;
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

  public UserDTO findByIdDTO(Integer id) {
    UserEntity userEntity = userJPA.findById(id).orElseThrow(() -> new EntityNotFoundException("User not found"));

    // Chuyển đổi từ UserEntity sang UserDTO
    UserDTO userDTO = new UserDTO();
    userDTO.setUserId(userEntity.getUserId());
    userDTO.setUsername(userEntity.getUsername());
    userDTO.setPassword(userEntity.getPassword());
    // Thêm các thuộc tính khác nếu cần

    return userDTO;
  }

  public void updateUser(UserDTO userDTO, MultipartFile img) throws IOException {
    Optional<UserEntity> existingUserOptional = userJPA.findById(userDTO.getUserId());
    if (existingUserOptional.isPresent()) {
      UserEntity existingUser = existingUserOptional.get();

      // Cập nhật các thuộc tính từ DTO
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

 public void updateUserPass(ChangePasswordRequest changePasswordRequest) {
    // Tìm người dùng theo ID
    Optional<UserEntity> existingUserOptional = userJPA.findById(Integer.parseInt(changePasswordRequest.getUserId()));

    if (existingUserOptional.isPresent()) {
        UserEntity existingUser = existingUserOptional.get();

        // Kiểm tra mật khẩu mới
        String newPassword = changePasswordRequest.getNewPassword();
        if (newPassword != null && !newPassword.isEmpty()) {
            // Mã hóa mật khẩu mới
            String encodedPassword = passwordEncoder.encode(newPassword);
            existingUser.setPassword(encodedPassword);

            // Hủy token cũ sau khi mật khẩu đã thay đổi
            authenService.revokeAllTokenByUser(existingUser);

            // Lưu lại người dùng với mật khẩu mới
            userJPA.save(existingUser);
        } else {
            throw new RuntimeException("Mật khẩu không được để trống");
        }
    } else {
        throw new RuntimeException("Người dùng không tồn tại");
    }
}


  public void resetUserPass(UserEntity user) throws IOException {
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
