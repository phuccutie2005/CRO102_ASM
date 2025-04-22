import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, ScrollView, } from 'react-native';
import { auth, db } from '../Firestore/firebaseConfig';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WrapInput from '../component/WrapInput';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useNavigation } from '@react-navigation/native';
import CustomBackHeader from '../component/header';

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

  const saveUserToLocal = async (userData) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu vào AsyncStorage:', error);
    }
  };

  const validateEmail = (text) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmail(text);
    setIsValidEmail(emailRegex.test(text));
  };

  const validatePhone = (text) => {
    const phoneRegex = /^0\d{9}$/;
    setPhone(text);
    setIsValidPhone(phoneRegex.test(text));
  };

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
      await setDoc(doc(db, 'users', user.uid), userData);
      console.log("🔥 User đã được ghi vào Firestore:", userData);
      await saveUserToLocal(userData);
      Alert.alert('Thành công', 'Đăng ký thành công!');
      setTimeout(() => {
        navigation.replace('Login'); // hoặc navigate
      }, 300); // chờ 300ms để Alert hiển thị xong
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
        name,
        email,
        phone,
        createdAt: serverTimestamp()
      };

      await setDoc(doc(db, 'users', user.uid), userData, { merge: true });
      await saveUserToLocal(userData);

      Alert.alert('Thành công', 'Đăng nhập bằng Google thành công!');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Google Sign-In Error:', error.code, error.message);
      Alert.alert('Lỗi đăng nhập', `Mã lỗi: ${error.code}\n${error.message}`);
    }
  };

  return (
    <>
      <CustomBackHeader navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Image source={require('../assets/xanh.jpg')} style={styles.headerImage} />

          <Text style={styles.title}>Đăng ký</Text>
          <Text style={styles.subtitle}>Tạo tài khoản</Text>

          <WrapInput placeholder="Họ tên" value={name} onChangeText={setName} />
          <WrapInput
            placeholder="E-mail"
            value={email}
            onChangeText={validateEmail}
            keyboardType="email-address"
            isError={!isValidEmail && email.length > 0}
            errorMessage="Email không hợp lệ!"
          />
          <WrapInput
            placeholder="Số điện thoại"
            value={phone}
            onChangeText={validatePhone}
            keyboardType="phone-pad"
            isError={!isValidPhone && phone.length > 0}
            errorMessage="SĐT phải có 10 số!"
          />
          <WrapInput
            placeholder="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <WrapInput
            placeholder="Xác nhận mật khẩu"
            value={confirmPassword}
            onChangeText={validatePasswordMatch}
            secureTextEntry
            isError={!isMatchPassword && confirmPassword.length > 0}
            errorMessage="Mật khẩu không trùng khớp!"
          />

          <Text style={styles.termsText}>
            Để đăng ký tài khoản, bạn đồng ý{' '}
            <Text style={styles.link}>Terms & Conditions</Text> và{' '}
            <Text style={styles.link}>Privacy Policy</Text>
          </Text>

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Đăng ký</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  headerImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1C',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#6e6e6e',
    marginBottom: 20,
  },
  termsText: {
    fontSize: 12,
    color: '#555',
    marginTop: 6,
    textAlign: 'center',
    marginBottom: 10,
  },
  link: {
    color: '#2e8b57',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#28A745',
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orText: {
    marginVertical: 14,
    color: '#888',
    fontSize: 14,
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#EA4335',
    paddingVertical: 12,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default RegisterScreen;
