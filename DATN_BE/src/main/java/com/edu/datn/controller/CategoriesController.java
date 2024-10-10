package com.edu.datn.controller;

import com.edu.datn.dto.CategoriesDTO;
import com.edu.datn.service.CategoriesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

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
    public ResponseEntity<CategoriesDTO> createCategory(@RequestBody CategoriesDTO categoryDto) throws IOException {
        return ResponseEntity.ok(categoriesService.createCategory(categoryDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoriesDTO> updateCategory(@PathVariable Integer id,
            @RequestBody CategoriesDTO categoryDto) throws IOException {
        return ResponseEntity.ok(categoriesService.updateCategory(id, categoryDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Integer id) {
        categoriesService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
