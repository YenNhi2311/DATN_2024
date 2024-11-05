package com.edu.datn.entities;

import java.time.LocalDateTime;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonFormat;
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
@Table(name = "orders")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "order_id")
  private Integer orderId;

  @Column(name = "orderDate")
  @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
  private LocalDateTime orderDate;

  @Column(name = "payDate")
  @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
  private LocalDateTime payDate;

  @Column(name = "status", nullable = false)
  private String status;

  @Column(name = "shipping_fee", nullable = false)
  private Double shippingFee;

  @Column(name = "specific_address", nullable = false)
  private String specificAddress;

  @Column(name = "ward_commune", nullable = false)
  private String wardCommune;

  @Column(name = "district", nullable = false)
  private String district;

  @Column(name = "province", nullable = false)
  private String province;

  @Column(name = "total", nullable = false)
  private Double total;

  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  private UserEntity user;

  @OneToMany(mappedBy = "order")
  @JsonIgnore
  private Set<PaymentEntity> payments;

  @OneToMany(mappedBy = "order")
  @JsonIgnore
  private Set<OrderDetailsEntity> orderDetails;
}
