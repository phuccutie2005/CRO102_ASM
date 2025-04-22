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
import { db } from '../Firestore/firebaseConfig';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import CustomBackHeader from '../component/header';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const EditProfileScreen = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [avatar, setAvatar] = useState(null);

    const auth = getAuth();
    const user = auth.currentUser;
    const storage = getStorage();

    const [isProcessing, setIsProcessing] = useState(false);

    const pickImage = async () => {
        if (isProcessing) return; // Nếu đang xử lý, không làm gì
        setIsProcessing(true); // Đánh dấu là đang xử lý

        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("Bạn cần cho phép truy cập thư viện ảnh!");
            setIsProcessing(false); // Xử lý xong, cho phép lại
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            const selectedAsset = result.assets[0];
            if (selectedAsset?.uri) {
                const response = await fetch(selectedAsset.uri);
                const blob = await response.blob();

                const avatarRef = ref(storage, `avatars/${user.uid}.jpg`);
                await uploadBytes(avatarRef, blob);

                const downloadURL = await getDownloadURL(avatarRef);
                setAvatar(downloadURL);
            }
        }

        setIsProcessing(false); // Xử lý xong, cho phép lại
    };


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
                        setAvatar(data.avatar || null);
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
                const userDoc = doc(db, 'users', user.uid);
                await setDoc(userDoc, {
                    name,
                    email,
                    address,
                    phone,
                    avatar,
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

            <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
                <Image
                    source={avatar ? { uri: avatar } : require('../assets/icon.png')}
                    style={styles.avatar}
                />
            </TouchableOpacity>

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
                    editable={false}
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
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        resizeMode: 'cover',
    },
    imageContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
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
