import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import CustomBackHeader from '../component/header';
import { useNavigation } from '@react-navigation/native';

const faqData = [
    {
        question: 'Tôi trộn các chất dinh dưỡng theo thứ tự nào?',
        answer: 'Bạn nên pha theo hướng dẫn trên bao bì từng loại, bắt đầu từ chất có pH thấp nhất.'
    },
    {
        question: 'Tôi có thể giữ dung dịch dinh dưỡng hỗn hợp trong bao lâu?',
        answer: 'Thông thường trong 5-7 ngày nếu được bảo quản trong môi trường mát mẻ, tránh ánh nắng.'
    },
    {
        question: 'Khi nào tôi thêm bộ điều chỉnh pH?',
        answer: 'Sau khi đã pha xong tất cả các chất dinh dưỡng.'
    },
    {
        question: 'Các chất điều chỉnh tăng trưởng có được sử dụng trong các sản phẩm Planta không?',
        answer: 'Không. Planta cam kết không sử dụng chất điều chỉnh tăng trưởng nhân tạo.'
    },
    {
        question: 'Các sản phẩm Planta có phải là hữu cơ không?',
        answer: 'Planta có một số dòng sản phẩm hữu cơ, bạn có thể xem chi tiết trên nhãn.'
    },
];

// AccordionItem tái sử dụng từ dự án chính
const AccordionItem = ({ title, children }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <View style={styles.itemContainer}>
            <TouchableOpacity
                onPress={() => setExpanded(!expanded)}
                style={styles.header}
                activeOpacity={0.8}
            >
                <Text style={styles.questionText}>{title}</Text>
                <AntDesign name={expanded ? 'up' : 'down'} size={16} color="#333" />
            </TouchableOpacity>

            {expanded && <View style={styles.answerBox}>
                <Text style={styles.answerText}>{children}</Text>
            </View>}
        </View>
    );
};

export default function FAQScreen() {
    const navigation = useNavigation();

    return (
        <>
            <CustomBackHeader navigation={navigation} />
            <ScrollView style={styles.container}>
                <Text style={styles.pageTitle}>Câu hỏi thường gặp</Text>
                {faqData.map((item, index) => (
                    <AccordionItem key={index} title={item.question}>
                        {item.answer}
                    </AccordionItem>
                ))}
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    pageTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1E5631',
        marginBottom: 20,
    },
    itemContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingVertical: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    questionText: {
        fontSize: 15,
        color: '#333',
        flex: 1,
        paddingRight: 12,
    },
    answerBox: {
        marginTop: 8,
    },
    answerText: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
    },
});
