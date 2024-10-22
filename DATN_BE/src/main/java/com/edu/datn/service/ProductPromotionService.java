package com.edu.datn.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edu.datn.dto.ProductPromotionDTO;
import com.edu.datn.entities.ProductPromotionEntity;
import com.edu.datn.jpa.ProductJPA;
import com.edu.datn.jpa.ProductPromotionJPA;
import com.edu.datn.jpa.PromotionJPA;

@Service
public class ProductPromotionService {

    @Autowired
    private ProductPromotionJPA productPromotionRepository;

    @Autowired
    private ProductJPA productRepository;

    @Autowired
    private PromotionJPA promotionRepository;

    public ProductPromotionEntity getProductPromotionById(int productPromotionId) {
        // Sử dụng repository để tìm khuyến mãi
        Optional<ProductPromotionEntity> promotion = productPromotionRepository.findById(productPromotionId);
        return promotion.orElse(null); // Trả về khuyến mãi nếu có, ngược lại trả về null
    }

    // Chuyển từ ProductPromotionEntity sang ProductPromotionDTO
    private ProductPromotionDTO convertToDTO(ProductPromotionEntity entity) {
        ProductPromotionDTO dto = new ProductPromotionDTO();
        dto.setProductPromotionId(entity.getProductPromotionId());
        dto.setProductId(entity.getProduct().getProductId());
        dto.setPromotionId(entity.getPromotion().getPromotionId());
        return dto;
    }

    // Chuyển từ ProductPromotionDTO sang ProductPromotionEntity
    private ProductPromotionEntity convertToEntity(ProductPromotionDTO dto) {
        ProductPromotionEntity entity = new ProductPromotionEntity();
        entity.setProductPromotionId(dto.getProductPromotionId());
        entity.setProduct(productRepository.findById(dto.getProductId()).orElse(null));
        entity.setPromotion(promotionRepository.findById(dto.getPromotionId()).orElse(null));
        return entity;
    }

    // Lấy danh sách tất cả product promotion
    public List<ProductPromotionDTO> getAllProductPromotions() {
        return productPromotionRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    // Lấy thông tin chi tiết product promotion theo ID
    public ProductPromotionDTO getProductPromotionById(Integer productpromotionId) {
        Optional<ProductPromotionEntity> productPromotion = productPromotionRepository.findById(productpromotionId);
        return productPromotion.map(this::convertToDTO).orElse(null);
    }

    // Tạo mới product promotion
    public ProductPromotionDTO createProductPromotion(ProductPromotionDTO dto) {
        ProductPromotionEntity entity = convertToEntity(dto);
        ProductPromotionEntity savedEntity = productPromotionRepository.save(entity);
        return convertToDTO(savedEntity);
    }

    // Cập nhật product promotion theo ID
    public ProductPromotionDTO updateProductPromotion(Integer id, ProductPromotionDTO dto) {
        if (productPromotionRepository.existsById(id)) {
            ProductPromotionEntity entity = convertToEntity(dto);
            entity.setProductPromotionId(id);
            ProductPromotionEntity updatedEntity = productPromotionRepository.save(entity);
            return convertToDTO(updatedEntity);
        } else {
            return null; // Nếu không tìm thấy product promotion để cập nhật
        }
    }

    // Xóa product promotion theo ID
    public void deleteProductPromotion(Integer id) {
        productPromotionRepository.deleteById(id);
    }
}
