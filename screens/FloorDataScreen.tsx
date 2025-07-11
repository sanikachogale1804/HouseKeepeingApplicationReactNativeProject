import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const getSuffix = (n: number) => {
  if (n === 1) return '1st';
  if (n === 2) return '2nd';
  if (n === 3) return '3rd';
  return `${n}th`;
};

const getHindiSuffix = (n: number)=>{
  if(n==1) return 'ली'
  if(n==2 || n==3) return 'री'
  return `वीं`
}

const floorOptionsEn = [
  'Basement 2',
  'Basement 1',
  'Ground Floor',
  'MZ Floor',
  ...Array.from({ length: 27 }, (_, i) => `${getSuffix(i + 1)} Floor`),
];

const floorOptionsHi = [
  'तलघर 2',
  'तलघर 1',
  'भूतल',
  'एमज़ेड फ्लोर',
  ...Array.from({ length: 27 }, (_, i) => {
    const num = i + 1;
    return `${num}${getHindiSuffix(num)} मंज़िल`;
  }),
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

const subFloorOptionsHi = [
  'पूर्व लॉबी क्षेत्र',
  'पश्चिम लॉबी क्षेत्र',
  'शौचालय',
  'सामान्य क्षेत्र',
  'पीछे टेराकोटा',
  'मार्बल टेराकोटा',
  'मीटिंग रूम',
  'कॉन्फ्रेंस रूम',
  'पैंट्री क्षेत्र',
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
    success: 'Success',
    successMsg: 'Floor data saved successfully!',
    error: 'Error',
  },
  hi: {
    title: 'मंजिल डेटा जोड़ें',
    selectFloor: 'मंजिल चुनें',
    selectSubFloor: 'उप-मंजिल चुनें',
    imageType: 'छवि प्रकार',
    before: 'पहले',
    after: 'बाद में',
    submit: 'जमा करें',
    success: 'सफलता',
    successMsg: 'मंजिल डेटा सफलतापूर्वक सहेजा गया!',
    error: 'त्रुटि',
  },
};

const FloorDataScreen = () => {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [floorName, setFloorName] = useState(floorOptionsEn[0]);
  const [subFloorName, setSubFloorName] = useState(subFloorOptionsEn[0]);
  const [imageType, setImageType] = useState('BEFORE');

  const t = translations[language];
  const floorLabels = language === 'hi' ? floorOptionsHi : floorOptionsEn;
  const subFloorLabels = language === 'hi' ? subFloorOptionsHi : subFloorOptionsEn;

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

      Alert.alert(t.success, t.successMsg);
      setFloorName(floorOptionsEn[0]);
      setSubFloorName(subFloorOptionsEn[0]);
      setImageType('BEFORE');
    } catch (err) {
      Alert.alert(t.error, (err as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Language Selector */}
      <View style={styles.languageSwitch}>
        <TouchableOpacity onPress={() => setLanguage('en')}>
          <Text style={[styles.langBtn, language === 'en' && styles.activeLang]}>English</Text>
        </TouchableOpacity>
        <Text style={styles.separator}>|</Text>
        <TouchableOpacity onPress={() => setLanguage('hi')}>
          <Text style={[styles.langBtn, language === 'hi' && styles.activeLang]}>हिंदी</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{t.title}</Text>

      <Text style={styles.label}>{t.selectFloor}</Text>
      <Picker
        selectedValue={floorName}
        onValueChange={setFloorName}
        style={styles.input}
      >
        {floorOptionsEn.map((value, idx) => (
          <Picker.Item key={value} label={floorLabels[idx]} value={value} />
        ))}
      </Picker>

      <Text style={styles.label}>{t.selectSubFloor}</Text>
      <Picker
        selectedValue={subFloorName}
        onValueChange={setSubFloorName}
        style={styles.input}
      >
        {subFloorOptionsEn.map((value, idx) => (
          <Picker.Item key={value} label={subFloorLabels[idx]} value={value} />
        ))}
      </Picker>

      <Text style={styles.label}>{t.imageType}</Text>
      <Picker
        selectedValue={imageType}
        onValueChange={setImageType}
        style={styles.input}
      >
        <Picker.Item label={t.before} value="BEFORE" />
        <Picker.Item label={t.after} value="AFTER" />
      </Picker>

      <Button title={t.submit} onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  languageSwitch: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  langBtn: {
    fontSize: 16,
    color: '#555',
    paddingHorizontal: 5,
  },
  separator: {
    fontSize: 16,
    color: '#555',
  },
  activeLang: {
    fontWeight: 'bold',
    color: '#000',
  },
});

export default FloorDataScreen;
