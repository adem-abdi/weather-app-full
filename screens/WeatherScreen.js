import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

// Backend URL - replace with your machine's IP if needed
const BACKEND_WEATHER_URL = 'http://192.168.1.108:3000/api/weather';

// Helper function to get weather icon emoji
const getWeatherIcon = (conditionText) => {
  const text = conditionText?.toLowerCase() || '';
  if (text.includes('sunny') || text.includes('clear')) return '☀️';
  if (text.includes('cloud')) return '☁️';
  if (text.includes('rain')) return '🌧️';
  if (text.includes('storm') || text.includes('thunder')) return '⛈️';
  if (text.includes('snow')) return '❄️';
  if (text.includes('fog') || text.includes('mist')) return '🌫️';
  return '☁️';
};

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
};

// Helper function to convert Celsius to Fahrenheit
const celsiusToFahrenheit = (celsius) => {
  return Math.round((celsius * 9 / 5) + 32);
};

// Helper function to convert km/h to mph
const kmhToMph = (kmh) => {
  return Math.round(kmh * 0.621371);
};

const WeatherScreen = ({ navigation }) => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const { getToken, logout, user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  // Call backend to fetch weather by city (with Authorization header)
  const getWeather = async () => {
    try {
      // Block empty submissions
      if (!city.trim()) {
        Alert.alert(
          'Input Required',
          'Please enter a city name to get weather information. (example: Mogadishu)',
          [{ text: 'OK' }]
        );
        return;
      }

      setLoading(true);
      setWeather(null);

      // Get token from AsyncStorage
      const token = await getToken();

      if (!token) {
        Alert.alert('Error', 'You are not authenticated. Please login again.');
        logout();
        return;
      }

      // Build the backend request URL with the encoded city name
      const url = `${BACKEND_WEATHER_URL}?city=${encodeURIComponent(city.trim())}`;

      // Fetch the weather data from the backend WITH Authorization header
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Parse the JSON response from the server
      const data = await response.json();

      // If the server returned an error status, show the message and stop
      if (!response.ok) {
        if (response.status === 401) {
          // Unauthorized - token invalid
          Alert.alert('Session Expired', 'Please login again.', [
            { text: 'OK', onPress: () => logout() },
          ]);
          return;
        }
        const message = data?.error || 'Unable to fetch weather data. Please try again.';
        Alert.alert('Error', message, [{ text: 'OK' }]);
        setWeather(null);
        return;
      }

      // Handle WeatherAPI-specific errors forwarded by the backend
      if (data.error) {
        setWeather(null);
        if (data.error.code === 1006) {
          Alert.alert(
            'City Not Found',
            `We couldn't find weather information for "${city.trim()}".\n\nPlease check the spelling and try again.`,
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert(
            'Error',
            data.error.message || 'Unable to fetch weather data. Please try again.',
            [{ text: 'OK' }]
          );
        }
        return;
      }

      // Validate that the essential fields exist before rendering
      if (!data.location || !data.current) {
        setWeather(null);
        Alert.alert(
          'Invalid Response',
          'Received incomplete weather data. Please try again.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Save the weather data so the UI can render it
      setWeather(data);
    } catch (error) {
      // Catch network or unexpected errors and show a friendly message
      setWeather(null);
      console.error('Weather fetch error:', error);
      Alert.alert(
        'Network Error',
        'Unable to connect to the weather service. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.weatherBackground }}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-1 px-5 pt-4">
              {/* Top Header: Always visible with Settings button */}
              <View className="flex-row justify-between items-center mb-5 pt-2">
                {weather && weather.location ? (
                  <View className="flex-row items-center flex-1">
                    <Text className="text-xl mr-2">📍</Text>
                    <View>
                      <Text style={{ fontSize: 18, fontWeight: '600', color: theme.text, marginBottom: 2 }}>
                        {weather.location?.name}
                        {weather.location?.region && `, ${weather.location.region}`}
                      </Text>
                      <Text style={{ fontSize: 14, color: theme.textSecondary, fontWeight: '400' }}>
                        {formatDate(weather.location?.localtime)}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View className="flex-1" />
                )}
                <TouchableOpacity 
                  onPress={() => navigation?.navigate('Settings')} 
                  className="p-2"
                >
                  <Text className="text-2xl text-white font-bold">⚙️</Text>
                </TouchableOpacity>
              </View>

              {/* Search Bar */}
              <View className="mb-8">
                <View
                  className="flex-row items-center rounded-xl px-4 py-3"
                  style={{
                    backgroundColor: theme.searchBackground,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <Text className="text-xl mr-3">🔍</Text>
                  <TextInput
                    className="flex-1 text-base p-0"
                    style={{ color: theme.searchText }}
                    placeholder="Search for a city or airport"
                    placeholderTextColor={theme.textTertiary}
                    value={city}
                    onChangeText={setCity}
                    returnKeyType="search"
                    onSubmitEditing={getWeather}
                  />
                  <TouchableOpacity className="p-1">
                    <Text className="text-xl">🎤</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Main Weather Display */}
              {weather && weather.location && weather.current && (
                <>
                  <View className="items-center mb-10 py-5">
                    <Text className="text-[120px] mb-2.5">
                      {getWeatherIcon(weather.current?.condition?.text)}
                    </Text>
                    <Text
                      style={{ 
                        fontSize: 96, 
                        fontWeight: '300', 
                        color: theme.text, 
                        marginBottom: 8,
                        letterSpacing: -4 
                      }}
                    >
                      {celsiusToFahrenheit(weather.current?.temp_c || 0)}°
                    </Text>
                    <Text style={{ 
                      fontSize: 20, 
                      color: theme.text, 
                      fontWeight: '500', 
                      marginBottom: 16, 
                      textTransform: 'capitalize' 
                    }}>
                      {weather.current?.condition?.text || 'N/A'}
                    </Text>
                    <View className="flex-row gap-4">
                      <Text style={{ fontSize: 18, color: theme.text, fontWeight: '500' }}>
                        H: {celsiusToFahrenheit(weather.current?.temp_c || 0) + 6}°
                      </Text>
                      <Text style={{ fontSize: 18, color: theme.text, fontWeight: '500' }}>
                        L: {celsiusToFahrenheit(weather.current?.temp_c || 0) - 8}°
                      </Text>
                    </View>
                  </View>

                  {/* Metric Cards: Humidity, Wind, UV Index */}
                  <View className="flex-row justify-between mb-10 gap-3">
                    <View
                      className="flex-1 rounded-2xl p-4 items-center border"
                      style={{
                        backgroundColor: theme.metricCardBg,
                        borderColor: theme.metricCardBorder,
                      }}
                    >
                      <Text className="text-[32px] mb-2">💧</Text>
                      <Text style={{ fontSize: 11, color: theme.textSecondary, fontWeight: '600', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>
                        HUMIDITY
                      </Text>
                      <Text style={{ fontSize: 20, color: theme.text, fontWeight: 'bold' }}>
                        {weather.current?.humidity || 0}%
                      </Text>
                    </View>
                    <View
                      className="flex-1 rounded-2xl p-4 items-center border"
                      style={{
                        backgroundColor: theme.metricCardBg,
                        borderColor: theme.metricCardBorder,
                      }}
                    >
                      <Text className="text-[32px] mb-2">💨</Text>
                      <Text style={{ fontSize: 11, color: theme.textSecondary, fontWeight: '600', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>
                        WIND
                      </Text>
                      <Text style={{ fontSize: 20, color: theme.text, fontWeight: 'bold' }}>
                        {kmhToMph(weather.current?.wind_kph || 0)}mph
                      </Text>
                    </View>
                    <View
                      className="flex-1 rounded-2xl p-4 items-center border"
                      style={{
                        backgroundColor: theme.metricCardBg,
                        borderColor: theme.metricCardBorder,
                      }}
                    >
                      <Text className="text-[32px] mb-2">☀️</Text>
                      <Text style={{ fontSize: 11, color: theme.textSecondary, fontWeight: '600', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>
                        UV INDEX
                      </Text>
                      <Text style={{ fontSize: 20, color: theme.text, fontWeight: 'bold' }}>
                        {weather.current?.uv || 0}
                      </Text>
                    </View>
                  </View>

                  {/* 5-Day Forecast Section */}
                  <View className="mb-5">
                    <View className="flex-row justify-between items-center mb-4">
                      <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, letterSpacing: 1 }}>
                        5-DAY FORECAST
                      </Text>
                      <TouchableOpacity>
                        <Text style={{ fontSize: 14, color: theme.textSecondary, fontWeight: '600' }}>
                          View All
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ paddingRight: 20 }}
                    >
                      {/* Forecast cards - using placeholder data since we only have current weather */}
                      {[0, 1, 2, 3, 4].map((day, index) => {
                        const dayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
                        const icons = ['☁️', '☀️', '☁️', '🌧️', '☀️'];
                        const isToday = index === 0;
                        return (
                          <View
                            key={index}
                            className="rounded-2xl p-4 items-center mr-3 border min-w-[80px]"
                            style={{
                              backgroundColor: isToday
                                ? theme.metricCardBg
                                : theme.cardBackground,
                              borderColor: isToday ? theme.metricCardBorder : theme.border,
                              borderWidth: 1,
                            }}
                          >
                            <Text style={{ fontSize: 12, color: theme.textSecondary, fontWeight: '600', marginBottom: 8 }}>
                              {dayNames[index]}
                            </Text>
                            <Text className="text-[32px] mb-2">{icons[index]}</Text>
                            <Text style={{ fontSize: 16, color: theme.text, fontWeight: 'bold', marginBottom: 4 }}>
                              {celsiusToFahrenheit(weather.current?.temp_c || 0) + (index * 2)}°
                            </Text>
                            <Text style={{ fontSize: 14, color: theme.textSecondary, fontWeight: '500' }}>
                              {celsiusToFahrenheit(weather.current?.temp_c || 0) - 8 - (index * 2)}°
                            </Text>
                          </View>
                        );
                      })}
                    </ScrollView>
                  </View>
                </>
              )}

              {/* Show search prompt when no weather data */}
              {!weather && (
                <View className="flex-1 justify-center items-center py-16">
                  <Text style={{ fontSize: 16, color: theme.textSecondary, textAlign: 'center', fontWeight: '500' }}>
                    Search for a city to see weather information
                  </Text>
                  {loading && (
                    <Text style={{ fontSize: 14, color: theme.textSecondary, marginTop: 12, fontWeight: '400' }}>
                      Loading weather data...
                    </Text>
                  )}
                </View>
              )}
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default WeatherScreen;
