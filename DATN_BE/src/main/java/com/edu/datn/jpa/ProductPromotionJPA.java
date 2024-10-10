package com.edu.datn.jpa;

import com.edu.datn.entities.ProductPromotionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductPromotionJPA extends JpaRepository<ProductPromotionEntity, Integer> {
}
