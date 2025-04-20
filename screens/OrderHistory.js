import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomBackHeader from '../component/header';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../Firestore/firebaseConfig'; // thay bằng đường dẫn đúng của bạn
import { getAuth } from 'firebase/auth';

const OrderHistoryScreen = () => {
    const navigation = useNavigation();
    const [orders, setOrders] = useState([]);
    const auth = getAuth();
    const user = auth.currentUser;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const q = query(collection(db, 'notifications'), where('userId', '==', user.uid));
                const querySnapshot = await getDocs(q);

                const groupedOrders = {};

                querySnapshot.forEach(doc => {
                    const data = doc.data();
                    const date = data.date;
                    if (!groupedOrders[date]) groupedOrders[date] = [];
                    groupedOrders[date].push({ id: doc.id, ...data });
                });

                const formattedOrders = Object.keys(groupedOrders).map(date => ({
                    date,
                    items: groupedOrders[date]
                }));

                setOrders(formattedOrders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        if (user) fetchOrders();
    }, []);

    return (
        <>
            <CustomBackHeader navigation={navigation} />
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {orders.map((order, index) => (
                        <View key={index}>
                            <Text style={styles.date}>{order.date}</Text>
                            {order.items.map((item, idx) => (
                                <TouchableOpacity
                                    key={idx}
                                    style={styles.itemContainer}
                                    onPress={() => navigation.navigate('NoticationOrder', { ...item })}
                                >
                                    <Image source={{ uri: item.image }} style={styles.image} />
                                    <View style={styles.details}>
                                        <Text style={[styles.status, { color: 'green' }]}>{item.title}</Text>
                                        <Text style={styles.name}>
                                            {item.productName} | <Text style={styles.desc}>{item.description}</Text>
                                        </Text>
                                        <Text style={styles.quantity}>Số lượng: {item.quantity}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ))}
                </ScrollView>
            </View>
        </>
    );
};

export default OrderHistoryScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 1
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
