package com.edu.datn.jpa;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.edu.datn.entities.CartEntity;

@Repository
public interface CartJPA extends JpaRepository<CartEntity, Integer> {

    List<CartEntity> findByUser_UserId(Integer userId);


    
}
