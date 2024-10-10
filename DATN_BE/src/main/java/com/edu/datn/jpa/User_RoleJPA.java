package com.edu.datn.jpa;

import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;

import com.edu.datn.entities.UserEntity;
import com.edu.datn.entities.UserRoleEntity;

public interface User_RoleJPA extends JpaRepository<UserRoleEntity, Integer> {
    Optional<UserRoleEntity> findById(Integer userRoleId);

      Set<UserRoleEntity> findByUser(UserEntity user);
}

