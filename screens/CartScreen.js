import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

export default function CartScreen({ navigation }) {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useFocusEffect(
        useCallback(() => {
            loadCart();
        }, [])
    );

    const loadCart = async () => {
        try {
            const cartData = JSON.parse(await AsyncStorage.getItem('cart')) || [];
            setCartItems(cartData);
            setSelectedItems([]); // Reset lựa chọn khi tải lại
            updateTotalPrice([]); // Reset tổng giá trị hoặc tính toán lại dựa trên sản phẩm đã chọn
        } catch (error) {
            console.error('Lỗi tải giỏ hàng:', error);
        }
    };

    const updateTotalPrice = (selectedIds) => {
        const total = cartItems
            .filter(item => selectedIds.includes(item.id))
            .reduce((sum, item) => sum + (item.price * item.quantity), 0);

        setTotalPrice(total);
    };

    const toggleSelectItem = (id) => {
        setSelectedItems((prevSelected) => {
            const newSelected = prevSelected.includes(id)
                ? prevSelected.filter(item => item !== id)
                : [...prevSelected, id];

            updateTotalPrice(newSelected);
            return newSelected;
        });
    };

    const updateQuantity = async (id, action) => {
        const updatedCart = cartItems.map(item => {
            if (item.id === id) {
                let newQuantity = action === 'increase' ? item.quantity + 1 : item.quantity - 1;
                if (newQuantity > 0 && newQuantity !== item.quantity) {
                    return { ...item, quantity: newQuantity };
                }
            }
            return item;
        }).filter(Boolean);

        if (JSON.stringify(updatedCart) !== JSON.stringify(cartItems)) {
            await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
            setCartItems(updatedCart);
            setSelectedItems([]);  // Reset lựa chọn khi có thay đổi
            updateTotalPrice([]);   // Cập nhật lại tổng tiền khi thay đổi giỏ hàng
        }
    };

    const removeSelectedItems = async () => {
        if (selectedItems.length === 0) {
            Alert.alert("Thông báo", "Bạn chưa chọn sản phẩm nào để xóa.");
            return;
        }

        Alert.alert(
            "Xác nhận",
            "Bạn có chắc muốn xóa các sản phẩm đã chọn khỏi giỏ hàng?",
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Xóa",
                    onPress: async () => {
                        try {
                            const newCart = cartItems.filter(item => !selectedItems.includes(item.id));
                            await AsyncStorage.setItem('cart', JSON.stringify(newCart));
                            setCartItems(newCart);
                            setSelectedItems([]);
                            setTotalPrice(0);
                        } catch (error) {
                            console.error("Lỗi khi xóa sản phẩm:", error);
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    };

    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            Alert.alert("Thông báo", "Vui lòng chọn sản phẩm trước khi thanh toán.");
            return;
        }

        const selectedProducts = cartItems.filter(item => selectedItems.includes(item.id));
        updateTotalPrice(selectedItems);  // Cập nhật lại totalPrice trước khi chuyển trang
        navigation.navigate('Payment', {
            product: selectedProducts,
            quantity: selectedProducts.map(p => p.quantity),
            totalPrice
        });
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Giỏ hàng</Text>

            {cartItems.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Giỏ hàng của bạn đang trống</Text>
                </View>
            ) : (
                <>
                    <FlatList
                        data={cartItems}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.cartItem}>
                                <TouchableOpacity onPress={() => toggleSelectItem(item.id)}>
                                    <Ionicons
                                        name={selectedItems.includes(item.id) ? "checkbox" : "square-outline"}
                                        size={24}
                                        color="green"
                                        style={styles.checkbox}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.itemWrapper}
                                    onPress={() => navigation.navigate('DetailProduct', { product: item })}
                                >
                                    <Image source={{ uri: item.image }} style={styles.image} />
                                    <View style={styles.itemInfo}>
                                        <Text style={styles.itemText} numberOfLines={2}>{item.name}</Text>
                                        <Text style={styles.itemPrice}>{item.price.toLocaleString('vi-VN')} VND</Text>
                                    </View>
                                </TouchableOpacity>

                                <View style={styles.quantityContainer}>
                                    <TouchableOpacity onPress={() => updateQuantity(item.id, 'decrease')}>
                                        <Text style={styles.quantityButton}>-</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.quantityText}>{item.quantity}</Text>
                                    <TouchableOpacity onPress={() => updateQuantity(item.id, 'increase')}>
                                        <Text style={styles.quantityButton}>+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    />

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[
                                styles.deleteButton,
                                { backgroundColor: selectedItems.length === 0 ? '#ccc' : '#e53935' }
                            ]}
                            onPress={removeSelectedItems}
                        >
                            <Text style={styles.buttonText}>Xóa đã chọn</Text>
                        </TouchableOpacity>

                        {selectedItems.length > 0 && (
                            <View style={styles.checkoutSection}>
                                <Text style={styles.totalPrice}>
                                    Tạm tính: {totalPrice.toLocaleString('vi-VN')} VND
                                </Text>
                                <TouchableOpacity
                                    style={styles.checkoutButton}
                                    onPress={handleCheckout}
                                >
                                    <Text style={styles.buttonText}>Tiến hành thanh toán</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { fontSize: 16, color: 'gray' },

    cartItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderColor: '#ddd' },
    checkbox: { marginRight: 10 },
    itemWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center' },
    image: { width: 50, height: 50, marginRight: 10 },
    itemInfo: { flex: 1 },
    itemText: { fontSize: 16, fontWeight: 'bold' },
    itemPrice: { fontSize: 14, color: 'gray' },

    quantityContainer: { flexDirection: 'row', alignItems: 'center' },
    quantityButton: { fontSize: 20, padding: 5, color: 'blue' },
    quantityText: { fontSize: 16, marginHorizontal: 10 },

    totalPrice: { fontSize: 18, fontWeight: 'bold', textAlign: 'right', color: '#d32f2f' },
    footer: { marginTop: 20 },

    deleteButton: {
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10
    },
    checkoutSection: {
        backgroundColor: '#f9f9f9',
        padding: 10,
        borderRadius: 10
    },
    checkoutButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10
    },
    buttonText: { color: 'white', fontWeight: 'bold' }
});
