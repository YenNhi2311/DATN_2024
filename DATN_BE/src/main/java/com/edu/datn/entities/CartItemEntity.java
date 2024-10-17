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
@Table(name = "cartitem")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CartItemEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cartItem_id")
    private Integer cartItemId;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @ManyToOne
    @JoinColumn(name = "cart_id", nullable = false)
    private CartEntity cart;

    @ManyToOne
    @JoinColumn(name = "productDetail_id", nullable = false)
    private ProductDetailsEntity productDetail;

    // Thêm quan hệ với ProductPromotionEntity
    @ManyToOne
    @JoinColumn(name = "productPromotion_id")
    private ProductPromotionEntity productPromotion;

}
