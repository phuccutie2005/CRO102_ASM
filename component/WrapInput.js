import React, { useState } from 'react';
import { TextInput, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons'; // Import icon

const WrapInput = ({
    placeholder,
    value,
    onChangeText,
    keyboardType,
    secureTextEntry,
    isError = false,
    errorMessage = ''
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(secureTextEntry);

    return (
        <View style={styles.container}>
            <View style={[
                styles.inputContainer,
                isFocused && styles.inputFocus,
                isError && styles.inputError
            ]}>
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    keyboardType={keyboardType}
                    secureTextEntry={isPasswordVisible}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
                {secureTextEntry && (
                    <TouchableOpacity
                        style={styles.icon}
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                        <Ionicons
                            name={isPasswordVisible ? 'eye-off' : 'eye'}
                            size={20}
                            color="#888"
                        />
                    </TouchableOpacity>
                )}
            </View>
            {isError && <Text style={styles.errorText}>{errorMessage}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    inputContainer: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 10,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
    inputFocus: {
        borderColor: '#007bff',
        borderWidth: 2,
    },
    inputError: {
        borderColor: 'red',
        borderWidth: 2,
    },
    icon: {
        padding: 10,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
    },
});

export default WrapInput;
