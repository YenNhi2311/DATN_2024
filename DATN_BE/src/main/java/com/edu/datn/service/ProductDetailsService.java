package com.edu.datn.service;

import com.edu.datn.dto.ProductDetailsDTO;
import com.edu.datn.entities.BenefitsEntity;
import com.edu.datn.entities.CapacitiesEntity;
import com.edu.datn.entities.ColorEntity;
import com.edu.datn.entities.IngredientEntity;
import com.edu.datn.entities.ProductDetailsEntity;
import com.edu.datn.entities.ProductEntity;
import com.edu.datn.entities.SkintypeEntity;
import com.edu.datn.jpa.BenefitsJPA;
import com.edu.datn.jpa.CapacitiesJPA;
import com.edu.datn.jpa.ColorJPA;
import com.edu.datn.jpa.IngredientJPA;
import com.edu.datn.jpa.ProductDetailsJPA;
import com.edu.datn.jpa.ProductJPA;
import com.edu.datn.jpa.SkinTypeJPA;
import com.edu.datn.utils.ImageUtils;
import jakarta.persistence.EntityNotFoundException;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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

    public ProductDetailsEntity findById(int productDetailId) {
        return productDetailsRepository.findById(productDetailId)
                .orElseThrow(() -> new EntityNotFoundException("Product detail not found with id: " + productDetailId));
    }

    public List<ProductDetailsDTO> getAllProductDetails() {
        return productDetailsRepository
                .findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ProductDetailsDTO getProductDetailsById(Integer id) {
        return productDetailsRepository
                .findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Product Details not found"));
    }

    public ProductDetailsDTO createProductDetails(ProductDetailsDTO productDetailsDto, MultipartFile img)
            throws IOException {
        if (img != null && !img.isEmpty()) {
            String imageName = ImageUtils.saveImage(img);
            productDetailsDto.setImg(imageName);
        }

        ProductDetailsEntity entity = toEntity(productDetailsDto);
        ProductDetailsEntity savedEntity = productDetailsRepository.save(entity);
        return toDTO(savedEntity);
    }

    public ProductDetailsDTO updateProductDetails(Integer id, ProductDetailsDTO productDetailsDto, MultipartFile img)
            throws IOException {
        ProductDetailsEntity entity = productDetailsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product Details not found"));

        entity.setPrice(productDetailsDto.getPrice());
        entity.setQuantity(productDetailsDto.getQuantity());

        if (img != null && !img.isEmpty()) {
            if (entity.getImg() != null) {
                ImageUtils.deleteImage(entity.getImg()); // Xóa hình ảnh cũ
            }
            String newImageName = ImageUtils.saveImage(img);
            entity.setImg(newImageName);
        } else {
            // Giữ lại hình ảnh cũ nếu không có hình ảnh mới
            productDetailsDto.setImg(entity.getImg());
        }
        
        updateEntityRelations(entity, productDetailsDto);

        ProductDetailsEntity updatedEntity = productDetailsRepository.save(entity);
        return toDTO(updatedEntity);
    }

    public void deleteProductDetails(Integer id) {
        if (!productDetailsRepository.existsById(id)) {
            throw new RuntimeException("Product Details not found");
        }
        productDetailsRepository.deleteById(id);
    }

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
                entity.getBenefit().getBenefitId());
    }

    private ProductDetailsEntity toEntity(ProductDetailsDTO productDetailsDto) {
        ProductDetailsEntity entity = new ProductDetailsEntity();

        entity.setProductDetailId(productDetailsDto.getProductDetailId());
        entity.setPrice(productDetailsDto.getPrice());
        entity.setQuantity(productDetailsDto.getQuantity());
        entity.setImg(productDetailsDto.getImg());

        updateEntityRelations(entity, productDetailsDto);
        return entity;
    }

    private void updateEntityRelations(
            ProductDetailsEntity entity,
            ProductDetailsDTO dto) {
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
            Integer productId) {
        List<ProductDetailsEntity> productDetailsList = productDetailsRepository.findByProductId(
                productId);
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
                entity.getBenefit().getBenefitId());
    }
}
