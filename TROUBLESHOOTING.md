# Troubleshooting Authentication Issues

## Issue 1: Registration Error - "Server error during registration" but user is saved

### Problem
User is being saved to the database, but you get an error message.

### Root Cause
The `JWT_SECRET` environment variable is missing or not configured properly. When the server tries to generate a JWT token after creating the user, it fails because there's no secret key.

### Solution

1. **Check your `backend/.env` file** - Make sure it contains:
   ```env
   JWT_SECRET=your_super_secret_jwt_key_here
   ```
   Replace `your_super_secret_jwt_key_here` with a random string (at least 32 characters recommended).

2. **Generate a secure JWT secret** (optional but recommended):
   ```bash
   # On Mac/Linux:
   openssl rand -base64 32
   
   # Or use any random string generator
   ```

3. **Restart your backend server** after adding JWT_SECRET:
   ```bash
   cd backend
   npm start
   ```

4. **Check server logs** - You should see:
   ```
   ✅ MongoDB connected successfully
   ✅ Server is running on http://localhost:3000
   ```
   If you see an error about JWT_SECRET, the server will exit with a clear message.

### What Was Fixed
- Added JWT_SECRET validation on server startup
- Improved error handling in registration controller
- If JWT generation fails, the user is now deleted (to prevent orphaned records)
- Better error messages to identify the issue

---

## Issue 2: Login Timeout - "Network request timed out"

### Problem
Login request times out after 10 seconds.

### Possible Causes

1. **Backend server not running**
   - Check if your backend server is running
   - Look for: `✅ Server is running on http://localhost:3000`

2. **Wrong backend URL**
   - Check `context/AuthContext.js` - the `BACKEND_URL` should match your server
   - For local development: `http://localhost:3000`
   - For mobile device: `http://YOUR_IP_ADDRESS:3000`

3. **Network connectivity**
   - Ensure your device/emulator can reach the backend
   - Check firewall settings
   - For mobile: ensure both devices are on the same network

4. **CORS issues**
   - The backend should have CORS enabled (it does by default)
   - Check backend logs for CORS errors

### Solution

1. **Verify backend is running:**
   ```bash
   cd backend
   npm start
   ```

2. **Test backend directly:**
   ```bash
   # Test health endpoint
   curl http://localhost:3000/health
   
   # Or open in browser
   http://localhost:3000/health
   ```

3. **Check backend URL in frontend:**
   - Open `context/AuthContext.js`
   - Verify `BACKEND_URL` is correct
   - For mobile testing, use your computer's IP address, not `localhost`

4. **Check backend logs** when you try to login:
   - You should see the request coming in
   - Look for any error messages

### What Was Fixed
- Added 10-second timeout to fetch requests
- Better error messages for timeout vs network errors
- Improved error handling in login function

---

## Quick Checklist

Before testing authentication, ensure:

- [ ] Backend server is running (`npm start` in backend folder)
- [ ] `backend/.env` file exists with:
  - [ ] `MONGODB_URI` (with actual password, not `<db_password>`)
  - [ ] `JWT_SECRET` (random string)
  - [ ] `WEATHER_API_KEY` (if using weather features)
- [ ] Frontend `BACKEND_URL` in `context/AuthContext.js` matches your server
- [ ] Both frontend and backend are on the same network (for mobile testing)
- [ ] No firewall blocking port 3000

---

## Testing Steps

1. **Start Backend:**
   ```bash
   cd backend
   npm start
   ```
   Should see: `✅ MongoDB connected successfully`

2. **Start Frontend:**
   ```bash
   npm start
   ```

3. **Test Registration:**
   - Fill in username, email, password
   - Tap "Sign Up"
   - Should automatically log you in and show Weather screen

4. **Test Login:**
   - Logout first
   - Enter email and password
   - Tap "Sign In"
   - Should show Weather screen

---

## Common Error Messages

### "JWT_SECRET is missing"
- **Fix:** Add `JWT_SECRET=your_secret_key` to `backend/.env`

### "MongoDB connection error"
- **Fix:** Check `MONGODB_URI` in `backend/.env` has correct password

### "Request timeout"
- **Fix:** Check backend is running and `BACKEND_URL` is correct

### "Network error"
- **Fix:** Check network connectivity and backend URL

### "Email already exists"
- **Fix:** Use a different email or delete the user from database

---

## Still Having Issues?

1. **Check backend console logs** - Look for error messages
2. **Check frontend console** - Look for network errors
3. **Verify environment variables** - Make sure `.env` file is in `backend/` folder
4. **Test with a simple curl command:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username":"test","email":"test@test.com","password":"password123"}'
   ```

