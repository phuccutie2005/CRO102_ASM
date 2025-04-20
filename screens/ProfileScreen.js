import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';


const ProfileScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Lấy user từ Redux
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigation.replace('Login');
  };

  return (
    <ScrollView style={styles.container}>


      <View style={styles.profileSection}>
        <Image
          source={{ uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}` }}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.name || 'Chưa đăng nhập'}</Text>
          <Text style={styles.userEmail}>{user?.email || '---'}</Text>
        </View>
      </View>

      {/* các mục khác giữ nguyên */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chung</Text>
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('EditProfile')}>
          <Text style={styles.itemText}>Chỉnh sửa thông tin</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}><Text style={styles.itemText}>Cẩm nang trồng cây</Text></TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('OrderHistory')}>
          <Text style={styles.itemText}>Lịch sử giao dịch</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}><Text style={styles.itemText}>Q & A</Text></TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bảo mật và Điều khoản</Text>
        <TouchableOpacity style={styles.item}><Text style={styles.itemText}>Điều khoản và điều kiện</Text></TouchableOpacity>
        <TouchableOpacity style={styles.item}><Text style={styles.itemText}>Chính sách quyền riêng tư</Text></TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 30,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
  },
  userInfo: {
    marginLeft: 15,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  userEmail: {
    color: '#888',
    fontSize: 14,
  },
  section: {
    marginBottom: 20,
    borderTopWidth: 0.5,
    borderTopColor: '#ccc',
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 13,
    color: '#999',
    marginBottom: 10,
  },
  item: {
    paddingVertical: 10,
  },
  itemText: {
    fontSize: 15,
  },
  logoutButton: {
    marginTop: 10,
    paddingVertical: 15,
  },
  logoutText: {
    color: 'red',
    fontSize: 15,
  },
});

export default ProfileScreen;
