package com.edu.datn.service;

import com.edu.datn.dto.ProductDetailsDTO;
import com.edu.datn.entities.*;
import com.edu.datn.jpa.*;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductDetailsService {
  @Autowired
  private ProductDetailsJPA productDetailsRepository;

  @Autowired
  private ProductJPA productRepository;

  @Autowired
  private ColorJPA colorRepository;

  @Autowired
  private SkinTypeJPA skintypeRepository;

  @Autowired
  private CapacitiesJPA capacitiesRepository;

  @Autowired
  private IngredientJPA ingredientRepository;

  @Autowired
  private BenefitsJPA benefitsRepository;

  // Lấy tất cả chi tiết sản phẩm
  public List<ProductDetailsDTO> getAllProductDetails() {
    return productDetailsRepository
      .findAll()
      .stream()
      .map(this::toDTO)
      .collect(Collectors.toList());
  }

  // Lấy chi tiết sản phẩm theo ID
  public ProductDetailsDTO getProductDetailsById(Integer id) {
    return productDetailsRepository
      .findById(id)
      .map(this::toDTO)
      .orElseThrow(() -> new RuntimeException("Product Details not found"));
  }

  // Tạo mới chi tiết sản phẩm
  public ProductDetailsDTO createProductDetails(
    ProductDetailsDTO productDetailsDto
  )
    throws IOException {
    ProductDetailsEntity entity = toEntity(productDetailsDto);
    ProductDetailsEntity savedEntity = productDetailsRepository.save(entity);
    return toDTO(savedEntity);
  }

  // Cập nhật chi tiết sản phẩm
  public ProductDetailsDTO updateProductDetails(
    Integer id,
    ProductDetailsDTO productDetailsDto
  )
    throws IOException {
    ProductDetailsEntity entity = productDetailsRepository
      .findById(id)
      .orElseThrow(() -> new RuntimeException("Product Details not found"));

    // Cập nhật các trường cần thiết
    entity.setPrice(productDetailsDto.getPrice());
    entity.setQuantity(productDetailsDto.getQuantity());
    entity.setImg(productDetailsDto.getImg());

    // Cập nhật các thuộc tính ngoại lai
    updateEntityRelations(entity, productDetailsDto);

    ProductDetailsEntity updatedEntity = productDetailsRepository.save(entity);
    return toDTO(updatedEntity);
  }

  // Xóa chi tiết sản phẩm
  public void deleteProductDetails(Integer id) {
    if (!productDetailsRepository.existsById(id)) {
      throw new RuntimeException("Product Details not found");
    }
    productDetailsRepository.deleteById(id);
  }

  // Chuyển đổi từ Entity sang DTO
  private ProductDetailsDTO toDTO(ProductDetailsEntity entity) {
    return new ProductDetailsDTO(
      entity.getProductDetailId(),
      entity.getPrice(),
      entity.getQuantity(),
      entity.getImg(),
      entity.getProduct().getProductId(),
      entity.getColor().getColorId(),
      entity.getSkintype().getSkintypeId(),
      entity.getCapacity().getCapacityId(),
      entity.getIngredient().getIngredientId(),
      entity.getBenefit().getBenefitId()
    );
  }

  // Chuyển đổi từ DTO sang Entity
  private ProductDetailsEntity toEntity(ProductDetailsDTO productDetailsDto) {
    ProductDetailsEntity entity = new ProductDetailsEntity();

    entity.setProductDetailId(productDetailsDto.getProductDetailId());
    entity.setPrice(productDetailsDto.getPrice());
    entity.setQuantity(productDetailsDto.getQuantity());
    entity.setImg(productDetailsDto.getImg());

    // Cập nhật các thuộc tính ngoại lai
    updateEntityRelations(entity, productDetailsDto);

    return entity;
  }

  // Cập nhật các thuộc tính ngoại lai (foreign relations)
  private void updateEntityRelations(
    ProductDetailsEntity entity,
    ProductDetailsDTO dto
  ) {
    ProductEntity product = productRepository
      .findById(dto.getProductId())
      .orElseThrow(() -> new RuntimeException("Product not found"));
    entity.setProduct(product);

    ColorEntity color = colorRepository
      .findById(dto.getColorId())
      .orElseThrow(() -> new RuntimeException("Color not found"));
    entity.setColor(color);

    SkintypeEntity skintype = skintypeRepository
      .findById(dto.getSkintypeId())
      .orElseThrow(() -> new RuntimeException("Skintype not found"));
    entity.setSkintype(skintype);

    CapacitiesEntity capacity = capacitiesRepository
      .findById(dto.getCapacityId())
      .orElseThrow(() -> new RuntimeException("Capacity not found"));
    entity.setCapacity(capacity);

    IngredientEntity ingredient = ingredientRepository
      .findById(dto.getIngredientId())
      .orElseThrow(() -> new RuntimeException("Ingredient not found"));
    entity.setIngredient(ingredient);

    BenefitsEntity benefit = benefitsRepository
      .findById(dto.getBenefitId())
      .orElseThrow(() -> new RuntimeException("Benefit not found"));
    entity.setBenefit(benefit);
  }

  public List<ProductDetailsDTO> getProductDetailsByProductId(
    Integer productId
  ) {
    List<ProductDetailsEntity> productDetailsList = productDetailsRepository.findByProductId(
      productId
    );
    return productDetailsList
      .stream()
      .map(this::convertToDTO)
      .collect(Collectors.toList());
  }

  private ProductDetailsDTO convertToDTO(ProductDetailsEntity entity) {
    return new ProductDetailsDTO(
      entity.getProductDetailId(),
      entity.getPrice(),
      entity.getQuantity(),
      entity.getImg(),
      entity.getProduct().getProductId(),
      entity.getColor().getColorId(),
      entity.getSkintype().getSkintypeId(),
      entity.getCapacity().getCapacityId(),
      entity.getIngredient().getIngredientId(),
      entity.getBenefit().getBenefitId()
    );
  }
}
