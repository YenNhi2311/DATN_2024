package com.edu.datn.controller;

import com.edu.datn.dto.SkinTypeDTO;
import com.edu.datn.entities.SkintypeEntity;
import com.edu.datn.service.SkinTypeService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/skintypes")
public class SkinTypeController {

  @Autowired
  private SkinTypeService skintypeService;

  // Get all skin types
  @GetMapping
  public ResponseEntity<List<SkintypeEntity>> getAllSkintypes() {
    List<SkintypeEntity> skintypes = skintypeService.getAllSkintypes();
    return ResponseEntity.ok(skintypes);
  }

  // Get a single skin type by ID
  @GetMapping("/{id}")
  public ResponseEntity<SkintypeEntity> getSkintypeById(@PathVariable Integer id) {
    return skintypeService
        .getSkintypeById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
  }

  // Add a new skin type
  @PostMapping
  public ResponseEntity<SkintypeEntity> addSkintype(@RequestBody SkinTypeDTO dto) {
    SkintypeEntity skintype = skintypeService.addSkintype(dto);
    return ResponseEntity.status(HttpStatus.CREATED).body(skintype);
  }

  // Update an existing skin type by ID
  @PutMapping("/{id}")
  public ResponseEntity<?> updateSkintype(
      @PathVariable Integer id,
      @RequestBody SkinTypeDTO dto) {

    // Check if the ID is valid
    if (id == null || id <= 0) {
      return ResponseEntity.badRequest().body("ID loại da không hợp lệ!");
    }

    // Attempt to update the skin type
    SkintypeEntity updatedSkintype = skintypeService.updateSkintype(id, dto);

    if (updatedSkintype != null) {
      return ResponseEntity.ok(updatedSkintype);
    } else {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Loại da không tồn tại!");
    }
  }

  // Delete a skin type by ID
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteSkintype(@PathVariable Integer id) {
    skintypeService.deleteSkintype(id);
    return ResponseEntity.noContent().build();
  }
}
