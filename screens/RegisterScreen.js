import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import WrapInput from '../component/WrapInput'; // Import WrapInput

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isValidPhone, setIsValidPhone] = useState(false);
  const [isMatchPassword, setIsMatchPassword] = useState(true);

  // ✅ Kiểm tra định dạng email
  const validateEmail = (text) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmail(text);
    setIsValidEmail(emailRegex.test(text));
  };

  // ✅ Kiểm tra số điện thoại hợp lệ
  const validatePhone = (text) => {
    const phoneRegex = /^0\d{9}$/; // Bắt đầu bằng 0, tổng cộng 10 số
    setPhone(text);
    setIsValidPhone(phoneRegex.test(text));
  };

  // ✅ Kiểm tra mật khẩu trùng khớp
  const validatePasswordMatch = (text) => {
    setConfirmPassword(text);
    setIsMatchPassword(text === password);
  };

  const handleRegister = async () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (!isValidEmail) {
      alert('Email không hợp lệ!');
      return;
    }

    if (!isValidPhone) {
      alert('Số điện thoại phải bắt đầu bằng số 0 và có đúng 10 số!');
      return;
    }

    if (!isMatchPassword) {
      alert('Mật khẩu xác nhận không trùng khớp!');
      return;
    }

    const userData = { name, email, phone, password };
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    alert('Đăng ký thành công! Giờ bạn có thể đăng nhập.');
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/nahida.png')} style={styles.headerImage} />
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
        errorMessage="Số điện thoại phải bắt đầu từ 0 và có 10 số!"
      />
      <WrapInput placeholder="Mật khẩu" value={password} onChangeText={setPassword} secureTextEntry />
      <WrapInput
        placeholder="Xác nhận mật khẩu"
        value={confirmPassword}
        onChangeText={validatePasswordMatch}
        secureTextEntry
        isError={!isMatchPassword && confirmPassword.length > 0}
        errorMessage="Mật khẩu không trùng khớp!"
      />

      <Text style={styles.termsText}>
        Để đăng ký tài khoản, bạn đồng ý với {' '}
        <Text style={styles.linkText}>Điều khoản</Text> và {' '}
        <Text style={styles.linkText}>Chính sách bảo mật</Text>
      </Text>

      <TouchableOpacity
        style={[
          styles.button,
          { opacity: isValidEmail && isValidPhone && isMatchPassword ? 1 : 0.5 },
        ]}
        onPress={handleRegister}
        disabled={!isValidEmail || !isValidPhone || !isMatchPassword}
      >
        <Text style={styles.buttonText}>Đăng ký</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>Hoặc</Text>

      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="google" size={24} color="#DB4437" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="facebook" size={24} color="#4267B2" />
        </TouchableOpacity>
      </View>

      <View style={styles.loginContainer}>
        <Text style={styles.normalText}>Tôi đã có tài khoản </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>Đăng nhập</Text>
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
    height: 120,
    resizeMode: 'cover',
    borderBottomLeftRadius: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  termsText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
  },
  linkText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#28A745',
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
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  socialButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 25,
    marginHorizontal: 10,
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  normalText: {
    fontSize: 14,
    color: 'black',
  },
  loginText: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
