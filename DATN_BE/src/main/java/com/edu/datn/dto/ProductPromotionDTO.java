package com.edu.datn.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductPromotionDTO {
    private Integer productPromotionId;
    private Integer productId;
    private Integer promotionId;
}
