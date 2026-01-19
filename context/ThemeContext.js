import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create Theme Context with default value
export const ThemeContext = createContext({
  isDarkMode: true,
  theme: {
    background: '#0F172A',
    cardBackground: '#1E293B',
    text: '#FFFFFF',
    textSecondary: '#9CA3AF',
    textTertiary: '#6B7280',
    border: 'rgba(107, 114, 128, 0.3)',
    primary: '#3B82F6',
    searchBackground: '#FFFFFF',
    searchText: '#000000',
    weatherBackground: '#1E3A8A',
    metricCardBg: 'rgba(255, 255, 255, 0.15)',
    metricCardBorder: 'rgba(255, 255, 255, 0.2)',
  },
  toggleDarkMode: () => {},
  isLoading: false,
});

// Theme colors
export const darkTheme = {
  background: '#0F172A',
  cardBackground: '#1E293B',
  text: '#FFFFFF',
  textSecondary: '#9CA3AF',
  textTertiary: '#6B7280',
  border: 'rgba(107, 114, 128, 0.3)',
  primary: '#3B82F6',
  searchBackground: '#FFFFFF',
  searchText: '#000000',
  weatherBackground: '#1E3A8A',
  metricCardBg: 'rgba(255, 255, 255, 0.15)',
  metricCardBorder: 'rgba(255, 255, 255, 0.2)',
};

export const lightTheme = {
  background: '#FFFFFF',
  cardBackground: '#F9FAFB',
  text: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  border: 'rgba(0, 0, 0, 0.1)',
  primary: '#3B82F6',
  searchBackground: '#F3F4F6',
  searchText: '#111827',
  weatherBackground: '#EFF6FF',
  metricCardBg: 'rgba(59, 130, 246, 0.1)',
  metricCardBorder: 'rgba(59, 130, 246, 0.2)',
};

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing theme preference on app startup
  useEffect(() => {
    loadThemePreference();
  }, []);

  // Load theme preference from AsyncStorage
  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('darkMode');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'true');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle dark mode
  const toggleDarkMode = async (value) => {
    try {
      await AsyncStorage.setItem('darkMode', value.toString());
      setIsDarkMode(value);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  const value = {
    isDarkMode,
    theme,
    toggleDarkMode,
    isLoading,
  };

  // Always provide a value, even during loading
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
