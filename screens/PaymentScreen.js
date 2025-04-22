import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, collection, addDoc, Timestamp, setDoc } from 'firebase/firestore';
import { db } from '../Firestore/firebaseConfig'; // chỉnh lại đường dẫn theo dự án Púc
import { useNavigation } from '@react-navigation/native';
import CustomBackHeader from '../component/header';
import { Alert } from 'react-native'; // thêm import này ở đầu file

const PaymentScreen = ({ route, navigation }) => {

    const auth = getAuth();
    const user = auth.currentUser;
    const { product, quantity, totalPrice, cartItems } = route.params;

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
        <>
            <CustomBackHeader navigation={navigation} />
            <ScrollView contentContainerStyle={styles.container}>


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

                <TouchableOpacity
                    style={styles.optionRow}
                    onPress={() => setPaymentMethod('cod')}
                >
                    <Text style={styles.optionText}>Thanh toán khi nhận hàng </Text>
                    {paymentMethod === 'cod' && <Ionicons name="checkmark" size={20} color="green" />}
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

                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={async () => {
                        if (!fullName || !phone || !address) {
                            Alert.alert('Thiếu thông tin', 'Vui lòng nhập đầy đủ Họ tên, Số điện thoại và Địa chỉ.');
                            return;
                        }

                        try {
                            // Lưu đơn hàng vào Firestore
                            await addDoc(collection(db, 'orders'), {
                                userId: user.uid,
                                name: fullName,
                                email: user.email,
                                phone,
                                address,
                                shippingMethod: shippingMethod,
                                paymentMethod: paymentMethod,
                                totalCost,
                                product,
                                quantity,
                                createdAt: Timestamp.now()
                            });

                            //  Cập nhật lại thông tin người dùng vào Firestore (cho EditProfileScreen)
                            const userDocRef = doc(db, 'users', user.uid);
                            await setDoc(userDocRef, {
                                name: fullName,
                                email: user.email,
                                phone,
                                address
                            });
                            // Lưu thông báo vào Firestore
                            await addDoc(collection(db, 'notifications'), {
                                userId: user.uid,
                                name: fullName,
                                email: user.email,
                                address,
                                phone,
                                shipping: shippingMethod === 'fast'
                                    ? 'Giao hàng Nhanh - 15.000đ\n(Dự kiến giao hàng 5-7/9)'
                                    : 'Giao hàng COD - 20.000đ\n(Dự kiến giao hàng 4-8/9)',
                                payment:
                                    paymentMethod === 'visa' ? 'Thẻ VISA/MASTERCARD' :
                                        paymentMethod === 'atm' ? 'Thẻ ATM' : 'Thanh toán khi nhận hàng',
                                total: totalCost.toLocaleString() + 'đ',
                                productName: product.name,
                                image: product.image,
                                quantity,
                                title: 'Đặt hàng thành công',
                                date: new Date().toLocaleDateString('vi-VN'),
                            });


                            // Chuyển màn hình thông báo
                            navigation.navigate('NoticationOrder', {
                                name: fullName,
                                email: user?.email || '',
                                address: address,
                                phone: phone,
                                shipping: shippingMethod === 'fast'
                                    ? 'Giao hàng Nhanh - 15.000đ\n(Dự kiến giao hàng 5-7/9)'
                                    : 'Giao hàng COD - 20.000đ\n(Dự kiến giao hàng 4-8/9)',
                                payment:
                                    paymentMethod === 'visa' ? 'Thẻ VISA/MASTERCARD' :
                                        paymentMethod === 'atm' ? 'Thẻ ATM' : 'Thanh toán khi nhận hàng',
                                total: totalCost.toLocaleString() + 'đ',
                                product: product,
                                quantity: quantity
                            });
                        } catch (error) {
                            console.error("Lỗi khi lưu đơn hàng:", error);
                            Alert.alert("Lỗi", "Không thể lưu đơn hàng. Vui lòng thử lại.");
                        }
                    }}
                >
                    <Text style={styles.continueText}>TIẾP TỤC</Text>
                </TouchableOpacity>
            </ScrollView>
        </>
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
