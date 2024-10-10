package com.edu.datn.jpa;

import com.edu.datn.entities.IngredientEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IngredientJPA extends JpaRepository<IngredientEntity, Integer> {

}
