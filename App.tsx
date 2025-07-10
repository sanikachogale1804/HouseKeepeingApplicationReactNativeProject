import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';

// Import your screens
import LoginScreen from './screens/LoginScreen';
import FloorDataScreen from './screens/FloorDataScreen';

// Enable native screen optimizations
enableScreens();

// Define types for navigation
export type RootStackParamList = {
  Login: undefined;
  FloorData: { user: any }; // You can replace `any` with a proper user type
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="FloorData" component={FloorDataScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
