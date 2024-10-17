package com.edu.datn.controller;

import static com.edu.datn.utils.ImageUtils.*;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.edu.datn.dto.BrandsDTO;
import com.edu.datn.service.BrandsService;

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
  public ResponseEntity<BrandsDTO> createBrand(
      @RequestParam("name") String name,
      @RequestParam("place") String place,
      @RequestParam(value = "img", required = false) MultipartFile image) throws IOException {

    BrandsDTO brandsDTO = new BrandsDTO();
    brandsDTO.setName(name);
    brandsDTO.setPlace(place);

    if (image != null && !image.isEmpty()) {
      String imageName = image.getOriginalFilename();
      saveImage(image);

      brandsDTO.setImg(imageName);
    } else {
      System.out.println("No image file received.");
    }

    BrandsDTO savedBrands = brandsService.createBrand(brandsDTO, image);
    return ResponseEntity.status(HttpStatus.CREATED).body(savedBrands);
  }

  @PutMapping("/{id}")
  public ResponseEntity<BrandsDTO> updateBrand(
      @PathVariable Integer id,
      @RequestParam("name") String name,
      @RequestParam("place") String place,
      @RequestParam(value = "img", required = false) MultipartFile image) throws IOException {
    BrandsDTO brandsDTO = new BrandsDTO();
    brandsDTO.setName(name);
    brandsDTO.setPlace(place);

    if (image != null && !image.isEmpty()) {
      String imageName = image.getOriginalFilename();
      saveImage(image);
      brandsDTO.setImg(imageName);
    } else {
      System.out.println("No image file received.");
    }
    try {
      BrandsDTO updateBrands = brandsService.updateBrand(id, brandsDTO, image);
      return ResponseEntity.ok(updateBrands);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteBrand(@PathVariable Integer id) {
    brandsService.deleteBrand(id);
    return ResponseEntity.noContent().build();
  }
}