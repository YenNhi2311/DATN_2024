package com.edu.datn.controller;

import com.edu.datn.dto.BrandsDTO;
import com.edu.datn.entities.BrandsEntity;
import com.edu.datn.service.BrandsService;
import java.io.IOException;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/brands")
public class BrandsController {
  @Autowired
  private BrandsService brandsService;

  @GetMapping
  public ResponseEntity<List<BrandsDTO>> getAllBrands() {
    return ResponseEntity.ok(brandsService.getAllBrands());
  }

  @GetMapping("/{id}")
  public ResponseEntity<BrandsDTO> getBrandById(@PathVariable Integer id) {
    return ResponseEntity.ok(brandsService.getBrandById(id));
  }

  @PostMapping
  public ResponseEntity<BrandsDTO> createBrand(@RequestBody BrandsDTO brandDto)
    throws IOException {
    return ResponseEntity.ok(brandsService.createBrand(brandDto));
  }

  @PutMapping("/{id}")
  public ResponseEntity<BrandsDTO> updateBrand(
    @PathVariable Integer id,
    @RequestBody BrandsDTO brandDto
  )
    throws IOException {
    return ResponseEntity.ok(brandsService.updateBrand(id, brandDto));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteBrand(@PathVariable Integer id) {
    brandsService.deleteBrand(id);
    return ResponseEntity.noContent().build();
  }
}
