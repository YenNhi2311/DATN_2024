package com.edu.datn.controller.user;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.edu.datn.dto.BenefitsDTO;
import com.edu.datn.dto.BrandsDTO;
import com.edu.datn.dto.CapacitiesDTO;
import com.edu.datn.dto.CategoriesDTO;
import com.edu.datn.dto.ColorDTO;
import com.edu.datn.dto.IngredientDTO;
import com.edu.datn.dto.ProductDTO;
import com.edu.datn.dto.ProductDetailsDTO;
import com.edu.datn.dto.ProductDetailsDTOWithPromotionsDTO;
import com.edu.datn.dto.ProductPromotionDTO;
import com.edu.datn.dto.ProductWithDetailsDTO;
import com.edu.datn.dto.SkinTypeDTO;
import com.edu.datn.entities.BenefitsEntity;
import com.edu.datn.entities.ColorEntity;
import com.edu.datn.entities.PromotionEntity;
import com.edu.datn.entities.SkintypeEntity;
import com.edu.datn.jpa.ProductDetailsJPA;
import com.edu.datn.service.BenefitsService;
import com.edu.datn.service.BrandsService;
import com.edu.datn.service.CapacitiesService;
import com.edu.datn.service.CategoriesService;
import com.edu.datn.service.ColorService;
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
    private ColorService colorsService;

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

    // API lấy top 8 sản phẩm bán chạy nhất
    @GetMapping("/products/best-selling")
    public ResponseEntity<List<ProductWithDetailsDTO>> getTop8BestSellingProducts() {
        var pageable = PageRequest.of(0, 8);
        List<ProductWithDetailsDTO> topProducts = productService.getTop8BestSellingProducts(pageable);
        return ResponseEntity.ok(topProducts);
    }

    @GetMapping("/products")
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    // API lấy sản phẩm theo ID (sử dụng query parameter)
    @GetMapping("/product")
    public ResponseEntity<ProductDTO> getProductById(@RequestParam Integer id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/productdetails")
    public ResponseEntity<List<ProductDetailsDTOWithPromotionsDTO>> getAllProductDetails() {
        List<ProductDetailsDTO> productDetails = productDetailsService.getAllProductDetails();
        List<ProductDetailsDTOWithPromotionsDTO> response = new ArrayList<>();

        for (ProductDetailsDTO productDetail : productDetails) {
            List<PromotionEntity> promotions = productService.getPromotionsForProduct(productDetail.getProductId());

            ProductDetailsDTOWithPromotionsDTO productWithPromotions = new ProductDetailsDTOWithPromotionsDTO();
            productWithPromotions.setProductDetail(productDetail);
            productWithPromotions.setPromotions(promotions);
            response.add(productWithPromotions); // Thêm sản phẩm với khuyến mãi vào danh sách phản hồi
        }

        return ResponseEntity.ok(response); // Trả về danh sách sản phẩm với khuyến mãi
    }

    @GetMapping("/productdetail")
    public ResponseEntity<List<ProductDetailsDTOWithPromotionsDTO>> getProductDetailsByProductId(
            @RequestParam Integer productId) {
        // Lấy danh sách chi tiết sản phẩm theo productId
        List<ProductDetailsDTO> productDetails = productDetailsService.getProductDetailsByProductId(productId);
        List<ProductDetailsDTOWithPromotionsDTO> response = new ArrayList<>();

        // Lặp qua từng chi tiết sản phẩm để lấy thông tin khuyến mãi
        for (ProductDetailsDTO productDetail : productDetails) {
            List<PromotionEntity> promotions = productService.getPromotionsForProduct(productDetail.getProductId());

            // Tính toán giá đã giảm
            double discountedPrice = calculateDiscountedPrice(productDetail.getPrice(), promotions);

            // Tạo đối tượng chứa thông tin chi tiết sản phẩm và khuyến mãi
            ProductDetailsDTOWithPromotionsDTO productWithPromotions = new ProductDetailsDTOWithPromotionsDTO();
            productWithPromotions.setProductDetail(productDetail);
            productWithPromotions.setPromotions(promotions);
            productWithPromotions.setDiscountedPrice(discountedPrice); // Thêm giá đã giảm vào đối tượng

            // Thêm vào danh sách phản hồi
            response.add(productWithPromotions);
        }

        // Trả về danh sách sản phẩm với khuyến mãi
        return ResponseEntity.ok(response);
    }

    // Phương thức tính toán giá đã giảm
    private double calculateDiscountedPrice(double originalPrice, List<PromotionEntity> promotions) {
        double discountedPrice = originalPrice; // Bắt đầu với giá gốc

        for (PromotionEntity promotion : promotions) {
            if (promotion.getEndDate().isAfter(LocalDateTime.now())) {
                // Tính toán giá đã giảm
                double discount = (originalPrice * promotion.getPercent()) / 100;
                discountedPrice = originalPrice - discount;
                return discountedPrice; // Nếu tìm thấy khuyến mãi hiệu lực, trả về giá đã giảm
            }
        }

        // Nếu không có khuyến mãi hiệu lực, giá vẫn là giá gốc
        return originalPrice; // Trả về giá gốc khi không có khuyến mãi
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

    // API lấy dung tích theo productId
    @GetMapping("/capacityProduct")
    public ResponseEntity<List<CapacitiesDTO>> getCapacitiesByProductId(@RequestParam Integer productId) {
        List<CapacitiesDTO> capacities = capacitiesService.getCapacitiesByProductId(productId);
        return ResponseEntity.ok(capacities);
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

    // API lấy loại da theo productId (sử dụng query parameter)
    @GetMapping("/skintypeByProductId")
    public ResponseEntity<List<SkinTypeDTO>> getSkintypeByProductId(@RequestParam Integer productId) {
        List<SkinTypeDTO> skintypes = skinTypeService.getSkintypeByProductId(productId);
        return ResponseEntity.ok(skintypes);
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

    // API lấy lợi ích theo productId (sử dụng query parameter)
    @GetMapping("/benefitsByProductId")
    public ResponseEntity<List<BenefitsDTO>> getBenefitsByProductId(@RequestParam Integer productId) {
        List<BenefitsDTO> benefits = benefitsService.getBenefitsByProductId(productId);
        return ResponseEntity.ok(benefits);
    }

    // API lấy tất cả màu sắc sản phẩm
    @GetMapping("/colors")
    public ResponseEntity<List<ColorEntity>> getAllColors() {
        List<ColorEntity> colors = colorsService.getAllColors();
        return ResponseEntity.ok(colors);
    }

    // API lấy màu sắc theo ID (sử dụng query parameter)
    @GetMapping("/color")
    public ResponseEntity<ColorEntity> getColorById(@RequestParam Integer id) {
        ColorEntity color = colorsService.getColorById(id);
        return color != null ? ResponseEntity.ok(color) : ResponseEntity.notFound().build();
    }

    // API lấy màu sắc theo productId
    @GetMapping("/colorProduct")
    public ResponseEntity<List<ColorDTO>> getColorsByProductId(@RequestParam Integer productId) {
        List<ColorDTO> colors = colorsService.getColorsByProductId(productId);
        return ResponseEntity.ok(colors);
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