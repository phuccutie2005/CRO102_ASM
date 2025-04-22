import React, { useEffect } from 'react';
import { View, Image, Text, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
    const navigation = useNavigation();
    const fadeAnim = new Animated.Value(0);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
        }).start();

        const timeout = setTimeout(() => {
            navigation.replace('Login'); // hoặc 'Home' nếu muốn auto vào
        }, 2500);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
                <Image source={require('../assets/nahida.png')} style={styles.logo} />
                <Text style={styles.text}>Green Garden</Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    text: {
        fontSize: 22,
        fontWeight: '600',
        color: '#4CAF50',
    },
});

export default SplashScreen;
