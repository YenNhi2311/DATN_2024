package com.edu.datn.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edu.datn.entities.CartItemEntity;
import com.edu.datn.jpa.CartItemJPA;
import com.edu.datn.jpa.CartJPA;
import com.edu.datn.jpa.ProductDetailsJPA;

@Service
public class CartItemService {

    @Autowired
    private CartItemJPA cartItemJPA;

    @Autowired
    private CartJPA cartRepository;

    @Autowired
    private ProductDetailsJPA productDetailsRepository;

    public CartItemEntity saveCartItem(CartItemEntity cartItem) {
        return cartItemJPA.save(cartItem); // Lưu cart item vào cơ sở dữ liệu
    }

    public List<CartItemEntity> findAllItemsByCartId(int cartId) {
        return cartItemJPA.findByCart_CartId(cartId);
    }

    public CartItemEntity findCartItemById(int cartItemId) {
        return cartItemJPA.findById(cartItemId).orElse(null);
    }

    public void deleteCartItem(int cartItemId) {
        cartItemJPA.deleteById(cartItemId);
    }

    public CartItemEntity findByCartIdAndProductDetailIdAndProductPromotionId(int cartId, int productDetailId,
            int productPromotionId) {
        return cartItemJPA.findByCart_CartIdAndProductDetail_ProductDetailIdAndProductPromotion_ProductPromotionId(
                cartId, productDetailId, productPromotionId);
    }

    public List<CartItemEntity> findAllCartItems() {
        return cartItemJPA.findAll(); // Trả về tất cả các CartItemEntity
    }

}