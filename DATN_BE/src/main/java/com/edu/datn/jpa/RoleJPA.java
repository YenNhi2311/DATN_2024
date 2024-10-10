package com.edu.datn.jpa;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.edu.datn.entities.RoleEntity;

@Repository
public interface RoleJPA extends JpaRepository<RoleEntity, Integer> {
    
    Optional<RoleEntity> findByName(String name); // Method to find role by name
}