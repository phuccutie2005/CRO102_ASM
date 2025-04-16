import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const DetailProductScreen = ({ route }) => {
    const { product } = route.params;
    const [quantity, setQuantity] = useState(0);

    const handleIncrease = () => setQuantity(quantity + 1);
    const handleDecrease = () => {
        if (quantity > 0) setQuantity(quantity - 1);
    };

    const totalPrice = quantity * parseInt(product.price.replace(/\D/g, ''));

    return (
        <View style={styles.container}>
            <Image source={{ uri: product.image }} style={styles.image} />
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.tag}>Cây trồng</Text>
            <Text style={styles.tag}>Ưa bóng</Text>
            <Text style={styles.price}>{product.price}</Text>

            <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Chi tiết sản phẩm</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Kích cỡ</Text>
                    <Text style={styles.value}>Nhỏ</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Xuất xứ</Text>
                    <Text style={styles.value}>Châu Phi</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Tình trạng</Text>
                    <Text style={[styles.value, { color: '#27ae60' }]}>Còn 156 sp</Text>
                </View>
            </View>

            <View style={styles.bottomSection}>
                <View style={styles.quantityRow}>
                    <TouchableOpacity onPress={handleDecrease} style={styles.quantityButton}>
                        <Text style={styles.quantityText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityNumber}>{quantity}</Text>
                    <TouchableOpacity onPress={handleIncrease} style={styles.quantityButton}>
                        <Text style={styles.quantityText}>+</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.totalText}>
                    {quantity > 0
                        ? `Tạm tính\n${totalPrice.toLocaleString('vi-VN')}đ`
                        : '0đ'}
                </Text>
            </View>

            <TouchableOpacity
                style={[styles.buyButton, quantity === 0 && styles.disabledButton]}
                disabled={quantity === 0}
            >
                <Text style={styles.buyButtonText}>CHỌN MUA</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    image: { width: '100%', height: 250, borderRadius: 12, marginBottom: 20 },
    name: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
    tag: {
        backgroundColor: '#1a7f37',
        color: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        fontSize: 12,
        alignSelf: 'flex-start',
        marginTop: 4,
        marginBottom: 2,
        marginRight: 6,
    },
    price: { fontSize: 22, fontWeight: '600', color: '#27ae60', marginTop: 10 },
    infoSection: { marginTop: 20 },
    infoTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 4,
    },
    label: { fontSize: 14, color: '#444' },
    value: { fontSize: 14, fontWeight: '600' },
    bottomSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 30,
    },
    quantityRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        width: 36,
        height: 36,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityText: { fontSize: 20, fontWeight: 'bold' },
    quantityNumber: { marginHorizontal: 12, fontSize: 18 },
    totalText: {
        fontSize: 14,
        textAlign: 'right',
        fontWeight: '600',
        color: '#000',
    },
    buyButton: {
        backgroundColor: '#27ae60',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    buyButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default DetailProductScreen;
