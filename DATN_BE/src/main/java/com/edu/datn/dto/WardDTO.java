package com.edu.datn.dto;

public class WardDTO {
    private Long id;   // ID của phường
    private String name; // Tên phường
    private Long districtId; // ID của quận mà phường thuộc về

    // Constructor
    public WardDTO(Long id, String name, Long districtId) {
        this.id = id;
        this.name = name;
        this.districtId = districtId;
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

    public Long getDistrictId() {
        return districtId;
    }

    public void setDistrictId(Long districtId) {
        this.districtId = districtId;
    }
}

