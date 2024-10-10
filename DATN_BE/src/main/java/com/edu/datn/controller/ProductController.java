package com.edu.datn.controller;

import com.edu.datn.dto.ProductDTO;
import com.edu.datn.dto.ProductWithDetailsDTO;
import com.edu.datn.service.ProductService;
import java.io.IOException;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
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
@RequestMapping("/api/products")
public class ProductController {
  @Autowired
  private ProductService productService;

  // API để lấy top 8 sản phẩm bán chạy nhất
  @GetMapping("/best-selling")
  public ResponseEntity<List<ProductWithDetailsDTO>> getTop8BestSellingProducts() {
    var pageable = PageRequest.of(0, 8);

    List<ProductWithDetailsDTO> topProducts = productService.getTop8BestSellingProducts(
      pageable
    );
    return ResponseEntity.ok(topProducts);
  }

  // API để lấy tất cả sản phẩm
  @GetMapping
  public ResponseEntity<List<ProductDTO>> getAllProducts() {
    return ResponseEntity.ok(productService.getAllProducts());
  }

  // API để lấy thông tin chi tiết sản phẩm theo ID
  @GetMapping("/{id}")
  public ResponseEntity<ProductDTO> getProductById(@PathVariable Integer id) {
    return ResponseEntity.ok(productService.getProductById(id));
  }

  // API để tạo mới sản phẩm
  @PostMapping
  public ResponseEntity<ProductDTO> createProduct(
    @RequestBody ProductDTO productDto
  )
    throws IOException {
    return ResponseEntity.ok(productService.createProduct(productDto));
  }

  // API để cập nhật sản phẩm theo ID
  @PutMapping("/{id}")
  public ResponseEntity<ProductDTO> updateProduct(
    @PathVariable Integer id,
    @RequestBody ProductDTO productDto
  )
    throws IOException {
    return ResponseEntity.ok(productService.updateProduct(id, productDto));
  }

  // API để xóa sản phẩm theo ID
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteProduct(@PathVariable Integer id) {
    productService.deleteProduct(id);
    return ResponseEntity.noContent().build();
  }
}
