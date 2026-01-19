
// tusaale iyo sharaxaad: backend/controllers/weatherController.js

const axios = require('axios');
// axios = a tool that allows the backend to send HTTP requests (like calling WeatherAPI)


const WEATHER_API_BASE_URL = 'https://api.weatherapi.com/v1/current.json';
// This is the WeatherAPI URL we will call to get weather data for a city

const weatherController = {
  // This method handles GET /api/weather?city=London
  getWeather: async (req, res) => {

    // req.query.city = value from URL like ?city=Hargeisa
    const city = req.query.city.trim();

    // Read the secret API key stored in backend/.env
    const apiKey = process.env.WEATHER_API_KEY;

    // If the API key is missing, stop the request.
    // The backend cannot call WeatherAPI without a key.
    if (!apiKey) {
      return res.status(500).json({
        error: 'Server configuration error: WEATHER_API_KEY is missing. Add it to your .env file on the backend.'
      });
    }

    try {
      // Build the full WeatherAPI URL with:
      // - base URL
      // - api key
      // - city name (encoded for safety)
      const url = `${WEATHER_API_BASE_URL}?key=${apiKey}&q=${encodeURIComponent(city)}`;

      // Call WeatherAPI and wait for the response
      const response = await axios.get(url);

      // Send WeatherAPI data directly back to the frontend.
      // No need to modify it — frontend can use it as-is.
      return res.json(response.data);

    } catch (error) {

      // If WeatherAPI returned a known error (example: invalid city)
      // WeatherAPI gives a structured error like:
      // {
      //   error: { message: "No matching location found.", code: 1006 }
      // }
      if (error.response?.data?.error) {
        const { message, code } = error.response.data.error;

        // Send the same useful error info back to the frontend
        return res.status(error.response.status || 400).json({
          error: message || 'Unable to fetch weather data.',
          code
        });
      }

      // If something unexpected happened (network issue, server down, etc.)
      console.error('Weather API error:', error.message);

      return res.status(500).json({
        error: 'Unable to fetch weather data. Please try again later.'
      });
    }
  }
};

// Export the controller so routes/weatherRoutes.js can use it
module.exports = weatherController;