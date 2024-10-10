package com.edu.datn.service;

import com.edu.datn.dto.ColorDTO;
import com.edu.datn.entities.ColorEntity;
import com.edu.datn.jpa.ColorJPA;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ColorService {
    @Autowired
    private ColorJPA colorRepository;

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
