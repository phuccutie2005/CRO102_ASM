import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const orders = [
    {
        date: 'Thứ tư, 03/09/2021',
        items: [
            {
                status: 'Đặt hàng thành công',
                statusColor: 'green',
                name: 'Spider Plant',
                description: '1 chậu lớn',
                quantity: '2 sản phẩm',
                image: 'https://cdn.shopify.com/s/files/1/0150/6262/products/plant_1024x1024.jpg?v=1490389682'
            }
        ]
    },
    {
        date: 'Thứ hai, 01/09/2021',
        items: [
            {
                status: 'Đã huỷ đơn hàng',
                statusColor: 'red',
                name: 'Spider Plant',
                description: '1 chậu lớn',
                quantity: '3 sản phẩm',
                image: 'https://cdn.shopify.com/s/files/1/0150/6262/products/plant_1024x1024.jpg?v=1490389682'
            }
        ]
    }
];

const OrderHistoryScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="chevron-back" size={24} color="black" />
                <Text style={styles.headerTitle}>LỊCH SỬ GIAO DỊCH</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {orders.map((order, index) => (
                    <View key={index}>
                        <Text style={styles.date}>{order.date}</Text>
                        {order.items.map((item, idx) => (
                            <View key={idx} style={styles.itemContainer}>
                                <Image source={{ uri: item.image }} style={styles.image} />
                                <View style={styles.details}>
                                    <Text style={[styles.status, { color: item.statusColor }]}>{item.status}</Text>
                                    <Text style={styles.name}>
                                        {item.name} | <Text style={styles.desc}>{item.description}</Text>
                                    </Text>
                                    <Text style={styles.quantity}>{item.quantity}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export default OrderHistoryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 50
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        marginBottom: 10
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10
    },
    scrollContainer: {
        paddingHorizontal: 15
    },
    date: {
        fontWeight: 'bold',
        fontSize: 14,
        marginTop: 15
    },
    itemContainer: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
        paddingBottom: 10
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 10,
        marginRight: 10
    },
    details: {
        flex: 1,
        justifyContent: 'center'
    },
    status: {
        fontWeight: 'bold',
        fontSize: 15
    },
    name: {
        fontSize: 14,
        marginTop: 2
    },
    desc: {
        color: '#888'
    },
    quantity: {
        fontSize: 14,
        marginTop: 2,
        color: '#555'
    }
});
