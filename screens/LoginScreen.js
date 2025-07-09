import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';

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
                    : await response.text(); // fallback in case it's not JSON

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
        <View style={styles.container}>
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
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
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
});

export default LoginScreen;
