import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App'; // Adjust path if needed

// Define prop types using your root stack
type FloorDataScreenRouteProp = RouteProp<RootStackParamList, 'FloorData'>;

type Props = {
  route: FloorDataScreenRouteProp;
};

const FloorDataScreen: React.FC<Props> = ({ route }) => {
  const { user } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Floor Data</Text>
      {user && (
        <Text style={styles.subtitle}>
          Logged in as: {user.username || 'User'}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    marginTop: 10,
    color: '#555',
  },
});

export default FloorDataScreen;
