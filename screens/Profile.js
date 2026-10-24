import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  Switch,
  Alert
} from 'react-native';
import Header from './Header';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export default function Profile({ navigation }) {
  const [image, setImage] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferences, setPreferences] = useState({
    orderStatus: false,
    passwordChanges: false,
    specialOffers: false,
    newsletter: false,
  });
  const [storedData, setStoredData ] = useState({
    firstName,
    lastName,
    email,
    phone,
    preferences,
    image
  })
  
  useEffect(() => {
    const fetchUserData = async () => {
      console.log('Fetching user data from AsyncStorage...');
      const storedFirstName = await AsyncStorage.getItem('firstName');
      const storedLastName = await AsyncStorage.getItem('lastName');
      const storedEmail = await AsyncStorage.getItem('email');
      const storedPhone = await AsyncStorage.getItem('phone');
      const storedPreferences = await AsyncStorage.getItem('preferences');
      const storedImage = await AsyncStorage.getItem('image');
      if (storedFirstName) setFirstName(storedFirstName);
      if (storedLastName) setLastName(storedLastName);
      if (storedEmail) setEmail(storedEmail);
      if (storedPhone) setPhone(storedPhone);
      if (storedImage) setImage(storedImage);
      if (storedPreferences) setPreferences(JSON.parse(storedPreferences));
      setStoredData({
        firstName: storedFirstName,
        lastName: storedLastName,
        email: storedEmail,
        phone: storedPhone,
        image: storedImage,
        preferences: storedPreferences ? JSON.parse(storedPreferences) : {
          orderStatus: false,
          passwordChanges: false,
          specialOffers: false,
          newsletter: false,
        }
      });
      console.log('Fetched user data:', storedData);
    }

    fetchUserData();
  }, []);

  const logOut = async () => {
    await AsyncStorage.removeItem('isLoggedIn');
    await AsyncStorage.removeItem('firstName');
    await AsyncStorage.removeItem('lastName');
    await AsyncStorage.removeItem('email');
    await AsyncStorage.removeItem('phone');
    await AsyncStorage.removeItem('image');
    await AsyncStorage.removeItem('preferences');
    navigation.navigate('Onboarding');
  }

  const discard = () => {
    console.log('storedvalues', storedData);
    setFirstName(storedData.firstName || '');
    setLastName(storedData.lastName || '');
    setEmail(storedData.email || '');
    setPhone(storedData.phone || '');
    setImage(storedData.image || '');
    setPreferences(storedData.preferences || {
      orderStatus: false,
      passwordChanges: false,
      specialOffers: false,
      newsletter: false,
    });
  }

  const saveChanges = async () => {
    await AsyncStorage.setItem('firstName', firstName);
    await AsyncStorage.setItem('lastName', lastName);
    await AsyncStorage.setItem('email', email);
    await AsyncStorage.setItem('phone', phone);
    await AsyncStorage.setItem('image', image);
    await AsyncStorage.setItem('preferences', JSON.stringify(preferences));
    Alert.alert('Changes saved', 'Your profile changes have been saved.');
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the media library is required.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Header
          navigation={navigation}
          showGoBack
          showProfilePicture
        />
        <View style={styles.formContainer}>
          <Image
            style={styles.imageBg}
            source={require('../assets/Delivery van.png')}
            resizeMode="contain"
          />
          <Text style={styles.text}>Personal Information</Text>
          <Text style={styles.label}>Avatar</Text>
          <View style={styles.avatarContainer}>
            { image && (
              <Image
                style={styles.profileImage}
                source={{uri: image}}
                resizeMode="contain"
              />
            )}
            {!image && (
              <View
                style={styles.profileImagePlaceholder}
              >
                <Text style={styles.placeholderText}>{firstName.charAt(0).toUpperCase() + (lastName.charAt(0).toUpperCase() || firstName.charAt(1).toUpperCase())}</Text>
              </View>
            )}
            <Pressable
              style={styles.pressable}
              onPress={pickImage}
            >
              <Text style={styles.pressableText}>Change</Text>
            </Pressable>
            <Pressable
              style={styles.pressableSecondary}
              onPress={() => setImage('')}
            >
              <Text style={styles.pressableTextSecondary}>Remove</Text>
            </Pressable>
          </View>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.inputBox}
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
            autoCorrect={false}
          />
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.inputBox}
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
            autoCorrect={false}
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.inputBox}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.inputBox}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.text}>Email Notifications</Text>
          <View style={styles.preferencesContainer}>
            <Switch
              value={preferences.orderStatus}
              onValueChange={(value) => setPreferences({ ...preferences, orderStatus: value })}
            />
            <Text style={styles.preferenceText}>Order statuses</Text>
          </View>
          <View style={styles.preferencesContainer}>
            <Switch
              value={preferences.passwordChanges}
              onValueChange={(value) => setPreferences({ ...preferences, passwordChanges: value })}
            />
            <Text style={styles.preferenceText}>Password changes</Text>
          </View>
          <View style={styles.preferencesContainer}>
            <Switch
              value={preferences.specialOffers}
              onValueChange={(value) => setPreferences({ ...preferences, specialOffers: value })}
            />
            <Text style={styles.preferenceText}>Special offers</Text>
          </View>
          <View style={styles.preferencesContainer}>
            <Switch
              value={preferences.newsletter}
              onValueChange={(value) => setPreferences({ ...preferences, newsletter: value })}
            />
            <Text style={styles.preferenceText}>Newsletter</Text>
          </View>

          <Pressable
            style={styles.pressableTertiary}
            onPress={logOut}
          >
            <Text style={styles.pressableTextTertiary}>Log Out</Text>
          </Pressable>
          
          <View style={styles.actionButtonsContainer}>
            <Pressable
              style={styles.pressableSecondary}
            >
              <Text style={styles.pressableTextSecondary} onPress={discard}>
                Discard changes
              </Text>
            </Pressable>
            <Pressable
              style={styles.pressable}
            >
              <Text style={styles.pressableText} onPress={saveChanges}>Save changes</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DEE3E9',
    paddingHorizontal: 16,
  },
  formContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingVertical: 24,
  },
  imageBg: {
    position: 'absolute',
    top: 300,
    right: 30,
    width: '50%',
    opacity: 0.2,
  },
  text: {
    color: '#334753',
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  inputBox: {
    width: '100%',
    height: 40,
    marginTop: 8,
    borderWidth: 1,
    paddingVertical: 10,
    fontSize: 18,
    borderColor: '#AAB3BA',
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  label: {
    color: '#334753',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginTop: 8,
  },
  profileImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#2ad69d',
  },
  placeholderText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  pressable: {
    backgroundColor: '#495E57',
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  pressableText: {
    color: '#DEE3E9',
    fontSize: 14,
    fontWeight: 'bold',
  },
  pressableSecondary: {
    backgroundColor: '#DEE3E9',
    padding: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#495E57',
    borderRadius: 10,
  },
  pressableTextSecondary: {
    color: '#495E57',
    fontSize: 14,
    fontWeight: 'bold',
  },
  pressableTertiary: {
    width: '100%',
    backgroundColor: '#F4CE14',
    borderWidth: 1,
    borderColor: '#f5b504',
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  pressableTextTertiary: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  avatarContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 10,
  },
  preferencesContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    gap: 10,
  },
  actionButtonsContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginVertical: 10,
    gap: 10,
    marginTop: 40,
  }
});
