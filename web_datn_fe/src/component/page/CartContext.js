import React, { createContext, useContext, useState } from 'react';
import { getCartItemsByUserId } from '../../services/authService';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const fetchCartItems = async (userId) => {
        try {
            const items = await getCartItemsByUserId(userId);
            setCartItems(items);
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, setCartItems, fetchCartItems }}>
            {children}
        </CartContext.Provider>
    );
};
