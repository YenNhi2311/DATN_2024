package com.edu.datn.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BrandsDTO {
    private Integer brandId;
    private String name;
    private String place;
    private String img;
}
