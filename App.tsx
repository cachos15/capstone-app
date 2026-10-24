import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import Onboarding from './screens/Onboarding';
import SplashScreen from './screens/SplashScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Profile from './screens/Profile';
import Home from './screens/Home';

const Stack = createNativeStackNavigator();
export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('isLoggedIn');
      setIsLoggedIn(!!token);
      setLoading(false);
    };

    checkLoginStatus();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }
  return (
    <NavigationContainer>
     <Stack.Navigator initialRouteName={isLoggedIn ? "Home" : "Onboarding"} screenOptions={{ headerShown: false }}>
       <Stack.Screen name="Home" component={Home} />
       <Stack.Screen name="Onboarding" component={Onboarding} />
       <Stack.Screen name="Profile" component={Profile} />
     </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
});
