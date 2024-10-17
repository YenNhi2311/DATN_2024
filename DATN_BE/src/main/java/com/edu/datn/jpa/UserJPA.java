package com.edu.datn.jpa;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.edu.datn.entities.UserEntity;

@Repository
public interface UserJPA extends JpaRepository<UserEntity, Integer> {
  Optional<UserEntity> findByUsername(String username);

  Optional<UserEntity> findByUserId(Integer userId);
}
