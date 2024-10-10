package com.edu.datn.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.edu.datn.entities.ColorEntity;

@Repository
public interface ColorJPA extends JpaRepository<ColorEntity, Integer>{

    
} 
