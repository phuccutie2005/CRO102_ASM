import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CustomersScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Customers Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default CustomersScreen;
