package com.edu.datn.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edu.datn.dto.IngredientDTO;
import com.edu.datn.entities.IngredientEntity;
import com.edu.datn.jpa.IngredientJPA;

@Service
public class IngredientService {

    @Autowired
    private IngredientJPA ingredientRepository;

    // Convert entity to DTO
    private IngredientDTO convertToDto(IngredientEntity ingredient) {
        return new IngredientDTO(ingredient.getIngredientId(), ingredient.getName());
    }

    // Convert DTO to entity
    public IngredientEntity convertDTOtoEntity(IngredientDTO ingredientDTO) {
        IngredientEntity entity = new IngredientEntity();
        entity.setIngredientId(ingredientDTO.getIngredientId());
        entity.setName(ingredientDTO.getName());
        return entity;
    }

    // Get all ingredients
    public List<IngredientDTO> getAllIngredients() {
        List<IngredientEntity> ingredients = ingredientRepository.findAll();
        return ingredients.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Get ingredient by ID
    public IngredientDTO getIngredientById(Integer id) {
        Optional<IngredientEntity> ingredient = ingredientRepository.findById(id);
        return ingredient.map(this::convertToDto).orElse(null);
    }

    // Create a new ingredient
    public IngredientDTO createIngredient(IngredientDTO ingredientDto) {
        IngredientEntity ingredient = convertDTOtoEntity(ingredientDto);
        IngredientEntity savedIngredient = ingredientRepository.save(ingredient);
        return convertToDto(savedIngredient);
    }

    // Update an existing ingredient
    public IngredientDTO updateIngredient(Integer id, IngredientDTO ingredientDto) {
        Optional<IngredientEntity> optionalIngredient = ingredientRepository.findById(id);

        if (optionalIngredient.isPresent()) {
            IngredientEntity ingredient = optionalIngredient.get();
            ingredient.setName(ingredientDto.getName());
            IngredientEntity updatedIngredient = ingredientRepository.save(ingredient);
            return convertToDto(updatedIngredient);
        }

        return null; // Or throw an exception if preferred
    }

    // Delete an ingredient by ID
    public boolean deleteIngredient(Integer id) {
        if (ingredientRepository.existsById(id)) {
            ingredientRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
