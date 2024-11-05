package com.edu.datn.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List; // Nếu bạn đang sử dụng List
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.edu.datn.dto.ProductDTO;
import com.edu.datn.dto.ProductDetailsDTO;
import com.edu.datn.dto.ProductWithDetailsDTO;
import com.edu.datn.entities.BrandsEntity;
import com.edu.datn.entities.CategoriesEntity;
import com.edu.datn.entities.ProductDetailsEntity;
import com.edu.datn.entities.ProductEntity;
import com.edu.datn.entities.PromotionEntity;
import com.edu.datn.jpa.BrandJPA;
import com.edu.datn.jpa.CategoriesJPA;
import com.edu.datn.jpa.ProductJPA;
import com.edu.datn.jpa.ProductPromotionJPA;
import com.edu.datn.jpa.PromotionJPA;

@Service
public class ProductService {

    @Autowired
    private ProductJPA productRepository;

    @Autowired
    private BrandJPA brandRepository;

    @Autowired
    private CategoriesJPA categoryRepository;

    @Autowired
    private ProductPromotionJPA productPromotionRepository;
    @Autowired
    private ProductService productService;
    @Autowired
    private PromotionJPA promotionRepository;

    // Phương thức lấy khuyến mãi từ productpromotion
    public List<PromotionEntity> getPromotionsForProduct(Integer productId) {
        return productPromotionRepository.findPromotionsByProductId(productId);
    }

    public List<ProductWithDetailsDTO> getTop8BestSellingProducts(Pageable pageable) {
        List<Object[]> results = productRepository.findTop8BestSellingProducts(pageable);
        List<ProductWithDetailsDTO> topProducts = new ArrayList<>();

        for (Object[] result : results) {
            ProductEntity product = (ProductEntity) result[0];
            ProductDetailsEntity productDetail = (ProductDetailsEntity) result[1];
            Integer totalSold = ((Long) result[2]).intValue();

            // Tạo ProductDTO
            ProductDTO productDTO = new ProductDTO();
            productDTO.setProductId(product.getProductId());
            productDTO.setName(product.getName());
            productDTO.setDescription(product.getDescription());
            productDTO.setCategoryId(product.getCategory().getCategoryId());
            productDTO.setBrandId(product.getBrand().getBrandId());

            // Tạo ProductDetailsDTO
            ProductDetailsDTO detailsDTO = new ProductDetailsDTO();
            detailsDTO.setProductDetailId(productDetail.getProductDetailId());
            detailsDTO.setPrice(productDetail.getPrice());
            detailsDTO.setQuantity(productDetail.getQuantity());
            detailsDTO.setImg(productDetail.getImg());
            detailsDTO.setProductId(productDetail.getProduct().getProductId());
            detailsDTO.setColorId(productDetail.getColor().getColorId());
            detailsDTO.setSkintypeId(productDetail.getSkintype().getSkintypeId());
            detailsDTO.setCapacityId(productDetail.getCapacity().getCapacityId());
            detailsDTO.setIngredientId(productDetail.getIngredient().getIngredientId());
            detailsDTO.setBenefitId(productDetail.getBenefit().getBenefitId());

            // Lấy danh sách khuyến mãi
            List<PromotionEntity> promotions = getPromotionsForProduct(productDetail.getProductDetailId());

            // Tính giá sau giảm
            double discountedPrice = calculateDiscountedPrice(productDetail.getPrice(), promotions);

            // Tạo ProductWithDetailsDTO
            ProductWithDetailsDTO combinedDTO = new ProductWithDetailsDTO(productDTO, detailsDTO, promotions,
                    discountedPrice, totalSold);
            topProducts.add(combinedDTO);
        }

        return topProducts;
    }

    // Phương thức tính toán giá đã giảm
    private double calculateDiscountedPrice(double originalPrice, List<PromotionEntity> promotions) {
        double discountedPrice = originalPrice;

        for (PromotionEntity promotion : promotions) {
            if (promotion.getEndDate().isAfter(LocalDateTime.now())) {
                // Tính toán giá đã giảm với khuyến mãi hiệu lực
                double discount = (originalPrice * promotion.getPercent()) / 100;
                discountedPrice -= discount; // Áp dụng giảm giá
                break; // Dừng lại nếu đã tìm thấy khuyến mãi hiệu lực
            }
        }

        return discountedPrice;
    }

    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ProductDTO getProductById(Integer id) {
        return toDTO(productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found")));
    }

    public ProductDTO createProduct(ProductDTO productDto) throws IOException {
        ProductEntity entity = toEntity(productDto);
        ProductEntity savedEntity = productRepository.save(entity);
        return toDTO(savedEntity);
    }

    public ProductDTO updateProduct(Integer id, ProductDTO productDto) throws IOException {
        ProductEntity entity = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        entity.setName(productDto.getName());
        entity.setDescription(productDto.getDescription());
        // Set các thuộc tính khác nếu cần
        ProductEntity updatedEntity = productRepository.save(entity);
        return toDTO(updatedEntity);
    }

    public void deleteProduct(Integer id) {
        productRepository.deleteById(id);
    }

    private ProductDTO toDTO(ProductEntity entity) {
        return new ProductDTO(
                entity.getProductId(),
                entity.getName(),
                entity.getDescription(),
                entity.getCategory() != null ? entity.getCategory().getCategoryId() : null,
                entity.getBrand() != null ? entity.getBrand().getBrandId() : null);
    }

    private ProductEntity toEntity(ProductDTO productDto) {
        ProductEntity entity = new ProductEntity();
        entity.setProductId(productDto.getProductId());
        entity.setName(productDto.getName());
        entity.setDescription(productDto.getDescription());

        // Retrieve and set the category
        CategoriesEntity category = categoryRepository.findById(productDto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        entity.setCategory(category);

        // Retrieve and set the brand
        BrandsEntity brand = brandRepository.findById(productDto.getBrandId())
                .orElseThrow(() -> new RuntimeException("Brand not found"));
        entity.setBrand(brand);

        return entity;
    }
}
