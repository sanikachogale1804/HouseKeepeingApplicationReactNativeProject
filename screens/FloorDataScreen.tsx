import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform, // ✅ Add this line
} from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';


const getSuffix = (n: number) => {
  if (n === 1) return '1st';
  if (n === 2) return '2nd';
  if (n === 3) return '3rd';
  return `${n}th`;
};

const getMarathiFloorLabel = (n: number) => {
  if (n === 1) return '1 ला मजला';
  if (n === 2 || n === 3) return `${n} रा मजला`;
  if (n === 4) return '4 था मजला';
  return `${n} वा मजला`;
};

const floorOptionsEn = [
  'Basement 2',
  'Basement 1',
  'Ground Floor',
  'MZ Floor',
  ...Array.from({ length: 27 }, (_, i) => `${getSuffix(i + 1)} Floor`),
];

const floorOptionsMr = [
  'तळमजला 2',
  'तळमजला 1',
  'भूतल',
  'एमझेड मजला',
  ...Array.from({ length: 27 }, (_, i) => getMarathiFloorLabel(i + 1)),
];

const subFloorOptionsEn = [
  'East Lobby Area',
  'West Lobby Area',
  'Washroom',
  'Common Area',
  'Back Tericota',
  'Marble Tericota',
  'Meeting Room',
  'Conference Room',
  'Pantry Area',
];

const subFloorOptionsMr = [
  'पूर्व लॉबी क्षेत्र',
  'पश्चिम लॉबी क्षेत्र',
  'स्वच्छतागृह',
  'सामान्य क्षेत्र',
  'बाहेरील टेराकोटा',
  'मार्बल टेराकोटा',
  'बैठक खोली',
  'परिषद खोली',
  'पँट्री क्षेत्र',
];

const translations = {
  en: {
    title: 'Add Floor Data',
    selectFloor: 'Select Floor',
    selectSubFloor: 'Select Sub Floor',
    imageType: 'Image Type',
    before: 'Before',
    after: 'After',
    submit: 'Submit',
    uploadImage: 'Upload Image',
    success: 'Success',
    successMsg: 'Floor data saved successfully!',
    error: 'Error',
  },
  mr: {
    title: 'मजल्याचा डेटा जोडा',
    selectFloor: 'मजला निवडा',
    selectSubFloor: 'उप-मजला निवडा',
    imageType: 'प्रतिमा प्रकार',
    before: 'पूर्वी',
    after: 'नंतर',
    submit: 'सबमिट करा',
    uploadImage: 'प्रतिमा जोडा',
    success: 'यशस्वी',
    successMsg: 'मजल्याचा डेटा यशस्वीरीत्या जतन केला गेला!',
    error: 'चूक',
  },
};

const FloorDataScreen = () => {
  const [language, setLanguage] = useState<'en' | 'mr'>('en');
  const [floorName, setFloorName] = useState(floorOptionsEn[0]);
  const [subFloorName, setSubFloorName] = useState(subFloorOptionsEn[0]);
  const [imageType, setImageType] = useState('BEFORE');
  const [image, setImage] = useState<any>(null);

  const t = translations[language];
  const floorLabels = language === 'mr' ? floorOptionsMr : floorOptionsEn;
  const subFloorLabels = language === 'mr' ? subFloorOptionsMr : subFloorOptionsEn;

  const captureImage = async () => {
    const result = await launchCamera({ mediaType: 'photo', cameraType: 'back' });

    if (!result.didCancel && result.assets?.[0]) {
      setImage(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      // Step 1: Save floor data (JSON)
      const response = await fetch('http://10.0.2.2:8080/floorData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ floorName, subFloorName, imageType }),
      });

      if (!response.ok) {
        throw new Error('Failed to save floor data');
      }

      // ✅ Extract ID from Location header
      const locationHeader = response.headers.get('Location');
      if (!locationHeader) {
        throw new Error("Missing 'Location' header in response");
      }

      const floorDataId = locationHeader.split('/').pop();
      console.log('📦 FloorData ID:', floorDataId);

      // ✅ Get token from AsyncStorage
      const token = await AsyncStorage.getItem('access_token');
      console.log('🪪 Retrieved token:', token);
      if (!token) {
        throw new Error('No access token found. Please login again.');
      }

      // ✅ Upload image if available
      if (image && floorDataId) {
        const sanitize = (str: string) => str.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');

        const customFileName = `${sanitize(floorName)}-${sanitize(subFloorName)}-${imageType}.jpg`;

        const photo = {
          uri: image.uri,
          name: customFileName,
          type: image.type || 'image/jpeg',
        };

        const formData = new FormData();
        formData.append('taskImage', photo);

        console.log('Uploading image...', photo);

        const res = await fetch(`http://10.0.2.2:8080/floorData/${floorDataId}/image`, {
          method: 'POST',
          body: formData,
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`, // ✅ AUTH FIX
          },
        });

        const resText = await res.text();
        console.log('Upload response:', res.status, resText);

        if (!res.ok) {
          throw new Error('Image upload failed: ' + resText);
        }
      }

      Alert.alert(t.success, t.successMsg);
      setFloorName(floorOptionsEn[0]);
      setSubFloorName(subFloorOptionsEn[0]);
      setImageType('BEFORE');
      setImage(null);
    } catch (err) {
      Alert.alert(t.error, (err as Error).message);
    }
  };


  return (
    <View style={styles.container}>
      {/* Language Switch */}
      <View style={styles.languageSwitch}>
        <TouchableOpacity onPress={() => setLanguage('en')}>
          <Text style={[styles.langBtn, language === 'en' && styles.activeLang]}>English</Text>
        </TouchableOpacity>
        <Text style={styles.separator}>|</Text>
        <TouchableOpacity onPress={() => setLanguage('mr')}>
          <Text style={[styles.langBtn, language === 'mr' && styles.activeLang]}>मराठी</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{t.title}</Text>

      <Text style={styles.label}>{t.selectFloor}</Text>
      <Picker selectedValue={floorName} onValueChange={setFloorName} style={styles.input}>
        {floorOptionsEn.map((value, idx) => (
          <Picker.Item key={value} label={floorLabels[idx]} value={value} />
        ))}
      </Picker>

      <Text style={styles.label}>{t.selectSubFloor}</Text>
      <Picker selectedValue={subFloorName} onValueChange={setSubFloorName} style={styles.input}>
        {subFloorOptionsEn.map((value, idx) => (
          <Picker.Item key={value} label={subFloorLabels[idx]} value={value} />
        ))}
      </Picker>

      <Text style={styles.label}>{t.imageType}</Text>
      <Picker selectedValue={imageType} onValueChange={setImageType} style={styles.input}>
        <Picker.Item label={t.before} value="BEFORE" />
        <Picker.Item label={t.after} value="AFTER" />
      </Picker>

      <Button title={t.uploadImage} onPress={captureImage} />
      {image && <Image source={{ uri: image.uri }} style={{ width: 200, height: 200, marginTop: 10 }} />}

      <Button title={t.submit} onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 15, borderRadius: 5 },
  label: { fontSize: 16, marginBottom: 5 },
  languageSwitch: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10 },
  langBtn: { fontSize: 16, color: '#555', paddingHorizontal: 5 },
  separator: { fontSize: 16, color: '#555' },
  activeLang: { fontWeight: 'bold', color: '#000' },
});

export default FloorDataScreen;
