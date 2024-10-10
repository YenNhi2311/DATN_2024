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
@Table(name = "benefits")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BenefitsEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "benefit_id")
  private Integer benefitId;

  private String name;

  @OneToMany(mappedBy = "benefit")
  @JsonIgnore
  private Set<ProductDetailsEntity> productDetails;
}
