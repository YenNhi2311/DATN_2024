package com.edu.datn.dto;

import java.util.List;

import com.edu.datn.entities.ProductDetailsEntity;
import com.edu.datn.entities.PromotionEntity;

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
    private ProductDetailsEntity productDetail; // Thông tin sản phẩm
    private List<PromotionEntity> promotions;
    private double DiscountedPrice;

}
