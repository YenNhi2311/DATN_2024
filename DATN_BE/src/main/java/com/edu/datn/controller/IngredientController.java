package com.edu.datn.controller;

import com.edu.datn.dto.IngredientDTO;
import com.edu.datn.service.IngredientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.util.List;

@RestController
@RequestMapping("/api/ingredients")
public class IngredientController {

    @Autowired
    private IngredientService ingredientService;

    // GET all ingredients
    @GetMapping
    public ResponseEntity<List<IngredientDTO>> getAllIngredients() {
        List<IngredientDTO> ingredients = ingredientService.getAllIngredients();
        return ResponseEntity.ok(ingredients);
    }

    // GET ingredient by ID
    @GetMapping("/{id}")
    public ResponseEntity<IngredientDTO> getIngredientById(@PathVariable Integer id) {
        IngredientDTO ingredient = ingredientService.getIngredientById(id);
        return ingredient != null ? ResponseEntity.ok(ingredient) : ResponseEntity.notFound().build();
    }

    // POST new ingredient
    @PostMapping
    public ResponseEntity<IngredientDTO> createIngredient(@RequestBody IngredientDTO ingredientDto) {
        IngredientDTO createdIngredient = ingredientService.createIngredient(ingredientDto);
        return new ResponseEntity<>(createdIngredient, HttpStatus.CREATED);
    }

    // PUT (update) ingredient by ID
    @PutMapping("/{id}")
    public ResponseEntity<IngredientDTO> updateIngredient(
            @PathVariable Integer id,
            @RequestBody IngredientDTO ingredientDto) {
                IngredientDTO updatedIngredient = ingredientService.updateIngredient(id, ingredientDto);
        return updatedIngredient != null ? ResponseEntity.ok(updatedIngredient) : ResponseEntity.notFound().build();
    }

    // DELETE ingredient by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIngredient(@PathVariable Integer id) {
        boolean isDeleted = ingredientService.deleteIngredient(id);
        return isDeleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
