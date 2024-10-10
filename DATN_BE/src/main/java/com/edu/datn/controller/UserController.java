package com.edu.datn.controller;

import com.edu.datn.dto.UserDTO;
import com.edu.datn.entities.AddressEntity;
import com.edu.datn.entities.UserEntity;
import com.edu.datn.jpa.AddressJPA;
import com.edu.datn.service.UserService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping
public class UserController {
  @Autowired
  private UserService userJPA;

  // @GetMapping("/user/{userId}")
  // public ResponseEntity<UserDTO> getUserById(@PathVariable Integer userId) {
  //   UserEntity user = userJPA.findById(userId);

  //   UserDTO userDTO = new UserDTO();
  //   userDTO.setUserId(user.getUserId());
  //   userDTO.setUsername(user.getUsername());
  //   userDTO.setEmail(user.getEmail());
  //   userDTO.setImg(user.getImg());
  //   userDTO.setFullname(user.getFullname());

  //   return new ResponseEntity<>(userDTO, HttpStatus.OK);
  // }
  @GetMapping("/user/{userId}")
  public ResponseEntity<UserEntity> getUserById(@PathVariable Integer userId) {
    UserEntity user = userJPA.findById(userId);

    // Trả về thông tin người dùng cùng với các quan hệ đã ánh xạ
    return ResponseEntity.ok(user);
  }
}
