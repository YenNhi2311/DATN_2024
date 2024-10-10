package com.edu.datn.controller;

import com.edu.datn.dto.ProductDetailsDTO;
import com.edu.datn.jpa.ProductDetailsJPA;
import com.edu.datn.service.ProductDetailsService;
import java.io.IOException;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
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
@RequestMapping("/api/productdetails")
public class ProductDetailsController {
  @Autowired
  private ProductDetailsService productDetailsService;

  @Autowired
  private ProductDetailsJPA productDetailsJPA;

  @GetMapping
  public ResponseEntity<List<ProductDetailsDTO>> getAllProductDetails() {
    return ResponseEntity.ok(productDetailsService.getAllProductDetails());
  }

  @GetMapping("/{id}")
  public ResponseEntity<ProductDetailsDTO> getProductDetailsById(
    @PathVariable Integer id
  ) {
    return ResponseEntity.ok(productDetailsService.getProductDetailsById(id));
  }

  @PostMapping
  public ResponseEntity<ProductDetailsDTO> createProductDetails(
    @RequestBody ProductDetailsDTO productDetailsDto
  )
    throws IOException {
    return ResponseEntity.ok(
      productDetailsService.createProductDetails(productDetailsDto)
    );
  }

  @PutMapping("/{id}")
  public ResponseEntity<ProductDetailsDTO> updateProductDetails(
    @PathVariable Integer id,
    @RequestBody ProductDetailsDTO productDetailsDto
  )
    throws IOException {
    return ResponseEntity.ok(
      productDetailsService.updateProductDetails(id, productDetailsDto)
    );
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteProductDetails(@PathVariable Integer id) {
    productDetailsService.deleteProductDetails(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/{productId}/details")
  public List<ProductDetailsDTO> getProductDetails(
    @PathVariable Integer productId
  ) {
    return productDetailsService.getProductDetailsByProductId(productId);
  }
}
