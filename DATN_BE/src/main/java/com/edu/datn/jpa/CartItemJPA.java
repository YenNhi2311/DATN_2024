package com.edu.datn.jpa;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.edu.datn.entities.CartItemEntity;

@Repository
public interface CartItemJPA extends JpaRepository<CartItemEntity, Integer> {

    List<CartItemEntity> findByCart_User_UserId(Integer userId);

    List<CartItemEntity> findByCart_CartId(int cartId);

    // Định nghĩa phương thức tùy chỉnh tìm kiếm dựa trên userId và productDetailId
    CartItemEntity findByCart_CartIdAndProductDetail_ProductDetailIdAndProductPromotion_ProductPromotionId(
            int cartId, int productDetailId, int productPromotionId);

    @Query("SELECT ci FROM CartItemEntity ci WHERE ci.cart.id = :cartId AND ci.productDetail.id = :productDetailId " +
            "AND ((ci.productPromotion.id IS NULL AND :productPromotionId IS NULL) OR ci.productPromotion.id = :productPromotionId)")
    CartItemEntity findByCartIdAndProductDetailIdAndProductPromotionId(
            @Param("cartId") int cartId,
            @Param("productDetailId") int productDetailId,
            @Param("productPromotionId") Integer productPromotionId); // Sử dụng Integer để xử lý giá trị null

}
