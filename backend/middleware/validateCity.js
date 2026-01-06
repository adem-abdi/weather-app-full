// Middleware function to validate that the "city" query parameter is provided
// This runs before the main controller handles the request
const validateCity = (req, res, next) => {
  // Extract the "city" parameter from the URL query string
  // Example URL: /api/weather?city=London
  const { city } = req.query;

  // Check if "city" is missing, not a string, or an empty string
  // - !city → checks if city is null, undefined, or empty
  // - typeof city !== 'string' → ensures the input is actually text
  // - city.trim().length === 0 → removes spaces and checks if anything is left
  if (!city || typeof city !== 'string' || city.trim().length === 0) {
    // If the check fails, stop processing and respond with status 400 (Bad Request)
    // Provide a helpful error message to guide the user
    return res.status(400).json({
      error: 'City query parameter is required. Example: /api/weather?city=London'
    });
  }

  // If all checks pass, call next() to continue to the main controller
  next();
};

// Export this function so it can be used in routes
module.exports = validateCity;
