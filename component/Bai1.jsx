import React from "react";
import { View, Text, StyleSheet } from "react-native";
import CustomHeader from "./header"; // Import CustomHeader


const SectionView = ({ route, navigation }) => {
    return (
        <View style={styles.container}>
            <CustomHeader title="Trang ca nhan " showAvatar={false} navigation={navigation} />
            <View style={styles.spacing} />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        paddingTop: 10,
    },
    spacing: {
        height: 15, // Khoảng cách giữa các header
    },
});

export default SectionView;
