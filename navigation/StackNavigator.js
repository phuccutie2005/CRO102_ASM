import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import BottomTabNavigator from './BottomTabNavigator';
import DetailProductScreen from '../screens/DetailsProductScreen';
import PaymentScreen from '../screens/PaymentScreen';
import EditProfileScreen from '../screens/EditProfile';
import OrderHistory from '../screens/OrderHistory';
import NoticationOrder from '../screens/NotificationOrder';
import GardeningHandbook from '../screens/GardeningHandbook';
import QAQuestion from '../screens/QAQuestion';
import MoreProductScreen from '../screens/MoreProduct';
import MorePotScreen from '../screens/MorePotProduct';
import SplashScreen from '../Splash/SplashScreen';
const Stack = createStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Home" component={BottomTabNavigator} />
      <Stack.Screen name="DetailProduct" component={DetailProductScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="OrderHistory" component={OrderHistory} options={{ headerShown: false }} />
      <Stack.Screen name="NoticationOrder" component={NoticationOrder} options={{ headerShown: false }} />
      <Stack.Screen name="GardeningHandbook" component={GardeningHandbook} options={{ headerShown: false }} />
      <Stack.Screen name="QAQuestion" component={QAQuestion} options={{ headerShown: false }} />
      <Stack.Screen name="MoreProductScreen" component={MoreProductScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MorePotScreen" component={MorePotScreen} options={{ headerShown: false }} />

    </Stack.Navigator>

  );
}
