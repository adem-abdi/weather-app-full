const path = require('path'); // Helps build file paths
require('dotenv').config({ path: path.join(__dirname, '.env') }); // Load env vars (keeps API key off frontend)
const express = require('express'); // Web server
const cors = require('cors'); // Allow frontend (Expo) to call this backend

const weatherRoutes = require('./routes/weatherRoutes'); // Weather API routes

const app = express();
const PORT = process.env.PORT || 3000; // Port the server listens on

app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

app.use('/api', weatherRoutes); // Mount /api routes

// Simple health endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Fallback for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`📝 Available endpoints:`);
  console.log(`   GET  /api/weather?city=London - Fetch weather for a city`);
  console.log(`   GET  /health - Check server status`);
});
