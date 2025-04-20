import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import store from './redux/store';
import StackNavigator from './navigation/StackNavigator';
import { CartProvider } from './screens/CartContext'; // Đường dẫn đến CartContext

export default function App() {
  return (
    <CartProvider>
      <Provider store={store}>
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
      </Provider>
    </CartProvider>
  );
}
