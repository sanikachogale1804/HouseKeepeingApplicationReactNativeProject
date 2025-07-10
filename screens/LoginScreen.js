import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, SafeAreaView, Image } from 'react-native';

function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://10.0.2.2:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          userPassword: password,
        }),
      });

      const contentType = response.headers.get('Content-Type');

      if (response.ok) {
        const data = contentType.includes('application/json')
          ? await response.json()
          : await response.text();

        console.log('Login successful', data);
        Alert.alert('Success', 'Login successful');
      } else {
        const errorData = contentType.includes('application/json')
          ? await response.json()
          : await response.text();

        console.log('Login failed', errorData);
        Alert.alert('Login Failed', typeof errorData === 'string' ? errorData : errorData.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Error', 'Could not connect to server');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* ✅ Logo added here */}
        <Image source={require('../assets/logo.png')} style={styles.logo} />

        <Text style={styles.title}>Login Page</Text>

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
        <Button title="Login" onPress={handleLogin} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© All rights reserved by Cogent Safety</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#888',
  },
});

export default LoginScreen;
