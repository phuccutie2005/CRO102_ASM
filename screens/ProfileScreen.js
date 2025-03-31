import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts } from '../redux/slices/productsSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const ProductsScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const products = useSelector((state) => state.products.products);

  useEffect(() => {
    const fakeProducts = [
    ];
    dispatch(setProducts(fakeProducts)); // Cập nhật Redux store
  }, [dispatch]);

  const handleLogout = () => {
    navigation.replace('Login'); // Chỉ quay về màn hình Login, không xóa dữ liệu
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Products</Text>
      {products.map((product) => (
        <Text key={product.id}>{product.name}</Text>
      ))}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#FF4B4B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductsScreen;
