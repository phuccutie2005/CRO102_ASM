import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Firestore/firebaseConfig'; // chỉnh lại đường dẫn theo dự án Púc

const PaymentScreen = ({ route, navigation }) => {
    const auth = getAuth();
    const user = auth.currentUser;
    const { product, quantity, totalPrice } = route.params;

    const [shippingMethod, setShippingMethod] = useState('fast');
    const [paymentMethod, setPaymentMethod] = useState('visa');

    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    const shippingCost = shippingMethod === 'fast' ? 15000 : 20000;
    const productCost = totalPrice;
    const totalCost = productCost + shippingCost;

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                try {
                    const docRef = doc(db, 'users', user.uid);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setFullName(data.name || '');
                        setPhone(data.phone || '');
                        setAddress(data.address || '');
                    }
                } catch (error) {
                    console.error('Lỗi lấy dữ liệu user:', error);
                }
            }
        };

        fetchUserData();
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>THANH TOÁN</Text>

            <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
            <TextInput
                style={styles.input}
                placeholder="Tên khách hàng"
                value={fullName}
                onChangeText={setFullName}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={user?.email || ''}
                editable={false}
            />
            <TextInput
                style={styles.input}
                placeholder="Địa chỉ"
                value={address}
                onChangeText={setAddress}
            />
            <TextInput
                style={styles.input}
                placeholder="Số điện thoại"
                value={phone}
                keyboardType="phone-pad"
                onChangeText={setPhone}
            />

            <Text style={styles.sectionTitle}>Phương thức vận chuyển</Text>
            <TouchableOpacity
                style={styles.optionRow}
                onPress={() => setShippingMethod('fast')}
            >
                <View>
                    <Text style={styles.optionText}>Giao hàng Nhanh - 15.000đ</Text>
                    <Text style={styles.subText}>Dự kiến giao hàng 5-7/9</Text>
                </View>
                {shippingMethod === 'fast' && <Ionicons name="checkmark" size={20} color="green" />}
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.optionRow}
                onPress={() => setShippingMethod('cod')}
            >
                <View>
                    <Text style={styles.optionText}>Giao hàng COD - 20.000đ</Text>
                    <Text style={styles.subText}>Dự kiến giao hàng 4-8/9</Text>
                </View>
                {shippingMethod === 'cod' && <Ionicons name="checkmark" size={20} color="green" />}
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Hình thức thanh toán</Text>
            <TouchableOpacity
                style={styles.optionRow}
                onPress={() => setPaymentMethod('visa')}
            >
                <Text style={styles.optionText}>Thẻ VISA/MASTERCARD</Text>
                {paymentMethod === 'visa' && <Ionicons name="checkmark" size={20} color="green" />}
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.optionRow}
                onPress={() => setPaymentMethod('atm')}
            >
                <Text style={styles.optionText}>Thẻ ATM</Text>
                {paymentMethod === 'atm' && <Ionicons name="checkmark" size={20} color="green" />}
            </TouchableOpacity>

            <View style={styles.summary}>
                <View style={styles.summaryRow}>
                    <Text style={styles.grayText}>Tạm tính</Text>
                    <Text>{productCost.toLocaleString()}đ</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.grayText}>Phí vận chuyển</Text>
                    <Text>{shippingCost.toLocaleString()}đ</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.totalText}>Tổng cộng</Text>
                    <Text style={styles.totalText}>{totalCost.toLocaleString()}đ</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.continueButton}>
                <Text style={styles.continueText}>TIẾP TỤC</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 40,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 8,
        fontSize: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 6,
        padding: 10,
        marginBottom: 10,
    },
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    optionText: {
        fontSize: 14,
        fontWeight: '500',
    },
    subText: {
        color: 'gray',
        fontSize: 12,
    },
    summary: {
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 10,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    grayText: {
        color: 'gray',
    },
    totalText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    continueButton: {
        marginTop: 20,
        backgroundColor: 'gray',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    continueText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default PaymentScreen;
