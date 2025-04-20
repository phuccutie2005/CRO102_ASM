import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CustomBackHeader from '../component/header';


const tabs = ['Tất cả', 'Hàng mới về', 'Ưa sáng', 'Ưa bóng'];

const fakeProducts = [
    {
        id: 1,
        name: 'Spider Plant',
        light: 'Ưa bóng',
        price: '250.000đ',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyENXcdKeWPJOnC_VchwKq3JHV3uALXQfiww&s',
    },
    {
        id: 2,
        name: 'Song of India',
        light: 'Ưa sáng',
        price: '250.000đ',
        image: 'https://vn.plantsfarm.com/uploads/202237056/song-of-india-dracaena-reflexa-song-of-india08433376828.jpg',
    },
    {
        id: 3,
        name: 'Pink Anthurium',
        light: 'Ưa bóng',
        price: '250.000đ',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZUXpU6306TjKn-wzix0NSquaO_kfZBIkJVA&s',
    },
    {
        id: 4,
        name: 'Black Love Anthurium',
        light: 'Ưa bóng',
        price: '250.000đ',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSh4y-Hm9WMOvb9Ak1WS6pspAlVdJ4dO7GZw&s',
    },
    {
        id: 5,
        name: 'Grey Star Calathea',
        light: 'Ưa sáng',
        price: '250.000đ',
        image: 'https://vn.plantsfarm.com/uploads/202237056/calathea-silver-star09263971807.jpg',
    },
    {
        id: 6,
        name: 'Banana Plant',
        light: 'Ưa sáng',
        price: '250.000đ',
        image: 'https://cdn.britannica.com/92/13192-050-6644F8C3/bananas-bunch.jpg',
    },
];

const MoreProductScreen = () => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('Tất cả');

    const filteredProducts =
        activeTab === 'Tất cả'
            ? fakeProducts
            : fakeProducts.filter((item) => item.light.includes(activeTab));

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('DetailProduct', { product: item })}
        >
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.light}>{item.light}</Text>
            <Text style={styles.price}>{item.price}</Text>
        </TouchableOpacity>
    );

    return (
        <>
            <CustomBackHeader navigation={navigation} />
            <View style={styles.container}>
                {/* Header */}


                {/* Tabs */}
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

                {/* Product List */}
                <FlatList
                    data={filteredProducts}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    numColumns={2}
                    contentContainerStyle={styles.list}
                />
            </View>
        </>
    );
};

export default MoreProductScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
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
