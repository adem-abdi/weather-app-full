import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import './global.css';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import WeatherScreen from './screens/WeatherScreen';
import SettingsScreen from './screens/SettingsScreen';

// Simple navigation component for auth screens
const AuthStack = ({ currentScreen, setCurrentScreen }) => {
  if (currentScreen === 'Login') {
    return <LoginScreen navigation={{ navigate: (screen) => setCurrentScreen(screen) }} />;
  }
  return <RegisterScreen navigation={{ navigate: (screen) => setCurrentScreen(screen) }} />;
};

// Main App Component with Auth Context
const AppContent = () => {
  const { userToken, isLoading } = React.useContext(AuthContext);
  const [currentScreen, setCurrentScreen] = useState('Login');
  const [mainScreen, setMainScreen] = useState('Weather');

  // Show loading spinner while checking for existing token
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Conditional Rendering:
  // if (userToken == null) -> Show AuthStack (Login/Register)
  // else -> Show Main App Screens (Weather/Settings)
  if (userToken == null) {
    return <AuthStack currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />;
  }

  // Navigation for main app screens
  const navigation = {
    navigate: (screen) => setMainScreen(screen),
    goBack: () => setMainScreen('Weather'),
  };

  if (mainScreen === 'Settings') {
    return <SettingsScreen navigation={navigation} />;
  }

  return <WeatherScreen navigation={navigation} />;
};

// Root App Component wrapped with ThemeProvider and AuthProvider
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#09090b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fafafa',
    fontSize: 16,
    marginTop: 12,
    fontWeight: '500',
  },
});
