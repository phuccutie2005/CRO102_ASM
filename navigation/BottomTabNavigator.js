import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import ProductsScreen from '../screens/ProductsScreen';
import CustomersScreen from '../screens/NotificationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SearchScreen from '../screens/SeacrhScreen';
import CartScreen from '../screens/CartScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Trang chủ"
        component={ProductsScreen}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Tìm kiếm"
        component={SearchScreen}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="search-outline" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Giỏ hàng"
        component={CartScreen}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="cart" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Thông báo"
        component={CustomersScreen}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="notifications-outline" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} /> }}
      />
    </Tab.Navigator>
  );
}
