import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WrapInput from '../component/WrapInput';
import Ionicons from '@expo/vector-icons/Ionicons';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();

  // Kiểm tra định dạng email
  const validateEmail = (text) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmail(text);
    setIsValidEmail(emailRegex.test(text)); // True nếu đúng định dạng
  };

  // Xử lý đăng nhập
  const handleLogin = async () => {
    const storedUser = await AsyncStorage.getItem('user');

    if (storedUser) {
      const { email: savedEmail, password: savedPassword } = JSON.parse(storedUser);

      if (email === savedEmail && password === savedPassword) {
        dispatch(loginSuccess(email));
        navigation.replace('Home');
      } else {
        setError(true);
      }
    } else {
      alert('Không tìm thấy tài khoản, vui lòng đăng ký.');
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

      {/* Nút Đăng nhập Google & Facebook */}
      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Ionicons name="logo-google" size={24} color="red" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Ionicons name="logo-facebook" size={24} color="blue" />
        </TouchableOpacity>
      </View>

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
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialButton: {
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 50,
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  signupText: {
    color: 'gray',
  },
  signupLink: {
    color: 'green',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
