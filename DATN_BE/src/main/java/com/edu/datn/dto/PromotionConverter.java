package com.edu.datn.dto;

import com.edu.datn.entities.ProductPromotionEntity;

public class PromotionConverter {
    public ProductPromotionDTO convertToDTO(ProductPromotionEntity entity) {
        if (entity == null) {
            return null;
        }
        // Lấy thông tin từ ProductEntity và PromotionEntity
        Integer productId = (entity.getProduct() != null) ? entity.getProduct().getProductId() : null;
        Integer promotionId = (entity.getPromotion() != null) ? entity.getPromotion().getPromotionId() : null;

        return new ProductPromotionDTO(
                entity.getProductPromotionId(),
                productId, // Gán productId từ ProductEntity
                promotionId // Gán promotionId từ PromotionEntity
        );
    }
}
