import React, { useState } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Image,
  Button,
  Platform,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { launchCamera } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image as RNImage } from 'react-native-compressor';
import RNFS from 'react-native-fs'; 


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
  'Basement 2', 'Basement 1', 'Ground Floor', 'MZ Floor',
  ...Array.from({ length: 27 }, (_, i) => `${getSuffix(i + 1)} Floor`),
];

const floorOptionsMr = [
  'तळमजला 2', 'तळमजला 1', 'भूतल', 'एमझेड मजला',
  ...Array.from({ length: 27 }, (_, i) => getMarathiFloorLabel(i + 1)),
];

const subFloorOptionsEn = [
  'East Lobby Area', 'West Lobby Area', 'Washroom', 'Common Area',
  'Back Tericota', 'Marble Tericota', 'Meeting Room', 'Conference Room', 'Pantry Area',
];

const subFloorOptionsMr = [
  'पूर्व लॉबी क्षेत्र', 'पश्चिम लॉबी क्षेत्र', 'स्वच्छतागृह', 'सामान्य क्षेत्र',
  'बाहेरील टेराकोटा', 'मार्बल टेराकोटा', 'बैठक खोली', 'परिषद खोली', 'पँट्री क्षेत्र',
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
      const localhostIP = 'http://10.0.2.2:5005';
      const lanIP = 'http://192.168.1.92:5005';
      const publicIP = 'http://45.115.186.228:5005';
      const baseUrl = __DEV__ ? lanIP : publicIP;

      const response = await fetch(`${baseUrl}/floorData`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ floorName, subFloorName, imageType }),
      });

      if (!response.ok) throw new Error('Failed to save floor data');

      const locationHeader = response.headers.get('Location');
      if (!locationHeader) throw new Error("Missing 'Location' header");
      const floorDataId = locationHeader.split('/').pop();

      const token = await AsyncStorage.getItem('access_token');
      if (!token) throw new Error('No access token found');

      // Inside handleSubmit...
      if (image && floorDataId) {
        const sanitize = (str: string) =>
          str.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
        const now = new Date();
        const pad = (n: number) => (n < 10 ? `0${n}` : n);
        const customFileName = `${sanitize(floorName)}-${sanitize(
          subFloorName
        )}-${imageType}-${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
          now.getDate()
        )}-${pad(now.getHours())}-${pad(now.getMinutes())}.jpg`;

        // 🔽 Compress until size < 512KB
        let quality = 0.8;
        let compressedImageUri = image.uri;
        let fileSizeKB = Number.MAX_VALUE;

        while (fileSizeKB > 512 && quality >= 0.2) {
          compressedImageUri = await RNImage.compress(image.uri, {
            compressionMethod: 'auto',
            quality,
            maxWidth: 1280,
            maxHeight: 1280,
          });

          const stat = await RNFS.stat(compressedImageUri);
          fileSizeKB = stat.size / 1024;
          if (fileSizeKB > 512) quality -= 0.1;
        }

        const formData = new FormData();
        formData.append('taskImage', {
          uri: compressedImageUri,
          name: customFileName,
          type: image.type || 'image/jpeg',
        });

        const uploadRes = await fetch(`${baseUrl}/floorData/${floorDataId}/image`, {
          method: 'POST',
          body: formData,
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!uploadRes.ok)
          throw new Error('Image upload failed: ' + (await uploadRes.text()));
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
    <ScrollView contentContainerStyle={styles.safeArea}>
      <View style={styles.container}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />

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
            <Picker.Item key={`floor-${idx}`} label={floorLabels[idx]} value={value} />

          ))}
        </Picker>

        <Text style={styles.label}>{t.selectSubFloor}</Text>
        <Picker selectedValue={subFloorName} onValueChange={setSubFloorName} style={styles.input}>
          {subFloorOptionsEn.map((value, idx) => (
            <Picker.Item key={`subfloor-${idx}`} label={subFloorLabels[idx]} value={value} />

          ))}
        </Picker>

        <Text style={styles.label}>{t.imageType}</Text>
        <Picker selectedValue={imageType} onValueChange={setImageType} style={styles.input}>
          <Picker.Item label={t.before} value="BEFORE" />
          <Picker.Item label={t.after} value="AFTER" />
        </Picker>

        <TouchableOpacity style={styles.loginButton} onPress={captureImage}>
          <Text style={styles.loginButtonText}>{t.uploadImage}</Text>
        </TouchableOpacity>

        {image && <Image source={{ uri: image.uri }} style={styles.previewImage} />}

        <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
          <Text style={styles.loginButtonText}>{t.submit}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flexGrow: 1,
    backgroundColor: '#f0f4f7',
    justifyContent: 'center',
    padding: 24,
  },
  container: {
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 10,
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#00695c',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 14,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  previewImage: {
    width: 200,
    height: 200,
    marginTop: 16,
    borderRadius: 10,
  },
  languageSwitch: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  langBtn: {
    fontSize: 14,
    color: '#555',
    paddingHorizontal: 5,
  },
  separator: {
    fontSize: 14,
    color: '#555',
    paddingHorizontal: 4,
  },
  activeLang: {
    fontWeight: 'bold',
    color: '#000',
  },
});

export default FloorDataScreen;
