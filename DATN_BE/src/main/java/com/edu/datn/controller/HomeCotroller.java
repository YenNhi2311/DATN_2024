package com.edu.datn.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edu.datn.dto.CategoriesDTO;
import com.edu.datn.service.CategoriesService;

@RestController
@RequestMapping("/api/home")
public class HomeCotroller {
    @Autowired
    private CategoriesService categoriesService;

    @GetMapping("/categories")
    public ResponseEntity<List<CategoriesDTO>> getAllCategories() {
        return ResponseEntity.ok(categoriesService.getAllCategories());
    }
    
}
