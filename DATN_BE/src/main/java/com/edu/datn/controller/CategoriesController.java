package com.edu.datn.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.edu.datn.dto.CategoriesDTO;
import com.edu.datn.service.CategoriesService;

@RestController
@RequestMapping("/api/categories")
public class CategoriesController {

    @Autowired
    private CategoriesService categoriesService;

    @GetMapping
    public ResponseEntity<List<CategoriesDTO>> getAllCategories() {
        return ResponseEntity.ok(categoriesService.getAllCategories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriesDTO> getCategoryById(@PathVariable Integer id) {
        return ResponseEntity.ok(categoriesService.getCategoryById(id));
    }

    @PostMapping
    public ResponseEntity<CategoriesDTO> createCategory(
            @RequestParam("name") String name,
            @RequestParam(value = "img", required = false) MultipartFile img) throws IOException {
        return ResponseEntity.ok(categoriesService.createCategory(name, img));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoriesDTO> updateCategory(
            @PathVariable Integer id,
            @RequestParam("name") String name,
            @RequestParam(value = "img", required = false) MultipartFile img) throws IOException {
        return ResponseEntity.ok(categoriesService.updateCategory(id, name, img));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Integer id) {
        categoriesService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
