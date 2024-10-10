package com.edu.datn.jpa;

import com.edu.datn.entities.CategoriesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriesJPA extends JpaRepository<CategoriesEntity, Integer> {
    
    
}
