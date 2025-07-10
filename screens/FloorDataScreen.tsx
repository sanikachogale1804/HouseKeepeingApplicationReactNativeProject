import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const FloorDataScreen = () => {
  const [floorName, setFloorName] = useState('');
  const [subFloorName, setSubFloorName] = useState('');
  const [imageType, setImageType] = useState('BEFORE');

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://10.0.2.2:8080/floorData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ floorName, subFloorName, imageType }),
      });

      if (!response.ok) {
        throw new Error('Failed to save floor data');
      }

      Alert.alert('Success', 'Floor data saved successfully!');
      setFloorName('');
      setSubFloorName('');
      setImageType('BEFORE');
    } catch (err) {
      Alert.alert('Error', (err as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Floor Data</Text>

      <TextInput
        placeholder="Floor Name"
        value={floorName}
        onChangeText={setFloorName}
        style={styles.input}
      />

      <TextInput
        placeholder="Sub Floor Name"
        value={subFloorName}
        onChangeText={setSubFloorName}
        style={styles.input}
      />

      <Text style={styles.label}>Image Type</Text>
      <Picker
        selectedValue={imageType}
        onValueChange={setImageType}
        style={styles.input}
      >
        <Picker.Item label="Before" value="BEFORE" />
        <Picker.Item label="After" value="AFTER" />
      </Picker>

      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 15, borderRadius: 5 },
  label: { fontSize: 16, marginBottom: 5 },
});

export default FloorDataScreen;
