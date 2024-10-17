package com.edu.datn.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edu.datn.entities.CartEntity;
import com.edu.datn.entities.UserEntity;
import com.edu.datn.jpa.CartItemJPA;
import com.edu.datn.jpa.CartJPA;
import com.edu.datn.jpa.UserJPA;

@Service
public class CartService {

    @Autowired
    private CartJPA cartRepository;

    @Autowired
    private UserJPA userRepository;

    @Autowired
    private CartItemJPA cartItemJPA;

    // Create a new cart for a user
    public CartEntity createCart(Integer userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found")); // Handle case where user doesn't exist

        CartEntity newCart = new CartEntity();
        newCart.setUser(user); // Associate the cart with the user

        return cartRepository.save(newCart); // Save the cart and return it
    }

    // Get cart by user ID
    public List<CartEntity> getCartByUserId(Integer userId) {
        // Retrieve the list of carts for the user
        List<CartEntity> carts = cartRepository.findByUser_UserId(userId);

        // Check if the list is empty and throw an exception if necessary
        if (carts.isEmpty()) {
            throw new RuntimeException("No carts found for user ID: " + userId);
        }

        return carts;
    }

    public CartEntity findCartById(Integer cartId) {
        return cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found with ID: " + cartId));
    }

}
