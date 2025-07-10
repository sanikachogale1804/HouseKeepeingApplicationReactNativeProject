import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import FloorDataScreen from './screens/FloorDataScreen';

export type RootStackParamList = {
  Login: undefined;
  FloorData: { user: any }; // or proper type instead of 'any'
};

const Stack = createNativeStackNavigator();

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
