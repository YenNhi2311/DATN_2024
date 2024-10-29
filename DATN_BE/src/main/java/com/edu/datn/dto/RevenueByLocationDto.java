package com.edu.datn.dto;

public class RevenueByLocationDto {
  private String province;
  private Double revenue;

  public RevenueByLocationDto(String province, Double revenue) {
    this.province = province;
    this.revenue = revenue;
  }

  // Getter và Setter
  public String getProvince() {
    return province;
  }

  public void setProvince(String province) {
    this.province = province;
  }

  public Double getRevenue() {
    return revenue;
  }

  public void setRevenue(Double revenue) {
    this.revenue = revenue;
  }
}
