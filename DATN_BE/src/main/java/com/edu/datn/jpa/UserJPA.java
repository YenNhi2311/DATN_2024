package com.edu.datn.jpa;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.edu.datn.dto.UserDTO;
import com.edu.datn.entities.UserEntity;
import jakarta.persistence.EntityNotFoundException;


@Repository
public interface UserJPA extends JpaRepository<UserEntity, Integer> {
  Optional<UserEntity> findByUsername(String username);

  Optional<UserEntity> findByUserId(Integer userId);

 
    // Thêm phương thức này để tìm kiếm và ném ngoại lệ nếu không tìm thấy
    default UserEntity findUserOrThrow(Integer userId) {
        return findByUserId(userId).orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));
    }


    
}