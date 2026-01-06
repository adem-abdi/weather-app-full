// Import React and the state hook to manage component state
import React, { useState } from "react";
// Import all React Native components used to build and style the UI
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  Alert, 
  KeyboardAvoidingView, 
  Platform,
  Keyboard,
  TouchableWithoutFeedback 
} from "react-native";

// Backend URL that the app will call; replace the IP with your machine's IP if needed
const BACKEND_WEATHER_URL = "http://192.168.1.108:3000/api/weather";

export default function App() {
  // Store the user's input city name
  const [city, setCity] = useState("");
  // Store the weather data returned from the backend
  const [weather, setWeather] = useState(null);

  // Call backend to fetch weather by city
  const getWeather = async () => {
    try {
      // Block empty submissions and show a helpful message
      if (!city.trim()) {
        Alert.alert(
          "fadlan wax ku qor",
          "Please enter a city name to get weather information. (example: Mogadishu)",
          [{ text: "OK" }]
        );
        return;
      }
      // Build the backend request URL with the encoded city name
      const url = `${BACKEND_WEATHER_URL}?city=${encodeURIComponent(city.trim())}`;
      // Fetch the weather data from the backend
      const response = await fetch(url);
      // Parse the JSON response from the server
      const data = await response.json();

      // If the server returned an error status, show the message and stop
      if (!response.ok) {
        const message = data?.error || "Unable to fetch weather data. Please try again.";
        Alert.alert("Error", message, [{ text: "OK" }]);
        setWeather(null);
        return;
      }

      // Handle WeatherAPI-specific errors forwarded by the backend
      if (data.error) {
        setWeather(null);
        if (data.error.code === 1006) {
          Alert.alert(
            "City Not Found",
            `We couldn't find weather information for "${city.trim()}".\n\nPlease check the spelling and try again.`,
            [{ text: "OK" }]
          );
        } else {
          Alert.alert(
            "Error",
            data.error.message || "Unable to fetch weather data. Please try again.",
            [{ text: "OK" }]
          );
        }
        return;
      }

      // Validate that the essential fields exist before rendering
      if (!data.location || !data.current) {
        setWeather(null);
        Alert.alert(
          "Invalid Response",
          "Received incomplete weather data. Please try again.",
          [{ text: "OK" }]
        );
        return;
      }

      // Save the weather data so the UI can render it
      setWeather(data);
    } catch (error) {
      // Catch network or unexpected errors and show a friendly message
      setWeather(null);
      Alert.alert("Network Error", "Unable to connect to the weather service. Please try again.", [{ text: "OK" }]);
    }
  };

  return (
    // Safe area to avoid notches/status bars
    <SafeAreaView style={styles.safeArea}>
      {/* Push content above the keyboard when it opens */}
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* Dismiss keyboard when tapping outside inputs */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {/* Scrollable content so smaller screens can view everything */}
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.container}>
              {/* Header text */}
              <View style={styles.headerSection}>
                <Text style={styles.title}>Weather App</Text>
                <Text style={styles.subtitle}>Check weather conditions worldwide</Text>
              </View>

              {/* Input + button section */}
              <View style={styles.inputSection}>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter city name"
                    placeholderTextColor="#71717a"
                    value={city}
                    onChangeText={setCity}
                    returnKeyType="search"
                    onSubmitEditing={getWeather}
                  />
                </View>

                {/* Button to trigger weather fetch */}
                <TouchableOpacity 
                  style={[styles.button, !city.trim() && styles.buttonDisabled]} 
                  onPress={getWeather}
                  disabled={!city.trim()}
                  activeOpacity={0.9}
                >
                  <Text style={styles.buttonText}>Get Weather</Text>
                </TouchableOpacity>
              </View>

              {/* Weather card only renders when data exists */}
              {weather && weather.location && weather.current && (
                <View style={styles.weatherCard}>
                  {/* City and region info */}
                  <View style={styles.weatherHeader}>
                    <View>
                      <Text style={styles.cityName}>{weather.location?.name}</Text>
                      <Text style={styles.regionText}>
                        {weather.location?.region && `${weather.location.region}, `}
                        {weather.location?.country}
                      </Text>
                    </View>
                  </View>

                  {/* Big temperature and condition */}
                  <View style={styles.temperatureSection}>
                    <View style={styles.temperatureContainer}>
                      <Text style={styles.temperature}>{Math.round(weather.current?.temp_c || 0)}</Text>
                      <Text style={styles.temperatureUnit}>°C</Text>
                    </View>
                    <Text style={styles.conditionText}>{weather.current?.condition?.text || "N/A"}</Text>
                  </View>

                  {/* Divider line */}
                  <View style={styles.divider} />

                  {/* Detail grid */}
                  <View style={styles.detailsGrid}>
                    <View style={styles.detailCard}>
                      <Text style={styles.detailLabel}>Feels Like</Text>
                      <Text style={styles.detailValue}>{Math.round(weather.current?.feelslike_c || 0)}°</Text>
                    </View>
                    <View style={styles.detailCard}>
                      <Text style={styles.detailLabel}>Humidity</Text>
                      <Text style={styles.detailValue}>{weather.current?.humidity || 0}%</Text>
                    </View>
                    <View style={styles.detailCard}>
                      <Text style={styles.detailLabel}>Wind Speed</Text>
                      <Text style={styles.detailValue}>{weather.current?.wind_kph || 0} km/h</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Overall screen background
  safeArea: {
    flex: 1,
    backgroundColor: "#09090b",
  },
  // Keyboard avoidance wrapper
  keyboardView: {
    flex: 1,
  },
  // Scroll content to allow overflow on small screens
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  // Main page padding
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 16,
  },
  // Header alignment and spacing
  headerSection: {
    marginBottom: 32,
    alignItems: "center",
  },
  // App title style
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fafafa",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  // Subtitle style
  subtitle: {
    fontSize: 15,
    color: "#71717a",
    fontWeight: "500",
  },
  // Spacing below the input/button block
  inputSection: {
    marginBottom: 24,
  },
  // Space below input
  inputWrapper: {
    marginBottom: 16,
  },
  // Text input styling
  input: {
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "#27272a",
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: "#fafafa",
    fontWeight: "500",
  },
  // Primary button styling
  button: {
    backgroundColor: "#3b82f6",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  // Disabled button appearance
  buttonDisabled: {
    backgroundColor: "#27272a",
    borderWidth: 1,
    borderColor: "#3f3f46",
    shadowOpacity: 0,
    elevation: 0,
  },
  // Button text styling
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  // Card containing weather details
  weatherCard: {
    backgroundColor: "#18181b",
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "#27272a",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8,
  },
  // Header inside the weather card
  weatherHeader: {
    marginBottom: 24,
  },
  // City name text
  cityName: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fafafa",
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  // Region/country text
  regionText: {
    fontSize: 14,
    color: "#a1a1aa",
    fontWeight: "500",
  },
  // Temperature + condition block
  temperatureSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  // Temperature and unit alignment
  temperatureContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    marginBottom: 12,
  },
  // Big temperature number
  temperature: {
    fontSize: 80,
    fontWeight: "200",
    color: "#fafafa",
    lineHeight: 90,
    letterSpacing: -2,
  },
  // Temperature unit styling
  temperatureUnit: {
    fontSize: 36,
    fontWeight: "300",
    color: "#a1a1aa",
    marginTop: 12,
    marginLeft: 4,
  },
  // Condition text styling
  conditionText: {
    fontSize: 16,
    color: "#71717a",
    fontWeight: "500",
    textTransform: "capitalize",
  },
  // Divider line in card
  divider: {
    height: 1,
    backgroundColor: "#27272a",
    marginBottom: 24,
  },
  // Grid container for detail cards
  detailsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  // Individual detail card style
  detailCard: {
    flex: 1,
    backgroundColor: "#09090b",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#27272a",
    alignItems: "center",
  },
  // Label text for details
  detailLabel: {
    fontSize: 11,
    color: "#71717a",
    fontWeight: "600",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  // Value text for details
  detailValue: {
    fontSize: 18,
    color: "#fafafa",
    fontWeight: "700",
    letterSpacing: -0.3,
  },
});
