import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WrapInput from '../component/WrapInput';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { auth } from '../Firestore/firebaseConfig';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState(false);

  // Google Auth
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '170843770861-d3gfhadfl1n3c7rb41m6qkka8v98gnlv.apps.googleusercontent.com',
    androidClientId: '170843770861-i13pc447m28mti4lcp3mq5uevdt9mvtf.apps.googleusercontent.com',
    redirectUri: 'https://auth.expo.io/@phuckaido2k5/ASM1',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      handleGoogleSignIn(credential);
    }
  }, [response]);

  // Kiểm tra định dạng email
  const validateEmail = (text) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmail(text);
    setIsValidEmail(emailRegex.test(text)); // True nếu đúng định dạng
  };

  // Xử lý đăng nhập thường
  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userData = {
        uid: user.uid,
        email: user.email,
        name: user.displayName || '', // Firebase có thể không lưu name
        phone: user.phoneNumber || '',
      };

      await AsyncStorage.setItem('user', JSON.stringify(userData));
      dispatch(loginSuccess(userData));

      Alert.alert('Thành công', 'Đăng nhập thành công!');
      navigation.replace('Home');
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      Alert.alert('Lỗi', 'Sai email hoặc mật khẩu.');
    }
  };

  // Xử lý đăng nhập Google
  const handleGoogleSignIn = async (credential) => {
    try {
      const userCredential = await signInWithCredential(auth, credential);
      const user = userCredential.user;

      const userData = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        phone: user.phoneNumber || '',
      };

      await AsyncStorage.setItem('user', JSON.stringify(userData));
      dispatch(loginSuccess(userData));

      Alert.alert('Thành công', 'Đăng nhập bằng Google thành công!');
      navigation.replace('Home');
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      Alert.alert('Lỗi', 'Đăng nhập Google thất bại.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Hình ảnh nền */}
      <Image source={require('../assets/nahida.png')} style={styles.headerImage} />

      {/* Tiêu đề */}
      <Text style={styles.title}>Chào mừng bạn</Text>
      <Text style={styles.subtitle}>Đăng nhập tài khoản</Text>

      {/* Ô nhập Email */}
      <WrapInput
        placeholder="Email"
        value={email}
        onChangeText={validateEmail}
        keyboardType="email-address"
        isError={!isValidEmail && email.length > 0}
        errorMessage="Email không hợp lệ!"
      />

      {/* Ô nhập Mật khẩu */}
      <WrapInput
        placeholder="Mật khẩu"
        value={password}
        onChangeText={(text) => { setPassword(text); setError(false); }}
        secureTextEntry
        isError={error}
        errorMessage="Sai email hoặc mật khẩu. Thử lại!"
        editable={isValidEmail} // Chặn nhập nếu email sai
        style={!isValidEmail && { backgroundColor: '#f0f0f0' }} // Làm mờ nếu chưa nhập email đúng
      />

      {/* Nhớ tài khoản + Quên mật khẩu */}
      <View style={styles.rowContainer}>
        <TouchableOpacity style={styles.rememberContainer} onPress={() => setRemember(!remember)}>
          <Ionicons name={remember ? "checkmark-circle" : "ellipse-outline"} size={20} color="green" />
          <Text style={styles.rememberText}>Nhớ tài khoản</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => alert("Chức năng chưa làm")}>
          <Text style={styles.forgotText}>Quên mật khẩu?</Text>
        </TouchableOpacity>
      </View>

      {/* Nút Đăng nhập */}
      <TouchableOpacity
        style={[styles.button, { opacity: isValidEmail ? 1 : 0.5 }]}
        onPress={handleLogin}
        disabled={!isValidEmail}
      >
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </TouchableOpacity>

      {/* Hoặc */}
      <Text style={styles.orText}>Hoặc</Text>

      {/* Nút Đăng nhập Google */}
      <TouchableOpacity style={styles.googleButton} onPress={() => promptAsync()}>
        <Ionicons name="logo-google" size={24} color="white" />
        <Text style={styles.googleText}>Đăng nhập với Google</Text>
      </TouchableOpacity>

      {/* Tạo tài khoản */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Bạn không có tài khoản?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.signupLink}> Tạo tài khoản</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  headerImage: {
    width: '100%',
    height: 180,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberText: {
    marginLeft: 5,
    fontSize: 14,
  },
  forgotText: {
    fontSize: 14,
    color: 'green',
  },
  button: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orText: {
    marginVertical: 10,
    color: 'gray',
  },
  googleButton: {
    backgroundColor: '#DB4437',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  googleText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default LoginScreen;
