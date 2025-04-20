import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomBackHeader from '../component/header';

const tabs = ['Tất cả', 'Gốm sứ', 'Nhựa', 'Xi măng'];

const fakePots = [
    {
        id: 1,
        name: 'Chậu gốm tròn nhỏ',
        material: 'Gốm sứ',
        price: '120.000đ',
        image: 'https://yeucay.vn/wp-content/uploads/2018/03/su-tron-trang_chaucay.jpg',
    },
    {
        id: 2,
        name: 'Chậu nhựa hình vuông',
        material: 'Nhựa',
        price: '45.000đ',
        image: 'https://yeucay.vn/wp-content/uploads/2017/12/nhua-vuong.jpg',
    },
    {
        id: 3,
        name: 'Chậu xi măng tròn lớn',
        material: 'Xi măng',
        price: '250.000đ',
        image: 'https://caycanh4mua.com/UserFile/Product/chau-xi-mang-tron-hoa-tiet-duong-kinh-1m-1m2-1m5.jpg',
    },
    {
        id: 4,
        name: 'Chậu gốm sứ vẽ tay',
        material: 'Gốm sứ',
        price: '180.000đ',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8CoSud0E1Fe_EMX7h5GmiqNtb9uY_xuuUXA&s',
    },
    {
        id: 5,
        name: 'Chậu nhựa màu pastel',
        material: 'Nhựa',
        price: '60.000đ',
        image: 'https://vietnhatplastic.com/Data/Sites/1/Product/581/chau3t8-2.jpg',
    },
    {
        id: 6,
        name: 'Planta Lemon Balm',
        material: 'Nhựa',
        price: '250.000đ',
        image: 'https://cmtgarden.com/wp-content/uploads/2019/06/kim-tien-chau-vuong-xi-mang-1.jpg',
    },
    {
        id: 7,
        name: 'Planta Rosewood',
        material: 'Nhựa',
        price: '250.000đ',
        image: 'https://cayxanhphonghong.com/img_data/images/cach-chon-chau-trong-cay.jpg',
    },
    {
        id: 8,
        name: 'Planta Dove Grey',
        material: 'Nhựa',
        price: '250.000đ',
        image: 'https://hoasenviet.net/uploads/photos/1688089492_2908_846709f8b3df9fa3b9f88735e81d806c.jpg',
    },
];

const MorePotScreen = () => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('Tất cả');

    const filteredPots =
        activeTab === 'Tất cả'
            ? fakePots
            : fakePots.filter((item) => item.material.includes(activeTab));

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('DetailProduct', { product: item })}
        >
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.light}>{item.material}</Text>
            <Text style={styles.price}>{item.price}</Text>
        </TouchableOpacity>
    );

    return (
        <>
            <CustomBackHeader navigation={navigation} />
            <View style={styles.container}>
                <View style={styles.tabContainer}>
                    {tabs.map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            style={[
                                styles.tab,
                                activeTab === tab && styles.activeTab,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    activeTab === tab && styles.activeTabText,
                                ]}
                            >
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <FlatList
                    data={filteredPots}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    numColumns={2}
                    contentContainerStyle={styles.list}
                />
            </View>
        </>
    );
};

export default MorePotScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingHorizontal: 16,
        marginBottom: 10,
        gap: 8,
        flexWrap: 'wrap',
    },
    tab: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: '#eee',
    },
    activeTab: {
        backgroundColor: '#2ecc71',
    },
    tabText: {
        fontSize: 13,
        color: '#555',
    },
    activeTabText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    list: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    card: {
        flex: 1,
        margin: 8,
        backgroundColor: '#fafafa',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginBottom: 8,
    },
    name: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 14,
    },
    light: {
        fontSize: 12,
        color: '#777',
    },
    price: {
        fontSize: 14,
        color: '#27ae60',
        fontWeight: '600',
    },
});
