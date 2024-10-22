package com.edu.datn.controller;

import com.edu.datn.dto.SkinTypeDTO;
import com.edu.datn.entities.SkintypeEntity;
import com.edu.datn.service.SkinTypeService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/skintypes")
public class SkinTypeController {
  @Autowired
  private SkinTypeService skintypeService;

  @GetMapping
  public ResponseEntity<List<SkintypeEntity>> getAllSkintypes() {
    List<SkintypeEntity> skintypes = skintypeService.getAllSkintypes();
    return ResponseEntity.ok(skintypes);
  }

  @GetMapping("/{id}")
  public ResponseEntity<SkintypeEntity> getSkintypeById(
    @PathVariable Integer id
  ) {
    return skintypeService
      .getSkintypeById(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<SkintypeEntity> addSkintype(
    @RequestBody SkinTypeDTO dto
  ) {
    SkintypeEntity skintype = skintypeService.addSkintype(dto);
    return ResponseEntity.ok(skintype);
  }

  @PutMapping("/{id}")
  public ResponseEntity<SkintypeEntity> updateSkintype(
    @PathVariable Integer id,
    @RequestBody SkinTypeDTO dto
  ) {
    SkintypeEntity updatedSkintype = skintypeService.updateSkintype(id, dto);
    if (updatedSkintype != null) {
      return ResponseEntity.ok(updatedSkintype);
    } else {
      return ResponseEntity.notFound().build();
    }
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteSkintype(@PathVariable Integer id) {
    skintypeService.deleteSkintype(id);
    return ResponseEntity.noContent().build();
  }
}
