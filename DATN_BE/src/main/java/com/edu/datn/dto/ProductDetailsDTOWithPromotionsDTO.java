
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
public class ProductDetailsDTOWithPromotionsDTO {
    private ProductDetailsDTO productDetail;
    private List<PromotionEntity> promotions;
    private double DiscountedPrice;
}