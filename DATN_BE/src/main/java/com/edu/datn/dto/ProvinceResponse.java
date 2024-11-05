package com.edu.datn.dto;

import java.util.List;

public class ProvinceResponse {
    private int code;
    private String message;
    private List<ProvinceDTO> data;

    // Getters và Setters
    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<ProvinceDTO> getData() {
        return data;
    }

    public void setData(List<ProvinceDTO> data) {
        this.data = data;
    }
}
