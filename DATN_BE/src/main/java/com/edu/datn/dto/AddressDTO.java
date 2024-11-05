package com.edu.datn.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@NoArgsConstructor
@AllArgsConstructor
@Data // sử dụng Lombok để tự động tạo getter, setter
public class AddressDTO {
    private boolean status;
    private String specificAddress;
    private Long province; // Id tỉnh
    private String provinceName; // tên tỉnh
    private Long district; // Id quận
    private String districtName; // tên quận
    private Long ward; // Id phường
    private String wardName; // tên phường
    private String name;
    private String phone;
    private Integer id; //id address
    private Integer userId; // Thêm thuộc tính userId
}


