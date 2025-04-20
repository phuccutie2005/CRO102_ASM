import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../Firestore/firebaseConfig';
import { getAuth } from 'firebase/auth';

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState([]);
  const user = getAuth().currentUser;

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;

      console.log('Current User UID:', user.uid); // Kiểm tra user.uid

      try {
        const q = query(
          collection(db, 'notifications'),
          where('userId', '==', user.uid),
          orderBy('date', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Fetched Notifications:", data); // Kiểm tra dữ liệu đã lấy được

        // Nếu có thông báo, cập nhật state
        setNotifications(data);
      } catch (error) {
        console.log('Lỗi khi lấy thông báo:', error);
      }
    };

    fetchNotifications();
  }, [user]); // Sử dụng user làm dependency để fetch lại khi user thay đổi

  const renderItem = ({ item }) => (
    <View style={styles.notificationContainer}>
      <Text style={styles.date}>
        {new Date(item.date?.seconds * 1000).toLocaleDateString('vi-VN', {
          weekday: 'long',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })}
      </Text>
      <View style={styles.itemBox}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.successText}>{item.title}</Text>
          <Text style={styles.productName}>
            {item.productName} | <Text style={styles.description}>{item.description}</Text>
          </Text>
          <Text style={styles.quantity}>{item.quantity} sản phẩm</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>THÔNG BÁO</Text>
      {notifications.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>Hiện chưa có thông báo nào cho bạn</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    marginLeft: 12,
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#555',
  },
  notificationContainer: {
    marginBottom: 16,
  },
  date: {
    fontSize: 13,
    color: '#555',
    marginBottom: 8,
  },
  itemBox: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    elevation: 2,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  successText: {
    color: 'green',
    fontWeight: '600',
    fontSize: 14,
  },
  productName: {
    fontSize: 13,
    marginTop: 2,
  },
  description: {
    color: 'gray',
  },
  quantity: {
    marginTop: 4,
    fontSize: 12,
    color: '#555',
  },
});
