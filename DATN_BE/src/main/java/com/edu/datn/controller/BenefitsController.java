package com.edu.datn.controller;

import com.edu.datn.entities.BenefitsEntity;
import com.edu.datn.service.BenefitsService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/benefits")
public class BenefitsController {
  @Autowired
  private BenefitsService benefitsService;

  @GetMapping
  public ResponseEntity<List<BenefitsEntity>> getAllBenefits() {
    List<BenefitsEntity> benefits = benefitsService.getAllBenefits();
    return ResponseEntity.ok(benefits);
  }

  @GetMapping("/{id}")
  public ResponseEntity<BenefitsEntity> getBenefitById(
    @PathVariable Integer id
  ) {
    return benefitsService
      .getBenefitById(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<BenefitsEntity> addBenefit(
    @RequestBody BenefitsEntity benefit
  ) {
    BenefitsEntity newBenefit = benefitsService.addBenefit(benefit);
    return ResponseEntity.ok(newBenefit);
  }

  @PutMapping("/{id}")
  public ResponseEntity<BenefitsEntity> updateBenefit(
    @PathVariable Integer id,
    @RequestBody BenefitsEntity benefit
  ) {
    BenefitsEntity updatedBenefit = benefitsService.updateBenefit(id, benefit);
    if (updatedBenefit != null) {
      return ResponseEntity.ok(updatedBenefit);
    } else {
      return ResponseEntity.notFound().build();
    }
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteBenefit(@PathVariable Integer id) {
    benefitsService.deleteBenefit(id);
    return ResponseEntity.noContent().build();
  }
}
