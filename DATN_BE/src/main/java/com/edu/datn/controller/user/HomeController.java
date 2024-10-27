package com.edu.datn.controller.user;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.edu.datn.dto.BrandsDTO;
import com.edu.datn.dto.CapacitiesDTO;
import com.edu.datn.dto.CategoriesDTO;
import com.edu.datn.dto.IngredientDTO;
import com.edu.datn.dto.ProductDTO;
import com.edu.datn.dto.ProductDetailsDTO;
import com.edu.datn.dto.ProductPromotionDTO;
import com.edu.datn.dto.ProductWithDetailsDTO;
import com.edu.datn.entities.BenefitsEntity;
import com.edu.datn.entities.PromotionEntity;
import com.edu.datn.entities.SkintypeEntity;
import com.edu.datn.jpa.ProductDetailsJPA;
import com.edu.datn.service.BenefitsService;
import com.edu.datn.service.BrandsService;
import com.edu.datn.service.CapacitiesService;
import com.edu.datn.service.CategoriesService;
import com.edu.datn.service.IngredientService;
import com.edu.datn.service.ProductDetailsService;
import com.edu.datn.service.ProductPromotionService;
import com.edu.datn.service.ProductService;
import com.edu.datn.service.PromotionService;
import com.edu.datn.service.SkinTypeService;

@RestController
@RequestMapping("/api/home")
public class HomeController {

    @Autowired
    private CategoriesService categoriesService;

    @Autowired
    private CapacitiesService capacitiesService;

    @Autowired
    private ProductPromotionService productPromotionService;

    @Autowired
    private BrandsService brandsService;

    @Autowired
    private ProductService productService;

    @Autowired
    private SkinTypeService skinTypeService;

    @Autowired
    private ProductDetailsJPA productDetailsJPA;

    @Autowired
    private ProductDetailsService productDetailsService;

    @Autowired
    private BenefitsService benefitsService;

    @Autowired
    private IngredientService ingredientService;

    @Autowired
    private PromotionService promotionService;

    // API lấy tất cả danh mục sản phẩm
    @GetMapping("/categories")
    public ResponseEntity<List<CategoriesDTO>> getAllCategories() {
        return ResponseEntity.ok(categoriesService.getAllCategories());
    }

    // API lấy danh mục theo ID sử dụng query parameter
    @GetMapping("/category")
    public ResponseEntity<CategoriesDTO> getCategoryById(@RequestParam Integer id) {
        return ResponseEntity.ok(categoriesService.getCategoryById(id));
    }

    // API lấy tất cả khuyến mãi sản phẩm
    @GetMapping("/productpromotions")
    public ResponseEntity<List<ProductPromotionDTO>> getAllProductPromotions() {
        return ResponseEntity.ok(productPromotionService.getAllProductPromotions());
    }

    // API lấy khuyến mãi sản phẩm theo ID (sử dụng query parameter)
    @GetMapping("/productpromotion")
    public ResponseEntity<ProductPromotionDTO> getProductPromotionById(@RequestParam Integer id) {
        return ResponseEntity.ok(productPromotionService.getProductPromotionById(id));
    }

    // API lấy tất cả thương hiệu
    @GetMapping("/brands")
    public ResponseEntity<List<BrandsDTO>> getAllBrands() {
        return ResponseEntity.ok(brandsService.getAllBrands());
    }

    // API lấy thương hiệu theo ID (sử dụng query parameter)
    @GetMapping("/brand")
    public ResponseEntity<BrandsDTO> getBrandById(@RequestParam Integer id) {
        BrandsDTO brand = brandsService.getBrandById(id);

        if (brand != null) {
            return ResponseEntity.ok(brand);
        } else {
            return ResponseEntity.notFound().build(); // Trả về 404 nếu không tìm thấy thương hiệu
        }
    }

    // API lấy tất cả sản phẩm
    @GetMapping("/products")
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    // API lấy sản phẩm theo ID (sử dụng query parameter)
    @GetMapping("/product")
    public ResponseEntity<ProductDTO> getProductById(@RequestParam Integer id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    // API lấy top 8 sản phẩm bán chạy nhất
    @GetMapping("/products/best-selling")
    public ResponseEntity<List<ProductWithDetailsDTO>> getTop8BestSellingProducts() {
        var pageable = PageRequest.of(0, 8);
        List<ProductWithDetailsDTO> topProducts = productService.getTop8BestSellingProducts(pageable);
        return ResponseEntity.ok(topProducts);
    }

    // API lấy tất cả chi tiết sản phẩm
    @GetMapping("/productdetails")
    public ResponseEntity<List<ProductDetailsDTO>> getAllProductDetails() {
        return ResponseEntity.ok(productDetailsService.getAllProductDetails());
    }

    // API lấy chi tiết sản phẩm theo Product ID (sử dụng query parameter)
    @GetMapping("/productdetail")
    public ResponseEntity<List<ProductDetailsDTO>> getProductDetailsByProductId(@RequestParam Integer productId) {
        List<ProductDetailsDTO> productDetails = productDetailsService.getProductDetailsByProductId(productId);
        return ResponseEntity.ok(productDetails);
    }

    // API lấy tất cả dung tích sản phẩm
    @GetMapping("/capacities")
    public ResponseEntity<List<CapacitiesDTO>> getAllCapacities() {
        List<CapacitiesDTO> capacities = capacitiesService.getAllCapacities();
        return ResponseEntity.ok(capacities);
    }

    // API lấy dung tích theo ID (sử dụng query parameter)
    @GetMapping("/capacity")
    public ResponseEntity<CapacitiesDTO> getCapacityById(@RequestParam Integer id) {
        CapacitiesDTO capacity = capacitiesService.getCapacityById(id);
        return capacity != null ? ResponseEntity.ok(capacity) : ResponseEntity.notFound().build();
    }

    // API lấy tất cả loại da
    @GetMapping("/skintypes")
    public ResponseEntity<List<SkintypeEntity>> getAllSkintypes() {
        List<SkintypeEntity> skintypes = skinTypeService.getAllSkintypes();
        return ResponseEntity.ok(skintypes);
    }

    // API lấy loại da theo ID (sử dụng query parameter)
    @GetMapping("/skintype")
    public ResponseEntity<SkintypeEntity> getSkintypeById(@RequestParam Integer id) {
        return skinTypeService.getSkintypeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // API lấy tất cả lợi ích
    @GetMapping("/benefits")
    public ResponseEntity<List<BenefitsEntity>> getAllBenefits() {
        List<BenefitsEntity> benefits = benefitsService.getAllBenefits();
        return ResponseEntity.ok(benefits);
    }

    // API lấy lợi ích theo ID (sử dụng query parameter)
    @GetMapping("/benefit")
    public ResponseEntity<BenefitsEntity> getBenefitById(@RequestParam Integer id) {
        return benefitsService
                .getBenefitById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // API lấy tất cả thành phần
    @GetMapping("/ingredients")
    public ResponseEntity<List<IngredientDTO>> getAllIngredients() {
        List<IngredientDTO> ingredients = ingredientService.getAllIngredients();
        return ResponseEntity.ok(ingredients);
    }

    // API lấy thành phần theo ID (sử dụng query parameter)
    @GetMapping("/ingredient")
    public ResponseEntity<IngredientDTO> getIngredientById(@RequestParam Integer id) {
        IngredientDTO ingredient = ingredientService.getIngredientById(id);
        return ingredient != null ? ResponseEntity.ok(ingredient) : ResponseEntity.notFound().build();
    }

    // API lấy tất cả khuyến mãi
    @GetMapping("/promotions")
    public List<PromotionEntity> getAllPromotions() {
        return promotionService.getAllPromotions();
    }

    // API lấy khuyến mãi theo ID (sử dụng query parameter)
    @GetMapping("/promotion")
    public Optional<PromotionEntity> getPromotionById(@RequestParam Integer id) {
        return promotionService.getPromotionById(id);
    }
}