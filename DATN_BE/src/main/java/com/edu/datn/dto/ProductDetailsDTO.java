package com.edu.datn.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetailsDTO {
    private Integer productDetailId;
    private Double price;
    private Integer quantity;
    private String img;
    private Integer productId;
    private Integer colorId;
    private Integer skintypeId;
    private Integer capacityId;
    private Integer ingredientId;
    private Integer benefitId;

}
