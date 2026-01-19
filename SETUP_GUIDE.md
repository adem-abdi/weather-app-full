# Authentication Setup Guide

This guide will help you set up the authentication system for the weather app.

## 🔧 Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

This will install:
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT token generation
- Other existing dependencies

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=3000
WEATHER_API_KEY=your_weatherapi_key_here

# MongoDB Connection
# Replace YOUR_PASSWORD_HERE with your actual MongoDB password
MONGODB_URI=mongodb+srv://aabocade0_db_user:YOUR_PASSWORD_HERE@app-two.vamjv4w.mongodb.net/?appName=app-two

# JWT Secret (use a random string - keep this secret!)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=30d
```

**Important:** 
- Replace `YOUR_PASSWORD_HERE` with your actual MongoDB password
- Change `JWT_SECRET` to a random string (you can generate one using: `openssl rand -base64 32`)

### 3. Start the Backend Server

```bash
npm start
# or for development with auto-reload:
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
✅ Server is running on http://localhost:3000
```

## 📱 Frontend Setup

### 1. Install Dependencies

```bash
# From the root directory
npm install
```

This will install:
- `@react-native-async-storage/async-storage` - Token storage

### 2. Update Backend URL

Update the `BACKEND_URL` in `context/AuthContext.js` and `BACKEND_WEATHER_URL` in `screens/WeatherScreen.js`:

- For local development: `http://localhost:3000`
- For mobile device testing: `http://YOUR_IP_ADDRESS:3000` (replace with your machine's IP)

To find your IP:
- **Windows**: Run `ipconfig` in Command Prompt, look for IPv4 Address
- **Mac/Linux**: Run `ifconfig` in Terminal, look for inet address

### 3. Start the Frontend

```bash
npm start
```

## 🧪 Testing the Authentication

### 1. Register a New User

1. Open the app
2. You'll see the Login screen
3. Tap "Sign Up" or navigate to Register
4. Enter:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123` (min 6 characters)
5. Tap "Sign Up"

If successful, you'll be automatically logged in and see the Weather screen.

### 2. Login

1. If you're logged out, you'll see the Login screen
2. Enter:
   - Email: `test@example.com`
   - Password: `password123`
3. Tap "Sign In"

### 3. Access Weather Data

Once logged in:
1. You'll see the Weather screen with a welcome message
2. Enter a city name (e.g., "London")
3. Tap "Get Weather"
4. The app will send the request with your JWT token in the Authorization header

### 4. Logout

Tap the "Logout" button in the top right corner of the Weather screen.

## 🔒 How It Works

### Backend Flow

1. **Registration/Login**: User credentials are validated
2. **Password Hashing**: Passwords are hashed with bcryptjs before storing
3. **JWT Generation**: A JWT token is generated and returned to the client
4. **Protected Routes**: Weather routes require a valid JWT token in the Authorization header

### Frontend Flow

1. **Token Storage**: JWT token is stored in AsyncStorage
2. **Auth Context**: React Context manages authentication state
3. **Conditional Rendering**: 
   - If `userToken == null` → Show Login/Register screens
   - If `userToken` exists → Show Weather screen
4. **API Calls**: All weather requests include `Authorization: Bearer <token>` header

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Failed:**
- Check your MongoDB URI in `.env`
- Ensure you replaced `<db_password>` with your actual password
- Verify your IP is whitelisted in MongoDB Atlas (if using Atlas)

**JWT Secret Missing:**
- Ensure `JWT_SECRET` is set in `.env`
- Restart the server after adding it

**401 Unauthorized Errors:**
- Check that the token is being sent in the Authorization header
- Verify the token hasn't expired
- Ensure `JWT_SECRET` matches between token generation and verification

### Frontend Issues

**Cannot Connect to Backend:**
- Verify backend server is running
- Check the `BACKEND_URL` matches your backend server address
- For mobile devices, ensure both devices are on the same network
- Use your machine's IP address instead of `localhost`

**Token Not Persisting:**
- Check AsyncStorage permissions (should work by default)
- Clear app data and try again

**Navigation Not Working:**
- The app uses simple state-based navigation
- Ensure you're tapping the correct navigation buttons

## 📝 File Structure

```
weather-app/
├── backend/
│   ├── models/
│   │   └── User.js              # User schema with password hashing
│   ├── controllers/
│   │   ├── authController.js    # registerUser, loginUser
│   │   └── weatherController.js # getWeather (protected)
│   ├── middleware/
│   │   ├── protect.js           # JWT verification middleware
│   │   └── validateCity.js     # City validation
│   ├── routes/
│   │   ├── authRoutes.js        # /api/auth routes
│   │   └── weatherRoutes.js     # /api/weather (protected)
│   └── server.js                # Express server + MongoDB connection
├── context/
│   └── AuthContext.js           # Auth state management
├── screens/
│   ├── LoginScreen.js           # Login UI
│   ├── RegisterScreen.js       # Register UI
│   └── WeatherScreen.js        # Weather UI (protected)
└── App.js                       # Conditional rendering based on auth
```

## ✅ Checklist

- [ ] Backend dependencies installed
- [ ] `.env` file created with all required variables
- [ ] MongoDB password replaced in MONGODB_URI
- [ ] JWT_SECRET set to a random string
- [ ] Backend server running successfully
- [ ] Frontend dependencies installed
- [ ] Backend URL updated in AuthContext.js and WeatherScreen.js
- [ ] Frontend app running
- [ ] Successfully registered a user
- [ ] Successfully logged in
- [ ] Weather data accessible after login
- [ ] Logout working correctly

---

**Ready to merge!** Once all checklist items are complete, you can review the changes and merge `adem-branch` into `main`.

