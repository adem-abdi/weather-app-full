const express = require('express');
const router = express.Router(); // Create a mini-router instance to handle routes

const validateCity = require('../middleware/validateCity'); // Middleware that checks if the city query exists
const { getWeather } = require('../controllers/weatherController'); // Controller that calls WeatherAPI

// Route: GET /api/weather?city=CityName
// When a user requests this URL, Express will:
// 1. Run validateCity middleware first to check if "city" is provided
// 2. If valid, call getWeather controller to fetch weather data
router.get('/weather', validateCity, getWeather);

module.exports = router;


