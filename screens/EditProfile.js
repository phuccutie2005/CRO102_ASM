import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../Firestore/firebaseConfig'; // Sửa lại đường dẫn theo dự án của bạn
import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';  // Các hàm Firestore
import CustomBackHeader from '../component/header';
import { useNavigation } from '@react-navigation/native';

const EditProfileScreen = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');

    const auth = getAuth();
    const user = auth.currentUser;

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                try {
                    const docRef = doc(db, 'users', user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setName(data.name || '');
                        setEmail(user.email || '');
                        setAddress(data.address || '');
                        setPhone(data.phone || '');
                    }
                } catch (error) {
                    console.error('Lỗi khi lấy dữ liệu người dùng:', error);
                }
            }
        };

        fetchUserData();
    }, [user]);

    const handleSave = async () => {
        try {
            if (user) {
                const userDoc = doc(db, 'users', user.uid); // Lưu vào document của người dùng
                await setDoc(userDoc, {
                    name,
                    email,
                    address,
                    phone,
                });

                alert('Thông tin đã được lưu!');
            }
        } catch (error) {
            console.error('Lỗi khi lưu thông tin:', error);
            alert('Có lỗi xảy ra khi lưu thông tin.');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <CustomBackHeader navigation={navigation} />

            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Checkerboard_pattern.svg/2048px-Checkerboard_pattern.svg.png' }}
                    style={styles.image}
                />
            </View>

            <Text style={styles.infoNote}>
                <Text style={{ color: '#2ecc71' }}>Thông tin đã được lưu cho lần mua kế tiếp.</Text>{'\n'}
                Bấm vào thông tin chi tiết để chỉnh sửa.
            </Text>

            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Họ và tên"
                />
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    placeholder="Email"
                    editable={false} // Email không cho phép chỉnh sửa
                />
                <TextInput
                    style={styles.input}
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Địa chỉ"
                />
                <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    placeholder="Số điện thoại"
                />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>LƯU THÔNG TIN</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        paddingBottom: 10,
    },
    headerTitle: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    imageContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    image: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
    },
    infoNote: {
        textAlign: 'center',
        fontSize: 13,
        color: '#333',
        marginVertical: 10,
        paddingHorizontal: 20,
    },
    form: {
        paddingHorizontal: 20,
    },
    input: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 10,
        fontSize: 14,
        marginBottom: 20,
    },
    saveButton: {
        marginTop: 30,
        marginHorizontal: 20,
        backgroundColor: '#aaa',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default EditProfileScreen;
