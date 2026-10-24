import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Header from './Header';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Onboarding = ({ navigation }) => {
  const [firstName, onChangeFirstName] = useState('');
  const [email, onChangeEmail] = useState('');

  const trimmedFirstName = firstName.trim();
  const isFirstNameValid =
    trimmedFirstName.length > 0 && /^[\p{L}\p{M} ]+$/u.test(trimmedFirstName);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isFormValid = isFirstNameValid && isEmailValid;

  const login = async () => {
    await AsyncStorage.setItem('firstName', firstName);
    await AsyncStorage.setItem('email', email);
    await AsyncStorage.setItem('isLoggedIn', 'true');
    navigation.navigate('Home');
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Header />
        <View style={styles.formContainer}>
          <Text style={styles.text}>Let us get to know you</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.inputBox}
              value={firstName}
              onChangeText={onChangeFirstName}
              autoCapitalize="words"
              autoCorrect={false}
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.inputBox}
              value={email}
              onChangeText={onChangeEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>
        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.pressable,
              !isFormValid && styles.pressableDisabled,
              pressed && isFormValid && styles.pressablePressed,
            ]}
            disabled={!isFormValid}
            accessibilityState={{ disabled: !isFormValid }}
            onPress={login}
          >
            <Text
              style={[
                styles.label,
                !isFormValid && styles.labelDisabled,
              ]}
            >
              Next
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CBD2D9',
  },
  scrollContent: {
    flexGrow: 1,
  },
  text: {
    color: '#334753',
    fontSize: 24,
    marginBottom: 50,
    fontWeight: 'bold',
  },
  inputBox: {
    width: 300,
    height: 40,
    margin: 12,
    borderWidth: 2,
    padding: 10,
    fontSize: 18,
    borderColor: '#334753',
    borderRadius: 10,
    marginBottom: 20,
  },
  formContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
  label: {
    color: '#334753',
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputContainer: {
    alignItems: 'center',
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: '#F2F4F7',
    padding: 24,
  },
  pressable: {
    backgroundColor: '#CBD2D9',
    padding: 10,
    paddingRight: 30,
    paddingLeft: 30,
    borderRadius: 10,
  },
  pressableDisabled: {
    backgroundColor: '#AAB3BA',
  },
  pressablePressed: {
    opacity: 0.8,
  },
  labelDisabled: {
    color: '#5B6670',
  },
});
