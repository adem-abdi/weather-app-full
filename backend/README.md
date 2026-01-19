# Weather App Backend Server

Backend proxy for WeatherAPI requests. The frontend calls this server only; the WeatherAPI key stays on the backend.

## 🚀 Quick Start

1) Install dependencies (from `backend` folder)
```bash
npm install
```

2) Create a `.env` file in `backend` (not committed)
```
PORT=3000
WEATHER_API_KEY=your_weatherapi_key_here

# MongoDB Connection
# Replace <db_password> with your actual MongoDB password
MONGODB_URI=mongodb+srv://aabocade0_db_user:YOUR_PASSWORD_HERE@app-two.vamjv4w.mongodb.net/?appName=app-two

# JWT Secret (use a random string for production)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=30d
```

3) Start the server
- Regular: `npm start`
- Dev (auto-restart): `npm run dev`

You should see:
```
✅ Server is running on http://localhost:3000
```

## 📡 API Endpoints

### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### POST /api/auth/login
Login user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### GET /api/weather?city=London
**Protected Route** - Requires Authorization header: `Bearer <token>`
Proxies to WeatherAPI and returns the same shape as WeatherAPI’s `current.json`.

**Success response (example)**
```json
{
  "location": { "name": "London", "...": "..." },
  "current": { "temp_c": 18, "condition": { "text": "Sunny" }, "...": "..." }
}
```

**Error response (example)**
```json
{ "error": "No matching location found." }
```

### GET /health
Simple health check.

## 🧠 How It’s Organized
- `server.js` — bootstraps Express, loads .env, mounts routes, starts server.
- `routes/weatherRoutes.js` — defines `/api/weather`.
- `controllers/weatherController.js` — calls WeatherAPI with the secret key and returns data.
- `middleware/validateCity.js` — ensures `city` query is present before hitting the controller.

## 🔧 Troubleshooting
- **Port in use**: change `PORT` in `.env` (e.g., 3001).
- **WeatherAPI key missing**: ensure `WEATHER_API_KEY` is set in `.env`.
- **Mobile device access**: replace `localhost` in the frontend with your machine’s LAN IP (e.g., `http://192.168.1.10:3000`).

