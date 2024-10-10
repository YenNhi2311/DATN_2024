package com.edu.datn.jpa;

import com.edu.datn.entities.PromotionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PromotionJPA extends JpaRepository<PromotionEntity, Integer> {
}
