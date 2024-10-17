package com.edu.datn.entities;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "products")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "product_id")
  private Integer productId;

  @Column(name = "name", nullable = false)
  private String name;

  @Column(name = "description", nullable = false)
  private String description;

  @ManyToOne
  @JoinColumn(name = "category_id", nullable = false)
  private CategoriesEntity category;

  @ManyToOne
  @JoinColumn(name = "brand_id", nullable = false)
  private BrandsEntity brand;

  @OneToMany(mappedBy = "product")
  @JsonIgnore
  private Set<ProductDetailsEntity> productDetails;

  @OneToMany(mappedBy = "product")
  @JsonIgnore
  private Set<ProductPromotionEntity> promotionproduct;
}
