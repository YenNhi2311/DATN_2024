package com.edu.datn.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "orderdetails")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderDetailsEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "orderDetail_id")
  private Integer orderDetailId;

  @Column(name = "price", nullable = false)
  private Double price;

  @Column(name = "quantity", nullable = false)
  private Integer quantity;

  @ManyToOne
  @JoinColumn(name = "order_id", nullable = false)
  private OrderEntity order;

  @ManyToOne
  @JoinColumn(name = "product_detail_id", nullable = false)
  private ProductDetailsEntity productDetail;
}
