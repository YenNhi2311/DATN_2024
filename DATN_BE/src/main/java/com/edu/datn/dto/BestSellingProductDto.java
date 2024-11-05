package com.edu.datn.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BestSellingProductDto {
  private String productName; // Tên sản phẩm
  private Integer quantitySold; // Số lượng bán
  private Double revenue; // Doanh thu
}
