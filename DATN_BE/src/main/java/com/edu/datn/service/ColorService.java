package com.edu.datn.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edu.datn.dto.ColorDTO;
import com.edu.datn.entities.ColorEntity;
import com.edu.datn.entities.ProductDetailsEntity;
import com.edu.datn.jpa.ColorJPA;
import com.edu.datn.jpa.ProductDetailsJPA;

@Service
public class ColorService {
    @Autowired
    private ColorJPA colorRepository;
    @Autowired
    private ProductDetailsJPA productDetailsRepository;

    // phi Phương thức lấy màu sắc theo productId
    public List<ColorDTO> getColorsByProductId(Integer productId) {
        List<ProductDetailsEntity> productDetails = productDetailsRepository.findByProductId(productId);
        return productDetails.stream()
                .map(productDetail -> productDetail.getColor()) // Giả sử bạn có phương thức getColor() trong
                                                                // ProductDetailsEntity
                .distinct() // Để loại bỏ màu sắc trùng lặp
                .map(this::convertToColorDTO)
                .collect(Collectors.toList());
    }

    private ColorDTO convertToColorDTO(ColorEntity color) {
        ColorDTO dto = new ColorDTO();
        dto.setColorId(color.getColorId());
        dto.setName(color.getName()); // Giả sử bạn có thuộc tính name trong ColorsEntity
        return dto;
    }

    public List<ColorEntity> getAllColors() {
        return colorRepository.findAll();
    }

    public ColorEntity getColorById(Integer id) {
        return colorRepository.findById(id).orElseThrow(() -> new RuntimeException("Color not found"));
    }

    public ColorEntity addColor(ColorDTO colorDto) {
        ColorEntity color = new ColorEntity();
        color.setName(colorDto.getName());
        return colorRepository.save(color);
    }

    public ColorEntity updateColor(Integer id, ColorDTO colorDto) throws Exception {
        Optional<ColorEntity> colorOptional = colorRepository.findById(id);
        if (colorOptional.isPresent()) {
            ColorEntity color = colorOptional.get();
            color.setName(colorDto.getName());
            return colorRepository.save(color);
        } else {
            throw new Exception("Color not found");
        }
    }

    public void deleteColor(Integer id) throws Exception {
        Optional<ColorEntity> colorOptional = colorRepository.findById(id);
        if (colorOptional.isPresent()) {
            colorRepository.deleteById(id);
        } else {
            throw new Exception("Color not found");
        }
    }
}
