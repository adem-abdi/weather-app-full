import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const SettingsScreen = ({ navigation }) => {
  // State for toggles (non-functional, just for UI)
  const [pushNotifications, setPushNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const { logout } = useContext(AuthContext);
  const { isDarkMode, theme, toggleDarkMode } = useContext(ThemeContext);

  // Handle sign out
  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            // Navigation will be handled automatically by App.js
            // when userToken becomes null
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Handle Privacy Policy
  const handlePrivacyPolicy = () => {
    Alert.alert(
      'Privacy Policy',
      'We take reasonable measures to protect your data from unauthorized access, loss, or misuse. Your information is stored securely and only accessed when necessary.',
      [
        {
          text: 'OK',
          style: 'default',
        },
      ],
      { cancelable: true }
    );
  };

  // Handle Coming Soon popup
  const handleComingSoon = () => {
    Alert.alert(
      'Coming Soon',
      'This feature is currently under development and will be available in a future update.',
      [
        {
          text: 'OK',
          style: 'default',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center px-5 pt-4 pb-6">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-4 p-2 -ml-2"
          >
            <Text style={{ fontSize: 24, color: theme.text }}>←</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.text, flex: 1 }}>
            Settings
          </Text>
        </View>

        <View className="px-5">
          {/* User Profile Section */}
          <TouchableOpacity
            style={{
              backgroundColor: theme.cardBackground,
              borderRadius: 16,
              padding: 16,
              marginBottom: 24,
              flexDirection: 'row',
              alignItems: 'center',
            }}
            activeOpacity={0.8}
            onPress={handleComingSoon}
          >
            <View className="w-16 h-16 rounded-full bg-[#3B82F6] items-center justify-center mr-4 overflow-hidden">
              <Text className="text-3xl">👨</Text>
            </View>
            <View className="flex-1">
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.text, marginBottom: 4 }}>
                Adem Abdifitah
              </Text>
              <Text style={{ fontSize: 14, color: theme.textSecondary, marginBottom: 8 }}>
                adem.abdifitah@gmail.com
              </Text>
              <View className="bg-[#3B82F6] rounded px-2 py-0.5 self-start">
                <Text className="text-[10px] font-bold text-white uppercase tracking-wide">
                  Developer
                </Text>
              </View>
            </View>
            <Text style={{ fontSize: 20, color: theme.textSecondary }}>→</Text>
          </TouchableOpacity>

          {/* NOTIFICATIONS & ACCESS Section */}
          <Text style={{ fontSize: 12, color: theme.textTertiary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginTop: 8 }}>
            NOTIFICATIONS & ACCESS
          </Text>
          <View style={{ backgroundColor: theme.cardBackground, borderRadius: 16, marginBottom: 24, overflow: 'hidden' }}>
            {/* Push Notifications */}
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: theme.border }}>
              <View className="w-10 h-10 rounded-lg bg-[#F97316] items-center justify-center mr-4">
                <Text className="text-lg">🔔</Text>
              </View>
              <View className="flex-1">
                <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text, marginBottom: 4 }}>
                  Push Notifications
                </Text>
                <Text style={{ fontSize: 14, color: theme.textSecondary }}>
                  Daily forecasts & alerts
                </Text>
              </View>
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{ false: isDarkMode ? '#374151' : '#D1D5DB', true: '#3B82F6' }}
                thumbColor="#FFFFFF"
                ios_backgroundColor={isDarkMode ? '#374151' : '#D1D5DB'}
              />
            </View>

            {/* Location Services */}
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: theme.border }}>
              <View className="w-10 h-10 rounded-lg bg-[#3B82F6] items-center justify-center mr-4">
                <Text className="text-lg">📍</Text>
              </View>
              <View className="flex-1">
                <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text, marginBottom: 4 }}>
                  Location Services
                </Text>
                <Text style={{ fontSize: 14, color: theme.textSecondary }}>
                  Real-time local tracking
                </Text>
              </View>
              <Switch
                value={locationServices}
                onValueChange={setLocationServices}
                trackColor={{ false: isDarkMode ? '#374151' : '#D1D5DB', true: '#3B82F6' }}
                thumbColor="#FFFFFF"
                ios_backgroundColor={isDarkMode ? '#374151' : '#D1D5DB'}
              />
            </View>

            {/* Dark Mode */}
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
              <View className="w-10 h-10 rounded-lg bg-[#1E40AF] items-center justify-center mr-4">
                <Text className="text-lg">🌙</Text>
              </View>
              <View className="flex-1">
                <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text, marginBottom: 4 }}>
                  Dark Mode
                </Text>
                <Text style={{ fontSize: 14, color: theme.textSecondary }}>
                  Easy on your eyes
                </Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: isDarkMode ? '#374151' : '#D1D5DB', true: '#3B82F6' }}
                thumbColor="#FFFFFF"
                ios_backgroundColor={isDarkMode ? '#374151' : '#D1D5DB'}
              />
            </View>
          </View>

          {/* APP PREFERENCES Section */}
          <Text style={{ fontSize: 12, color: theme.textTertiary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
            APP PREFERENCES
          </Text>
          <View style={{ backgroundColor: theme.cardBackground, borderRadius: 16, marginBottom: 24, overflow: 'hidden' }}>
            {/* Unit System */}
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: theme.border }}
              activeOpacity={0.7}
              onPress={handleComingSoon}
            >
              <View className="w-10 h-10 rounded-lg bg-[#10B981] items-center justify-center mr-4">
                <Text className="text-lg">🌡️</Text>
              </View>
              <View className="flex-1">
                <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text }}>
                  Unit System
                </Text>
              </View>
              <View className="flex-row items-center">
                <Text style={{ fontSize: 14, color: theme.textSecondary, marginRight: 8 }}>
                  Metric (°C, km/h)
                </Text>
                <Text style={{ fontSize: 18, color: theme.textSecondary }}>⌄</Text>
              </View>
            </TouchableOpacity>

            {/* Update Frequency */}
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}
              activeOpacity={0.7}
              onPress={handleComingSoon}
            >
              <View className="w-10 h-10 rounded-lg bg-[#8B5CF6] items-center justify-center mr-4">
                <Text className="text-lg">🔄</Text>
              </View>
              <View className="flex-1">
                <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text }}>
                  Update Frequency
                </Text>
              </View>
              <View className="flex-row items-center">
                <Text style={{ fontSize: 14, color: theme.textSecondary, marginRight: 8 }}>
                  Every 30 min
                </Text>
                <Text style={{ fontSize: 18, color: theme.textSecondary }}>⌄</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* SUPPORT & ABOUT Section */}
          <Text style={{ fontSize: 12, color: theme.textTertiary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
            SUPPORT & ABOUT
          </Text>
          <View style={{ backgroundColor: theme.cardBackground, borderRadius: 16, marginBottom: 24, overflow: 'hidden' }}>
            {/* Help Center */}
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: theme.border }}
              activeOpacity={0.7}
              onPress={handleComingSoon}
            >
              <View className="w-10 h-10 rounded-lg bg-gray-600 items-center justify-center mr-4">
                <Text className="text-lg text-white">?</Text>
              </View>
              <View className="flex-1">
                <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text }}>
                  Help Center
                </Text>
              </View>
              <Text style={{ fontSize: 20, color: theme.textSecondary }}>→</Text>
            </TouchableOpacity>

            {/* Privacy Policy */}
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: theme.border }}
              activeOpacity={0.7}
              onPress={handlePrivacyPolicy}
            >
              <View className="w-10 h-10 rounded-lg bg-gray-600 items-center justify-center mr-4">
                <Text className="text-lg text-white">🛡️</Text>
              </View>
              <View className="flex-1">
                <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text }}>
                  Privacy Policy
                </Text>
              </View>
              <Text style={{ fontSize: 20, color: theme.textSecondary }}>→</Text>
            </TouchableOpacity>

            {/* App Version */}
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
              <View className="w-10 h-10 rounded-lg bg-gray-600 items-center justify-center mr-4">
                <Text className="text-lg text-white">ℹ️</Text>
              </View>
              <View className="flex-1">
                <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text }}>
                  App Version
                </Text>
              </View>
              <Text style={{ fontSize: 14, color: theme.textSecondary }}>v4.2.1-stable</Text>
            </View>
          </View>

          {/* Sign Out Button */}
          <TouchableOpacity
            style={{
              backgroundColor: '#DC2626',
              borderWidth: 1,
              borderColor: '#EF4444',
              borderRadius: 12,
              paddingVertical: 16,
              paddingHorizontal: 24,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 32,
              shadowColor: '#DC2626',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 3,
            }}
            activeOpacity={0.8}
            onPress={handleSignOut}
          >
            <Text style={{ fontSize: 18, marginRight: 8 }}>🚪</Text>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}>
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
