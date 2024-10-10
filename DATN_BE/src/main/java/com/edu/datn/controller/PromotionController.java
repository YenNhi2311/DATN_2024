package com.edu.datn.controller;

import com.edu.datn.dto.PromotionDTO;
import com.edu.datn.entities.PromotionEntity;
import com.edu.datn.service.PromotionService;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/promotions")
public class PromotionController {
  @Autowired
  private PromotionService promotionService;

  // Get all promotions
  @GetMapping
  public List<PromotionEntity> getAllPromotions() {
    return promotionService.getAllPromotions();
  }

  // Get promotion by ID
  @GetMapping("/{id}")
  public Optional<PromotionEntity> getPromotionById(@PathVariable Integer id) {
    return promotionService.getPromotionById(id);
  }

  // Create promotion
  @PostMapping
  public PromotionEntity createPromotion(@RequestBody PromotionDTO dto) {
    return promotionService.addPromotion(dto);
  }

  // Update promotion
  @PutMapping("/{id}")
  public PromotionEntity updatePromotion(
    @PathVariable Integer id,
    @RequestBody PromotionDTO dto
  ) {
    return promotionService.updatePromotion(id, dto);
  }

  // Delete promotion
  @DeleteMapping("/{id}")
  public void deletePromotion(@PathVariable Integer id) {
    promotionService.deletePromotion(id);
  }
}
