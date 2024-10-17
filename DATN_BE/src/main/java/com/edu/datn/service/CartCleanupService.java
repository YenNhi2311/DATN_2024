package com.edu.datn.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.edu.datn.entities.CartItemEntity;
import com.edu.datn.entities.ProductPromotionEntity;

@Service
public class CartCleanupService {

    @Autowired
    private CartItemService cartItemService;

    @Scheduled(fixedRate = 3600000) // Thực hiện mỗi giờ
    public void cleanupExpiredPromotions() {
        LocalDateTime currentDate = LocalDateTime.now();
        List<CartItemEntity> allCartItems = cartItemService.findAllCartItems();

        for (CartItemEntity cartItem : allCartItems) {
            ProductPromotionEntity productPromotion = cartItem.getProductPromotion();
            if (productPromotion != null && productPromotion.getPromotion() != null) {
                LocalDateTime endDate = productPromotion.getPromotion().getEndDate();

                // Xóa sản phẩm nếu khuyến mãi đã hết hạn
                if (endDate.isBefore(currentDate)) {
                    cartItemService.deleteCartItem(cartItem.getCartItemId());
                }
            }
        }
    }
}