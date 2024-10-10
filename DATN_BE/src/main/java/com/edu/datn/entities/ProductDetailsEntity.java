package com.edu.datn.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "productdetails")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductDetailsEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "productDetail_id")
  private Integer productDetailId;

  @Column(name = "price", nullable = false)
  private Double price;

  @Column(name = "quantity", nullable = false)
  private Integer quantity;

  @Column(name = "img", nullable = false)
  private String img;

  @ManyToOne
  @JoinColumn(name = "product_id", nullable = false)
  private ProductEntity product;

  @ManyToOne
  @JoinColumn(name = "color_id", nullable = false)
  private ColorEntity color;

  @ManyToOne
  @JoinColumn(name = "skintype_id", nullable = false)
  private SkintypeEntity skintype;

  @ManyToOne
  @JoinColumn(name = "capacity_id", nullable = false)
  private CapacitiesEntity capacity;

  @ManyToOne
  @JoinColumn(name = "ingredient_id", nullable = false)
  private IngredientEntity ingredient;

  @ManyToOne
  @JoinColumn(name = "benefit_id", nullable = false)
  private BenefitsEntity benefit;
  // Các trường khác
}
