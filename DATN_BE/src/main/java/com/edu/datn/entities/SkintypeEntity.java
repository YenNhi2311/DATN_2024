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
@Table(name = "skintype")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SkintypeEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "skinType_id") // Đảm bảo tên cột chính xác
  private Integer skintypeId;

  @Column(name = "name", nullable = false, length = 100)
  private String name;

  @OneToMany(mappedBy = "skintype")
  @JsonIgnore
  private Set<ProductDetailsEntity> productDetails;
}
