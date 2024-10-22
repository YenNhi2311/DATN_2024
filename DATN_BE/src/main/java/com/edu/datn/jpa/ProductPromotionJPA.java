package com.edu.datn.jpa;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.edu.datn.entities.ProductEntity;
import com.edu.datn.entities.ProductPromotionEntity;

@Repository
public interface ProductPromotionJPA extends JpaRepository<ProductPromotionEntity, Integer> {
    List<ProductPromotionEntity> findByProduct(ProductEntity product);
}
