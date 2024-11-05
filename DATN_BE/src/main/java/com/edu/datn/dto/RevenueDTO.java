package com.edu.datn.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RevenueDTO {
  private String period; // Ngày, tháng hoặc năm
  private Double totalRevenue; // Tổng doanh thu
}
