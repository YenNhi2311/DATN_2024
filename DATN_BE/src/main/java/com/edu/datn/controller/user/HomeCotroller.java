package com.edu.datn.controller.user;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edu.datn.dto.BrandsDTO;
import com.edu.datn.dto.CapacitiesDTO;
import com.edu.datn.dto.CategoriesDTO;
import com.edu.datn.dto.ProductDTO;
import com.edu.datn.dto.ProductDetailsDTO;
import com.edu.datn.dto.ProductPromotionDTO;
import com.edu.datn.dto.ProductWithDetailsDTO;
import com.edu.datn.jpa.ProductDetailsJPA;
import com.edu.datn.service.BrandsService;
import com.edu.datn.service.CapacitiesService;
import com.edu.datn.service.CategoriesService;
import com.edu.datn.service.ProductDetailsService;
import com.edu.datn.service.ProductPromotionService;
import com.edu.datn.service.ProductService;

@RestController
@RequestMapping("/api/home")
public class HomeCotroller {
    @Autowired
    private CategoriesService categoriesService;

    @Autowired
    private CapacitiesService CapacitiesService;
    @Autowired
    private ProductPromotionService productPromotionService;

    @Autowired
    private BrandsService brandsService;

    @Autowired
    private ProductService productService;
    @Autowired
    private ProductDetailsJPA productDetailsJPA;

    @Autowired
    private ProductDetailsService productDetailsService;

    @GetMapping("/categories")
    public ResponseEntity<List<CategoriesDTO>> getAllCategories() {
        return ResponseEntity.ok(categoriesService.getAllCategories());
    }

    @GetMapping("/productpromotions")
    public ResponseEntity<List<ProductPromotionDTO>> getAllProductPromotions() {
        List<ProductPromotionDTO> productPromotions = productPromotionService.getAllProductPromotions();
        return ResponseEntity.ok(productPromotions);
    }

    @GetMapping("/productpromotions/{id}")
    public ResponseEntity<ProductPromotionDTO> getProductPromotionById(@PathVariable Integer id) {
        ProductPromotionDTO productPromotion = productPromotionService.getProductPromotionById(id);
        return ResponseEntity.ok(productPromotion);
    }

    @GetMapping("/brands")
    public ResponseEntity<List<BrandsDTO>> getAllBrands() {
        return ResponseEntity.ok(brandsService.getAllBrands());
    }

    @Autowired

    // API để lấy tất cả sản phẩm
    @GetMapping("/products")
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Integer id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    // API để lấy top 8 sản phẩm bán chạy nhất
    @GetMapping("/products/best-selling")
    public ResponseEntity<List<ProductWithDetailsDTO>> getTop8BestSellingProducts() {
        var pageable = PageRequest.of(0, 8);

        List<ProductWithDetailsDTO> topProducts = productService.getTop8BestSellingProducts(
                pageable);
        return ResponseEntity.ok(topProducts);
    }

    @GetMapping("/productdetails")
    public ResponseEntity<List<ProductDetailsDTO>> getAllProductDetails() {
        return ResponseEntity.ok(productDetailsService.getAllProductDetails());
    }

    @GetMapping("/productdetails/{productId}")
    public ResponseEntity<List<ProductDetailsDTO>> getProductDetailsByProductId(@PathVariable Integer productId) {
        List<ProductDetailsDTO> productDetails = productDetailsService.getProductDetailsByProductId(productId);
        if (productDetails.isEmpty()) {
            return ResponseEntity.noContent().build(); // Nếu không có chi tiết nào
        }
        return ResponseEntity.ok(productDetails);
    }

    @GetMapping("/capacities")
    public ResponseEntity<List<CapacitiesDTO>> getAllCapacities() {
        List<CapacitiesDTO> capacities = CapacitiesService.getAllCapacities();
        return ResponseEntity.ok(capacities);
    }

    // GET capacity by ID
    @GetMapping("/capacities/{id}")
    public ResponseEntity<CapacitiesDTO> getCapacityById(@PathVariable Integer id) {
        CapacitiesDTO capacity = CapacitiesService.getCapacityById(id);
        return capacity != null ? ResponseEntity.ok(capacity) : ResponseEntity.notFound().build();
    }
}
