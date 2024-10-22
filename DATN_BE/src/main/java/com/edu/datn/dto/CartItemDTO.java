package com.edu.datn.dto;

import java.time.LocalDateTime;

import com.edu.datn.entities.ProductDetailsEntity;
import com.edu.datn.entities.ProductPromotionEntity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CartItemDTO {
    private Integer cartItemId;
    private Integer quantity;
    private Double originalPrice;// giá niêm yết
    private Double discountedPrice; // Giá đã khuyến mãi
    private ProductDetailsEntity productDetail; // Thông tin sản phẩm
    private ProductPromotionEntity productPromotion;
    private Double discountPercent;
    private LocalDateTime endDate;// ngày kết thúc khuyến mãi
    private LocalDateTime startDate;// ngày bắt đầu khuyến mãi
}
