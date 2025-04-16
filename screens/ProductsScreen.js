import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { setProducts } from '../redux/slices/productsSlice';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


const ProductsScreen = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const navigation = useNavigation();
  useEffect(() => {
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
        name: 'Anthurium',
        light: 'Ưa sáng',
        price: '280.000đ',
        image: 'https://soikiengla.com/wp-content/uploads/IMG_0990-scaled.jpg',
      },
      {
        id: 4,
        name: 'Peace Lily',
        light: 'Ưa bóng',
        price: '300.000đ',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEmmdxVQjVmO2RacN2lz-VdArVhWAPa1MA7Q&s',
      },
    ];
    dispatch(setProducts(fakeProducts));
  }, []);
  // Fake data
  const pots = [
    { id: 1, name: 'Planta Trắng', price: '250.000đ', image: 'https://hips.hearstapps.com/hmg-prod/images/blooming-white-flowers-spathiphyllum-royalty-free-image-1722883454.jpg?crop=0.51912xw:1xh;center,top&resize=980:*' },
    { id: 2, name: 'Planta Lemon Balm', price: '250.000đ', image: 'https://bizweb.dktcdn.net/100/392/499/products/lemon-balm-mint-bh-chanh-sa.jpg?v=1594111891147' },
    { id: 3, name: 'Planta Rosewood', price: '250.000đ', image: 'https://sudospaces.com/thichtrongcay/2020/10/small-plant-palm-rosewood-pot-4.jpg' },
    { id: 4, name: 'Planta Dove Grey', price: '250.000đ', image: 'https://vinapot.vn/wp-content/uploads/2024/11/IMG_6180-300x300.jpg' },
  ];

  const comboCare = {
    name: 'Lemon Balm Grow Kit',
    description: 'Gồm: hạt giống Lemon Balm, gói đất hữu cơ, chậu Planta, marker đánh dấu...',
    price: '250.000đ',
    image: 'https://i.ytimg.com/vi/m5pQ8ulRCXY/maxresdefault.jpg',
  };

  const renderItemBasic = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>{item.price}</Text>
    </TouchableOpacity>
  );

  const renderBanner = () => (
    <View style={styles.banner}>
      <View style={styles.bannerText}>
        <Text style={styles.bannerTitle}>Planta - toả sáng</Text>
        <Text style={styles.bannerSub}>không gian nhà bạn</Text>
        <TouchableOpacity style={styles.viewNewBtn}>
          <Text style={styles.viewNewText}>Xem hàng mới về</Text>
          <Ionicons name="arrow-forward" size={16} color="#27ae60" />
        </TouchableOpacity>
      </View>
      <Image
        source={{ uri: 'https://growhoss.com/cdn/shop/files/AdobeStock_562373165.jpg?v=1697046068' }} // ảnh cây trang trí banner
        style={styles.bannerImage}
        resizeMode="contain"
      />
    </View>
  );

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
    <ScrollView style={styles.container}>
      {renderBanner()}
      <Text style={styles.sectionTitle}>Cây trồng</Text>
      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.grid}
        scrollEnabled={false} // vì đang trong ScrollView
      />
      <Text style={styles.sectionTitle}>Chậu cây trồng</Text>
      <FlatList
        data={pots}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItemBasic}
        contentContainerStyle={styles.grid}
        scrollEnabled={false}
      />
      <Text style={styles.sectionTitle}>Combo chăm sóc (mới)</Text>
      <View style={[styles.card, { flexDirection: 'row', alignItems: 'center' }]}>
        <Image source={{ uri: comboCare.image }} style={{ width: 80, height: 80, borderRadius: 10, marginRight: 10 }} />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{comboCare.name}</Text>
          <Text style={{ fontSize: 12, color: '#555', marginVertical: 4 }}>{comboCare.description}</Text>
          <Text style={styles.price}>{comboCare.price}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  banner: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f3fdf6',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bannerSub: {
    fontSize: 16,
    marginBottom: 8,
  },
  viewNewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewNewText: {
    color: '#27ae60',
    marginRight: 4,
    fontWeight: '600',
  },
  bannerImage: {
    width: 100,
    height: 100,
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  grid: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    backgroundColor: '#fafafa',
    borderRadius: 10,
    padding: 10,
    margin: 8,
    alignItems: 'center',
    elevation: 2,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  light: {
    color: '#555',
    fontSize: 12,
  },
  price: {
    color: '#27ae60',
    fontWeight: '600',
    fontSize: 14,
    marginTop: 4,
  },
});

export default ProductsScreen;
