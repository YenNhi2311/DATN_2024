package com.edu.datn.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
@Table(name = "brands")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BrandsEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "brand_id")
  private Integer brandId;

  @Column(name = "name", nullable = false, length = 100)
  private String name;

  @Column(name = "place", nullable = false, length = 100)
  private String place;

  @Column(name = "img", nullable = false, length = 100)
  private String img;

  @OneToMany(mappedBy = "brand")
  @JsonIgnore
  private Set<ProductEntity> product;
}
