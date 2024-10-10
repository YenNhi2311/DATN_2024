package com.edu.datn.service;

import com.edu.datn.dto.PromotionDTO;
import com.edu.datn.entities.ProductEntity;
import com.edu.datn.entities.PromotionEntity;
import com.edu.datn.jpa.ProductJPA;
import com.edu.datn.jpa.PromotionJPA;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PromotionService {
  @Autowired
  private PromotionJPA promotionRepository;

  @Autowired
  private ProductJPA productService;

  // Get all promotions
  public List<PromotionEntity> getAllPromotions() {
    return promotionRepository.findAll();
  }

  // Get promotion by ID
  public Optional<PromotionEntity> getPromotionById(Integer id) {
    return promotionRepository.findById(id);
  }

  // Add a new promotion
  public PromotionEntity addPromotion(PromotionDTO promotionDTO) {
    PromotionEntity promotion = new PromotionEntity();
    promotion.setName(promotionDTO.getName());
    promotion.setPercent(promotionDTO.getPercent());
    promotion.setStartDate(promotionDTO.getStartDate());
    promotion.setEndDate(promotionDTO.getEndDate());

    return promotionRepository.save(promotion);
  }

  // Update an existing promotion
  public PromotionEntity updatePromotion(
    Integer id,
    PromotionDTO promotionDTO
  ) {
    Optional<PromotionEntity> existingPromotion = promotionRepository.findById(
      id
    );
    if (existingPromotion.isPresent()) {
      PromotionEntity promotion = existingPromotion.get();
      promotion.setName(promotionDTO.getName());
      promotion.setPercent(promotionDTO.getPercent());
      promotion.setStartDate(promotionDTO.getStartDate());
      promotion.setEndDate(promotionDTO.getEndDate());
      return promotionRepository.save(promotion);
    } else {
      return null;
    }
  }

  // Delete a promotion
  public boolean deletePromotion(Integer id) {
    if (promotionRepository.existsById(id)) {
      promotionRepository.deleteById(id);
      return true;
    } else {
      return false;
    }
  }
}
