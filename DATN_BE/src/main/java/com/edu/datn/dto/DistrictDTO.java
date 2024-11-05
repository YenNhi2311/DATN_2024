package com.edu.datn.dto;

import java.util.List;

public class DistrictDTO {
    private Long id;   // ID của quận
    private String name; // Tên quận
    private Long provinceId; // ID của tỉnh mà quận thuộc về

    // Constructor
    public DistrictDTO(Long id, String name, Long provinceId) {
        this.id = id;
        this.name = name;
        this.provinceId = provinceId;
    }

    // Getters và Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getProvinceId() {
        return provinceId;
    }

    public void setProvinceId(Long provinceId) {
        this.provinceId = provinceId;
    }
}


