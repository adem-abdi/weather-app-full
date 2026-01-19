const path = require('path'); // Helps build file paths
require('dotenv').config({ path: path.join(__dirname, '.env') }); // Load env vars (keeps API key off frontend)
const express = require('express'); // Web server
const cors = require('cors'); // Allow frontend (Expo) to call this backend
const mongoose = require('mongoose'); // MongoDB ODM

const weatherRoutes = require('./routes/weatherRoutes'); // Weather API routes
const authRoutes = require('./routes/authRoutes'); // Auth routes

const app = express();
const PORT = process.env.PORT || 3000; // Port the server listens on

// Connect to MongoDB
// Replace <db_password> in your .env file with your actual MongoDB password

// Read MONGODB_URI from .env file (process.env.MONGODB_URI)
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI || MONGODB_URI.includes('<db_password>')) {
  console.error('❌ Please set MONGODB_URI in your .env file with your actual database password');
  process.exit(1);
}

// Check for JWT_SECRET
if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET is missing in your .env file. Please add it.');
  console.error('   Example: JWT_SECRET=your_super_secret_jwt_key_here');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1); // Exit if database connection fails
  });

app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// Auth routes (no protection needed)
app.use('/api/auth', authRoutes);

// Weather routes (protected)
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
  console.log(`   POST /api/auth/register - Register a new user`);
  console.log(`   POST /api/auth/login - Login user`);
  console.log(`   GET  /api/weather?city=London - Fetch weather for a city (protected)`);
  console.log(`   GET  /health - Check server status`);
});
