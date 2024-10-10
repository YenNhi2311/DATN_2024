package com.edu.datn.controller;

import com.edu.datn.dto.ProductPromotionDTO;
import com.edu.datn.service.ProductPromotionService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/product-promotions")
public class ProductPromotionController {
  @Autowired
  private ProductPromotionService productPromotionService;

  @GetMapping
  public ResponseEntity<List<ProductPromotionDTO>> getAllProductPromotions() {
    List<ProductPromotionDTO> productPromotions = productPromotionService.getAllProductPromotions();
    return ResponseEntity.ok(productPromotions);
  }

  @GetMapping("/{id}")
  public ResponseEntity<ProductPromotionDTO> getProductPromotionById(
    @PathVariable Integer id
  ) {
    ProductPromotionDTO productPromotion = productPromotionService.getProductPromotionById(
      id
    );
    return ResponseEntity.ok(productPromotion);
  }

  @PostMapping
  public ResponseEntity<ProductPromotionDTO> createProductPromotion(
    @RequestBody ProductPromotionDTO productPromotionDTO
  ) {
    ProductPromotionDTO createdProductPromotion = productPromotionService.createProductPromotion(
      productPromotionDTO
    );
    return ResponseEntity.ok(createdProductPromotion);
  }

  @PutMapping("/{id}")
  public ResponseEntity<ProductPromotionDTO> updateProductPromotion(
    @PathVariable Integer id,
    @RequestBody ProductPromotionDTO productPromotionDTO
  ) {
    ProductPromotionDTO updatedProductPromotion = productPromotionService.updateProductPromotion(
      id,
      productPromotionDTO
    );
    return ResponseEntity.ok(updatedProductPromotion);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteProductPromotion(@PathVariable Integer id) {
    productPromotionService.deleteProductPromotion(id);
    return ResponseEntity.noContent().build();
  }
}
