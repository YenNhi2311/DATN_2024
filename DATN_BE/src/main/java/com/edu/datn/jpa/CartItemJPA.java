package com.edu.datn.jpa;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.edu.datn.entities.CartItemEntity;

@Repository
public interface CartItemJPA extends JpaRepository<CartItemEntity, Integer> {

        List<CartItemEntity> findByCart_User_UserId(Integer userId);

        List<CartItemEntity> findByCart_CartId(int cartId);

        // Định nghĩa phương thức tùy chỉnh tìm kiếm dựa trên userId và productDetailId
        CartItemEntity findByCart_CartIdAndProductDetail_ProductDetailId(
                        int cartId, int productDetailId);

}
