import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import CustomBackHeader from '../component/header';
import { useNavigation } from '@react-navigation/native';

const AccordionItem = ({ title, children, defaultExpanded = false }) => {
    const [expanded, setExpanded] = useState(defaultExpanded);

    return (
        <View style={styles.accordionItem}>
            <TouchableOpacity
                onPress={() => setExpanded(!expanded)}
                style={styles.accordionHeader}
                activeOpacity={0.8}
            >
                <Text style={styles.accordionTitle}>{title}</Text>
                <AntDesign name={expanded ? 'up' : 'down'} size={16} color="#333" />
            </TouchableOpacity>
            {expanded && <View style={styles.accordionContent}>{children}</View>}
        </View>
    );
};

export default function PlantDetailScreen() {
    const navigation = useNavigation();

    const [showBasics, setShowBasics] = useState(false);
    const [showStages, setShowStages] = useState(false);

    return (
        <>
            <CustomBackHeader navigation={navigation} />
            <ScrollView style={styles.container}>
                {/* Hình ảnh cây */}
                <Image
                    source={require('../assets/cay.jpg')} // đổi path tùy ảnh bạn lưu
                    style={styles.plantImage}
                    resizeMode="contain"
                />

                {/* Tag buttons */}
                <View style={styles.tagsContainer}>
                    <View style={styles.tag}><Text style={styles.tagText}>Cây trồng</Text></View>
                    <View style={styles.tag}><Text style={styles.tagText}>Ưa bóng</Text></View>
                </View>

                {/* Kiến thức cơ bản */}
                <TouchableOpacity
                    style={styles.sectionHeader}
                    onPress={() => setShowBasics(!showBasics)}
                    activeOpacity={0.8}
                >
                    <Text style={styles.sectionTitle}>Kiến thức cơ bản</Text>
                    <AntDesign name={showBasics ? "minus" : "plus"} size={16} color="green" />
                </TouchableOpacity>

                {showBasics && (
                    <>
                        <AccordionItem title="Bước 1: Chuẩn bị vật dụng, chất trồng">
                            <Text style={styles.contentText}>
                                🔧 Chuẩn bị khay gieo, đất sạch, hạt giống và bình tưới.
                            </Text>
                        </AccordionItem>

                        <AccordionItem title="Bước 2: Tiến hành gieo hạt">
                            <Text style={styles.contentText}>
                                🌱 Gieo hạt cách nhau khoảng 2cm, phủ lớp đất mỏng và tưới ẩm nhẹ.
                            </Text>
                        </AccordionItem>

                        <AccordionItem title="Bước 3: Chăm sóc sau khi gieo hạt">
                            <Text style={styles.contentText}>
                                💦 Đặt ở nơi mát, tưới nước đều mỗi ngày, tránh ánh nắng gắt.
                            </Text>
                        </AccordionItem>
                    </>
                )}

                {/* Các giai đoạn */}
                <TouchableOpacity
                    style={[styles.sectionHeader, { marginTop: 12 }]}
                    onPress={() => setShowStages(!showStages)}
                    activeOpacity={0.8}
                >
                    <Text style={styles.sectionTitle}>Các giai đoạn</Text>
                    <AntDesign name={showStages ? "minus" : "plus"} size={16} color="green" />
                </TouchableOpacity>

                {showStages && (
                    <>
                        <AccordionItem title="1. Ngâm Hạt và Ủ Hạt (48 tiếng)" defaultExpanded>
                            <Text style={styles.contentText}>💧 Ngâm hạt trong nước ấm và ủ trong khăn ẩm để kích thích nảy mầm.</Text>
                        </AccordionItem>

                        <AccordionItem title="2. Nảy Mầm (3-5 ngày)">
                            <Text style={styles.contentText}>🌱 Hạt bắt đầu nứt vỏ, mọc rễ và chồi non đầu tiên.</Text>
                        </AccordionItem>

                        <AccordionItem title="3. Bắt Đầu Phát Triển (2-3 tuần)">
                            <Text style={styles.contentText}>🌿 Cây non phát triển thân chính và những lá đầu tiên.</Text>
                        </AccordionItem>

                        <AccordionItem title="4. Trưởng Thành (4-6 tuần)">
                            <Text style={styles.contentText}>🌼 Cây phát triển đầy đủ, cứng cáp và ổn định.</Text>
                        </AccordionItem>

                        <AccordionItem title="5. Ra Hoa (4-6 tuần)">
                            <Text style={styles.contentText}>
                                🌸 Cây bắt đầu ra hoa nếu đủ điều kiện:
                                {'\n'}- Nhiệt độ: 24-30°C
                                {'\n'}- Độ ẩm: 50-65%
                            </Text>
                        </AccordionItem>
                    </>
                )}
            </ScrollView>
        </>
    );
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
        paddingHorizontal: 16,
    },
    plantImage: {
        width: '100%',
        height: 220,
        marginVertical: 16,
    },
    tagsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    tag: {
        backgroundColor: '#E6F0E9',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    tagText: {
        color: '#1E5631',
        fontWeight: '500',
        fontSize: 14,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E5631',
    },
    subTitle: {
        fontSize: 15,
        fontWeight: '500',
        marginBottom: 10,
        color: '#333',
    },
    accordionItem: {
        marginBottom: 12,
    },
    accordionHeader: {
        backgroundColor: '#F3F4F6',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    accordionTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    accordionContent: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 12,
        marginTop: 4,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    contentText: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
    },
});
