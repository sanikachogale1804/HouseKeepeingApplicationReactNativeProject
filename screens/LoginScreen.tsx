import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../App';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const loadSavedCredentials = async () => {
      try {
        const savedUsername = await AsyncStorage.getItem('savedUsername');
        const savedPassword = await AsyncStorage.getItem('savedPassword');
        if (savedUsername) setUsername(savedUsername);
        if (savedPassword) setPassword(savedPassword);
      } catch (e) {
        console.error('🔐 Failed to load saved credentials:', e);
      }
    };
    loadSavedCredentials();
  }, []);

  const handleLogin = async () => {

    try {
      const localhostIP = 'http://10.0.2.2:5005';
      const localNetworkIP = 'http://192.168.1.92:5005';
      const publicIP = 'http://45.115.186.228:5005';

      const baseUrl = __DEV__ ? localNetworkIP : publicIP;
      const url = `${baseUrl}/login?username=${username}&userPassword=${password}`;

      const response = await fetch(url);
      const responseBody = await response.text(); // BACK TO TEXT


      if (response.ok) {
        if (!responseBody || responseBody.length < 10) {
          throw new Error('Token missing in response');
        }

        // 🧠 Decode token to verify role
        const tokenParts = responseBody.split('.');
        if (tokenParts.length !== 3) {
          throw new Error('Invalid token format');
        }
        const payload = JSON.parse(atob(tokenParts[1]));

        // Adjust this check based on actual structure
        const role = payload.role || payload.roles?.[0] || payload.authorities?.[0];

        if (!role || !role.toLowerCase().includes('housekeeper')) {
          Alert.alert('⛔ Access Denied', 'Only housekeepers can log in.');
          return;
        }


        // ✅ Save token and credentials
        await AsyncStorage.setItem('access_token', responseBody);
        await AsyncStorage.setItem('savedUsername', username);
        await AsyncStorage.setItem('savedPassword', password);

        Alert.alert('✅ Success', 'Login successful');
        navigation.navigate('FloorData', { user: { username } });

      } else {
        Alert.alert('❌ Login Failed', responseBody || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('⚠️ Error', 'Could not connect to server');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Image source={require('../assets/logo.png')} style={styles.logo} />

        <Text style={styles.title}>Housekeeping Login</Text>

        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.note}>Only authorized staff members can log in.</Text>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 Cogent Safety – Housekeeping App</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4f7',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 110,
    height: 110,
    marginBottom: 24,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#00695c',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  note: {
    fontSize: 12,
    color: '#777',
    marginTop: 16,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    padding: 16,
  },
  footerText: {
    fontSize: 12,
    color: '#888',
  },
});

export default LoginScreen;
