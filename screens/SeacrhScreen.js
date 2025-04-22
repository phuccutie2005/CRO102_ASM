import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const SearchScreen = () => {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [recentSearches, setRecentSearches] = useState([
        'Spider Plant',
        'Song of India',
    ]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    const products = useSelector((state) => state.products.products);
    const pots = useSelector((state) => state.products.pots); // 👉 thêm dòng này
    useEffect(() => {
        console.log('Products:', products);
        console.log('Pots:', pots);
        if (searchQuery.trim() === '') {
            setFilteredProducts([]);
        } else {
            const allItems = [...products, ...pots];
            console.log('All items:', allItems); // Kiểm tra tất cả items
            const filtered = allItems.filter((item) =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredProducts(filtered);
        }
    }, [searchQuery, products, pots]);


    const handleDelete = (item) => {
        setRecentSearches(prev => prev.filter(term => term !== item));
    };

    const renderHistoryItem = ({ item }) => (
        <View style={styles.historyItem}>
            <Ionicons name="time-outline" size={18} style={styles.icon} />
            <Text style={styles.historyText}>{item}</Text>
            <TouchableOpacity onPress={() => handleDelete(item)}>
                <Ionicons name="close" size={20} color="black" />
            </TouchableOpacity>
        </View>
    );

    const renderProductItem = ({ item }) => (
        <TouchableOpacity
            style={styles.resultItem}
            onPress={() => navigation.navigate('DetailProduct', { product: item })}
        >
            <Image source={{ uri: item.image }} style={styles.resultImage} />
            <View>
                <Text style={styles.resultName}>{item.name}</Text>
                <Text style={styles.resultPrice}>{item.price}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Search Bar */}
            <View style={styles.searchBar}>
                <TextInput
                    style={styles.input}
                    placeholder="Tìm kiếm"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <Ionicons name="search" size={20} />
            </View>

            {/* Show result if any, else show history */}
            {filteredProducts.length > 0 ? (
                <FlatList
                    data={filteredProducts}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderProductItem}
                />

            ) : (
                <>
                    <Text style={styles.recentTitle}>Tìm kiếm gần đây</Text>
                    <FlatList
                        data={recentSearches}
                        keyExtractor={(item) => item}  // Dùng giá trị item làm key
                        renderItem={renderHistoryItem}
                    />

                </>
            )}
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 40,
        backgroundColor: '#fff',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 20,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
    recentTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    icon: {
        marginRight: 10,
    },
    historyText: {
        flex: 1,
        fontSize: 16,
    },
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
    },
    resultImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
    },
    resultName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    resultPrice: {
        color: '#27ae60',
        fontWeight: '600',
        marginTop: 4,
    },
});

export default SearchScreen;
