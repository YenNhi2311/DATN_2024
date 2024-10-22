package com.edu.datn.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Double total;
    private Double shippingFee;
    private String specificAddress;
    private String wardCommune;
    private String district;
    private String province;
    private Byte status;
    private String payDate; // Ngày thanh toán có thể là null hoặc không
    private List<OrderDetailDTO> orderDetails; // Danh sách chi tiết đơn hàng

    // Getters và Setters
}
