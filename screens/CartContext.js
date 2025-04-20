import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // ✅ Load cart từ AsyncStorage khi mở app
    useEffect(() => {
        const loadCart = async () => {
            try {
                const data = await AsyncStorage.getItem('cart');
                if (data) {
                    setCartItems(JSON.parse(data));
                }
            } catch (error) {
                console.error('Lỗi khi load giỏ hàng:', error);
            }
        };
        loadCart();
    }, []);

    // ✅ Tự động lưu vào AsyncStorage mỗi khi cart thay đổi
    useEffect(() => {
        const saveCart = async () => {
            try {
                await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
            } catch (error) {
                console.error('Lỗi khi lưu giỏ hàng:', error);
            }
        };
        saveCart();
    }, [cartItems]);

    // ✅ Thêm item, gộp nếu trùng tên
    const addItemToCart = (item) => {
        setCartItems(prev => {
            const existingItem = prev.find(i => i.name === item.name);
            if (existingItem) {
                return prev.map(i =>
                    i.name === item.name
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                );
            } else {
                return [...prev, { ...item, id: Date.now().toString() }];
            }
        });
    };

    const updateItemQuantity = (id, delta) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            )
        );
    };

    const removeItemFromCart = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const toggleItemSelect = (id) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, selected: !item.selected } : item
            )
        );
    };

    const total = cartItems.reduce(
        (sum, item) => (item.selected ? sum + item.price * item.quantity : sum),
        0
    );

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addItemToCart,
                updateItemQuantity,
                removeItemFromCart,
                toggleItemSelect,
                total,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};
