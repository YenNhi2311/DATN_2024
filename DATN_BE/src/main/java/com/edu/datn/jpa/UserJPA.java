package com.edu.datn.jpa;

import com.edu.datn.entities.UserEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserJPA extends JpaRepository<UserEntity, Integer> {
  Optional<UserEntity> findByUsername(String username);
}
