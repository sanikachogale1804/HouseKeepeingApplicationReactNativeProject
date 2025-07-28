import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './screens/LoginScreen';
import FloorDataScreen from './screens/FloorDataScreen';
import { ActivityIndicator, View } from 'react-native';


export type RootStackParamList = {
  Login: undefined;
  FloorData: { user: any }; // Use specific type if available
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [initialRoute, setInitialRoute] = useState<'Login' | 'FloorData' | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        if (token) {
          setInitialRoute('FloorData');
        } else {
          setInitialRoute('Login');
        }
      } catch (error) {
        console.error('Error checking token:', error);
        setInitialRoute('Login');
      }
    };
    checkToken();
  }, []);

  if (initialRoute === null) {
    // Show loading indicator while checking token
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // App.tsx
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="FloorData" component={FloorDataScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );

}
