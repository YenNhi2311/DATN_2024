package com.edu.datn.service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.edu.datn.dto.CategoriesDTO;
import com.edu.datn.entities.CategoriesEntity;
import com.edu.datn.jpa.CategoriesJPA;
import com.edu.datn.utils.ImageUtils;

@Service
public class CategoriesService {

    @Autowired
    private CategoriesJPA categoriesRepository;

    public List<CategoriesDTO> getAllCategories() {
        return categoriesRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public CategoriesDTO getCategoryById(Integer id) {
        return toDTO(categoriesRepository.findById(id).orElseThrow(() -> new RuntimeException("Category not found")));
    }

    public CategoriesDTO createCategory(String name, MultipartFile img) throws IOException {
        CategoriesEntity entity = new CategoriesEntity();
        entity.setName(name);
        if (img != null && !img.isEmpty()) {
            String imagePath = ImageUtils.saveImage(img); // Lưu hình ảnh
            entity.setImg(imagePath); // Lưu đường dẫn hình ảnh vào entity
        }
        CategoriesEntity savedEntity = categoriesRepository.save(entity);
        return toDTO(savedEntity);
    }

    public CategoriesDTO updateCategory(Integer id, String name, MultipartFile img) throws IOException {
        CategoriesEntity entity = categoriesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        entity.setName(name);
        if (img != null && !img.isEmpty()) {
            String imagePath = ImageUtils.saveImage(img); // Lưu hình ảnh mới
            entity.setImg(imagePath);
        }
        CategoriesEntity updatedEntity = categoriesRepository.save(entity);
        return toDTO(updatedEntity);
    }

    public void deleteCategory(Integer id) {
        categoriesRepository.deleteById(id);
    }

    private CategoriesDTO toDTO(CategoriesEntity entity) {
        return new CategoriesDTO(
                entity.getCategoryId(),
                entity.getName(),
                entity.getImg());
    }

    private CategoriesEntity toEntity(CategoriesDTO categoryDto) {
        CategoriesEntity entity = new CategoriesEntity();
        entity.setCategoryId(categoryDto.getCategoryId());
        entity.setName(categoryDto.getName());
        entity.setImg(categoryDto.getImg());
        // Set các thuộc tính khác nếu cần
        return entity;
    }
}
