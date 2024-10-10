package com.edu.datn.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "ingredients")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class IngredientEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "ingredient_id")
  private Integer ingredientId;

  @Column(name = "name", nullable = false)
  private String name;

  @OneToMany(mappedBy = "ingredient")
  @JsonIgnore
  private Set<ProductDetailsEntity> productDetail;
}