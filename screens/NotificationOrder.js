import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native'; // thêm import này ở đầu file
import { useNavigation } from '@react-navigation/native';
import CustomBackHeader from '../component/header';


const NoticationOrder = ({ navigation, route }) => {

    const {
        name,
        email,
        address,
        phone,
        shipping,
        payment,
        total,
        productName,
        quantity,
        image,
        title,
        description,
        date
    } = route.params;

    // Không cần khai báo lại navigation với useNavigation()

    return (
        <>
            <CustomBackHeader navigation={navigation} />
            <View style={styles.container}>

                <ScrollView contentContainerStyle={styles.content}>
                    <Text style={styles.success}>Bạn đã đặt hàng thành công</Text>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
                        <Text>{productName ?? 'Sản phẩm không xác định'} x {quantity ?? 1}</Text>
                        <Text>{email ?? 'Chưa cung cấp email'}</Text>
                        <Text>{address ?? 'Không có địa chỉ'}</Text>
                        <Text>{phone ?? 'Không có số điện thoại'}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Phương thức vận chuyển</Text>
                        <Text>{shipping}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Hình thức thanh toán</Text>
                        <Text>{payment}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Đơn hàng đã chọn</Text>
                        <Text>{productName ?? 'Không có tên sản phẩm'} x {quantity}</Text>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.totalText}>Đã thanh toán</Text>
                        <Text style={styles.totalPrice}>{total ? total : 'Chưa có tổng số tiền'}</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.greenButton}
                        onPress={() => navigation.navigate('GardeningHandbook')}
                    >
                        <Text style={styles.greenButtonText}>Xem Cẩm nang trồng cây</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                        <Text style={styles.backHome}>Quay về Trang chủ</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </>
    );
};


export default NoticationOrder;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10
    },
    content: {
        paddingHorizontal: 15,
        paddingBottom: 30
    },
    success: {
        color: 'green',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
        marginVertical: 15
    },
    section: {
        marginTop: 15,
        borderTopWidth: 0.5,
        borderTopColor: '#ccc',
        paddingTop: 10
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 5
    },
    footer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    totalText: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    totalPrice: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    greenButton: {
        backgroundColor: '#0a7c45',
        padding: 12,
        borderRadius: 5,
        marginTop: 20
    },
    greenButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    backHome: {
        color: '#000',
        textAlign: 'center',
        marginTop: 20,
        textDecorationLine: 'underline'
    }
});
