package com.edu.datn.dto;

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
    private Integer totalSold;
}
