package com.edu.datn.dto;


import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
public class UpdateDefaultAddressRequest {
    private Integer selectedAddressId;

    // Getters and Setters
    public Integer getSelectedAddressId() {
        return selectedAddressId;
    }

    public void setSelectedAddressId(Integer selectedAddressId) {
        this.selectedAddressId = selectedAddressId;
    }
}
