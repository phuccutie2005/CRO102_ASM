import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { auth, db } from '../Firestore/firebaseConfig';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WrapInput from '../component/WrapInput';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useNavigation } from '@react-navigation/native';

WebBrowser.maybeCompleteAuthSession();

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isValidPhone, setIsValidPhone] = useState(false);
  const [isMatchPassword, setIsMatchPassword] = useState(true);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '170843770861-d3gfhadfl1n3c7rb41m6qkka8v98gnlv.apps.googleusercontent.com',
    androidClientId: '170843770861-pb0vummgjp0qc9sf3s2n4uo2mtr0uf78.apps.googleusercontent.com',
    redirectUri: 'https://auth.expo.io/@phuckaido2k5/ASM1',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      handleGoogleSignIn(credential);
    }
  }, [response]);

  // Lưu dữ liệu vào AsyncStorage
  const saveUserToLocal = async (userData) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu vào AsyncStorage:', error);
    }
  };

  // Kiểm tra định dạng email
  const validateEmail = (text) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmail(text);
    setIsValidEmail(emailRegex.test(text));
  };

  // Kiểm tra số điện thoại (bắt đầu bằng 0 và có đúng 10 số)
  const validatePhone = (text) => {
    const phoneRegex = /^0\d{9}$/;
    setPhone(text);
    setIsValidPhone(phoneRegex.test(text));
  };

  // Kiểm tra mật khẩu trùng khớp
  const validatePasswordMatch = (text) => {
    setConfirmPassword(text);
    setIsMatchPassword(text === password);
  };

  const handleRegister = async () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    if (!isValidEmail || !isValidPhone || !isMatchPassword) {
      Alert.alert('Lỗi', 'Thông tin không hợp lệ!');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userData = { uid: user.uid, name, email, phone, createdAt: new Date() };

      // Lưu vào Firestore
      await setDoc(doc(db, 'users', user.uid), userData);

      // Lưu vào AsyncStorage
      await saveUserToLocal(userData);

      Alert.alert('Thành công', 'Đăng ký thành công!');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Firebase Error:', error.code, error.message);
      Alert.alert('Lỗi đăng ký', `Mã lỗi: ${error.code}\n${error.message}`);
    }
  };

  const handleGoogleSignIn = async (credential) => {
    try {
      const userCredential = await signInWithCredential(auth, credential);
      const user = userCredential.user;

      const userData = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        phone: user.phoneNumber || '',
        createdAt: new Date(),
      };

      // Lưu vào Firestore
      await setDoc(doc(db, 'users', user.uid), userData, { merge: true });

      // Lưu vào AsyncStorage
      await saveUserToLocal(userData);

      Alert.alert('Thành công', 'Đăng nhập bằng Google thành công!');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Google Sign-In Error:', error.code, error.message);
      Alert.alert('Lỗi đăng nhập', `Mã lỗi: ${error.code}\n${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/nahida.png')} style={styles.headerImage} />
      <Text style={styles.title}>Đăng ký</Text>
      <Text style={styles.subtitle}>Tạo tài khoản</Text>

      <WrapInput placeholder="Họ tên" value={name} onChangeText={setName} />
      <WrapInput placeholder="E-mail" value={email} onChangeText={validateEmail} keyboardType="email-address" isError={!isValidEmail && email.length > 0} errorMessage="Email không hợp lệ!" />
      <WrapInput placeholder="Số điện thoại" value={phone} onChangeText={validatePhone} keyboardType="phone-pad" isError={!isValidPhone && phone.length > 0} errorMessage="SĐT phải có 10 số!" />
      <WrapInput placeholder="Mật khẩu" value={password} onChangeText={setPassword} secureTextEntry />
      <WrapInput placeholder="Xác nhận mật khẩu" value={confirmPassword} onChangeText={validatePasswordMatch} secureTextEntry isError={!isMatchPassword && confirmPassword.length > 0} errorMessage="Mật khẩu không trùng khớp!" />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Đăng ký</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>Hoặc</Text>

      <TouchableOpacity style={styles.googleButton} onPress={() => promptAsync()}>
        <Ionicons name="logo-google" size={24} color="white" />
        <Text style={styles.googleText}>Đăng nhập với Google</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 20, backgroundColor: 'white' },
  headerImage: { width: '100%', height: 120, resizeMode: 'cover', borderBottomLeftRadius: 30 },
  title: { fontSize: 26, fontWeight: 'bold', marginTop: 20 },
  subtitle: { fontSize: 16, color: 'gray', marginBottom: 20 },
  button: { backgroundColor: '#28A745', padding: 12, borderRadius: 8, width: '100%', alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});

export default RegisterScreen;
