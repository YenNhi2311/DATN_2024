package com.edu.datn.jpa;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.edu.datn.entities.ProductPromotionEntity;
import com.edu.datn.entities.PromotionEntity;

@Repository
public interface ProductPromotionJPA extends JpaRepository<ProductPromotionEntity, Integer> {
    @Query("SELECT pp.promotion FROM ProductPromotionEntity pp WHERE pp.product.productId = :productId")
    List<PromotionEntity> findPromotionsByProductId(@Param("productId") Integer productId);

    // List<ProductPromotionEntity> findByProduct(ProductEntity product);
}
