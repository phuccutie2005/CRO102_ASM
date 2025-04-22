import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Alert, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import { loginSuccess, setRememberMe } from '../redux/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WrapInput from '../component/WrapInput';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { auth } from '../Firestore/firebaseConfig';
import { GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword } from 'firebase/auth';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState(false);

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

  const validateEmail = (text) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmail(text);
    setIsValidEmail(emailRegex.test(text));
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userData = {
        uid: user.uid,
        email: user.email,
        name: user.displayName || '',
        phone: user.phoneNumber || '',
      };

      // Lưu trạng thái vào AsyncStorage
      await AsyncStorage.setItem('rememberMe', remember.toString());
      if (remember) {
        await AsyncStorage.setItem('user', JSON.stringify(userData));
      } else {
        await AsyncStorage.removeItem('user');
      }

      dispatch(setRememberMe(remember));
      dispatch(loginSuccess(userData));
      navigation.replace('Home');
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      setError(true);
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
      };

      await AsyncStorage.setItem('rememberMe', remember.toString());
      if (remember) {
        await AsyncStorage.setItem('user', JSON.stringify(userData));
      } else {
        await AsyncStorage.removeItem('user');
      }

      dispatch(setRememberMe(remember));
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
      <ImageBackground source={require('../assets/xanh.jpg')} style={styles.headerImage} imageStyle={{ borderBottomLeftRadius: 50, borderBottomRightRadius: 50 }} />
      <Text style={styles.title}>Chào mừng bạn</Text>
      <Text style={styles.subtitle}>Đăng nhập tài khoản</Text>

      <WrapInput
        placeholder="Nhập email hoặc số điện thoại"
        value={email}
        onChangeText={validateEmail}
        keyboardType="email-address"
        isError={!isValidEmail && email.length > 0}
        errorMessage="Email không hợp lệ!"
      />

      <WrapInput
        placeholder="Mật khẩu"
        value={password}
        onChangeText={(text) => { setPassword(text); setError(false); }}
        secureTextEntry
        isError={error}
        errorMessage="Sai email hoặc mật khẩu. Thử lại!"
        editable={isValidEmail}
        style={!isValidEmail && { backgroundColor: '#f0f0f0' }}
      />

      <View style={styles.rowContainer}>
        <TouchableOpacity style={styles.rememberContainer} onPress={() => setRemember(!remember)}>
          <Ionicons name={remember ? "checkmark-circle" : "ellipse-outline"} size={20} color="green" />
          <Text style={styles.rememberText}>Nhớ tài khoản</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => alert("Chức năng chưa làm")}>
          <Text style={styles.forgotText}>Forgot Password ?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.loginButton, { opacity: isValidEmail ? 1 : 0.5 }]}
        onPress={handleLogin}
        disabled={!isValidEmail}
      >
        <Text style={styles.loginText}>Đăng nhập</Text>
      </TouchableOpacity>

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.orText}>Hoặc</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.socialRow}>
        <TouchableOpacity onPress={() => promptAsync()}>
          <Image source={require('../assets/google_logo.webp')} style={styles.socialIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => alert("Login Facebook chưa làm")}>
          <Image source={require('../assets/logofb.webp')} style={styles.socialIcon} />
        </TouchableOpacity>
      </View>

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
  container: { flex: 1, padding: 20, backgroundColor: 'white', alignItems: 'center' },
  headerImage: { width: '100%', height: 180 },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 20 },
  subtitle: { fontSize: 16, color: 'gray', marginBottom: 20 },
  rowContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  rememberContainer: { flexDirection: 'row', alignItems: 'center' },
  rememberText: { marginLeft: 5 },
  forgotText: { color: 'green' },
  loginButton: { backgroundColor: 'green', padding: 12, borderRadius: 8, width: '100%', alignItems: 'center', marginTop: 15 },
  loginText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 15, width: '100%' },
  line: { flex: 1, height: 1, backgroundColor: 'green' },
  orText: { marginHorizontal: 8, color: 'gray' },
  socialRow: { flexDirection: 'row', gap: 20 },
  socialIcon: { width: 40, height: 40 },
  signupContainer: { flexDirection: 'row', marginTop: 20 },
  signupText: { color: 'gray' },
  signupLink: { color: 'green', fontWeight: 'bold' },
});

export default LoginScreen;
