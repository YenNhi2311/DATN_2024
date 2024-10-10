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
@Table(name = "capacities")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CapacitiesEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "capacity_id")
  private Integer capacityId;

  @Column(name = "value", nullable = false)
  private Integer value;

  @OneToMany(mappedBy = "capacity")
  @JsonIgnore
  private Set<ProductDetailsEntity> productDetail;
}
