package com.edu.datn.dto;

import java.util.List;

import com.edu.datn.entities.PromotionEntity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductWithDetailsDTO {
    private ProductDTO product;
    private ProductDetailsDTO productDetails;
    private List<PromotionEntity> promotions;
    private double DiscountedPrice;
    private Integer totalSold;
}
