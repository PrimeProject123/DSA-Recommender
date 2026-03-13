# DSA-Recommender Setup Guide

## 🎉 Phase 1 Integration Complete!

All frontend pages are now integrated with backend APIs and ML recommendations. Here's how to get everything running.

---

## 📋 Prerequisites

- Node.js (v16 or higher)
- Python 3.8+
- MongoDB running locally or remotely
- npm or yarn

---

## 🚀 Quick Start

### 1. Backend Setup (Node.js + Express)

```powershell
cd DSA-Recommender\leetcode_backend

# Install dependencies
npm install

# Install bcryptjs for authentication
npm install bcryptjs

# Create environment file
Copy-Item .env.example .env

# Edit .env file with your configuration
notepad .env
```

**Required .env variables:**

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dsa_recommender
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
ENCRYPTION_KEY=your-encryption-key-for-sensitive-data
FRONTEND_URL=http://localhost:3000
REDIS_HOST=localhost
REDIS_PORT=6379
```

> **Important:** Generate a strong JWT_SECRET (minimum 32 characters). Use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

```powershell
# Start the backend server
node app.js
```

**Expected output:**

```
Server running on port 5000
Connected to MongoDB
```

---

### 2. ML Backend Setup (Python + FastAPI)

```powershell
cd DSA-Recommender\dsa_backend

# Create virtual environment (optional but recommended)
python -m venv venv
.\venv\Scripts\Activate

# Install dependencies
pip install -r requirements.txt

# Start the ML server
uvicorn main:app --reload --port 8000
```

**Expected output:**

```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

---

### 3. Frontend Setup (Next.js)

```powershell
cd DSA-Recommender\frontend

# Install dependencies
npm install

# Environment file is already created (.env.local)
# Verify it contains:
# NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
# NEXT_PUBLIC_ML_URL=http://localhost:8000
# NEXT_PUBLIC_APP_NAME=CodeAscend

# Start the development server
npm run dev
```

**Expected output:**

```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

---

## 🧪 Testing the Application

### Step 1: Create an Account

1. Open http://localhost:3000/login
2. Click "Sign up" tab
3. Fill in:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
4. Click "Sign up"
5. You should be redirected to `/personalize`

### Step 2: Complete Personalization

1. Select programming languages (e.g., Python, JavaScript)
2. Choose experience level (e.g., Intermediate)
3. Select preparation goal (e.g., Placement)
4. Set daily target (e.g., 3 questions/day)
5. Pick confident topics (e.g., Arrays, Strings)
6. Click "Go to Dashboard"

### Step 3: View Dashboard

- ✅ Should see personalized greeting with your username
- ✅ Should see AI-recommended problems from ML backend
- ✅ Streak counter (starts at 0 for new users)
- ✅ Click "Refresh Recommendations" to get new problems
- ✅ Click "Start Practice" to open first problem on LeetCode

### Step 4: Check Report

1. Navigate to `/report`
2. ✅ Should see overall stats (initially 0 for new users)
3. ✅ Topic-wise analysis cards
4. ✅ Click any topic to see problems

### Step 5: View Profile

1. Click profile icon in header
2. ✅ Should see your user data
3. ✅ Progress tab shows activity calendar
4. ✅ Settings tab allows preferences update

### Step 6: Browse Topics

1. Go to `/report`
2. Click on any topic (e.g., Arrays)
3. ✅ Should see list of problems for that topic
4. ✅ Filter by difficulty, status, search
5. ✅ Click "Solve" to open problem on LeetCode

---

## 🔧 Troubleshooting

### Backend won't start

**Error:** `JWT_SECRET must be at least 32 characters`

- **Solution:** Update `.env` with a longer JWT_SECRET

**Error:** `Cannot connect to MongoDB`

- **Solution:** Ensure MongoDB is running

  ```powershell
  # Check if MongoDB service is running
  Get-Service MongoDB

  # Or start MongoDB manually
  mongod
  ```

### ML Backend errors

**Error:** `ModuleNotFoundError: No module named 'sentence_transformers'`

- **Solution:**
  ```powershell
  pip install sentence-transformers transformers torch
  ```

**Error:** Model download timeout

- **Solution:** The first run downloads a 90MB model. Wait or download manually:
  ```python
  from sentence_transformers import SentenceTransformer
  model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
  ```

### Frontend issues

**Error:** `Module not found: Can't resolve '../contexts/AuthContext'`

- **Solution:** Restart the Next.js dev server
  ```powershell
  # Stop with Ctrl+C, then restart
  npm run dev
  ```

**Error:** API calls failing with CORS errors

- **Solution:** Verify `FRONTEND_URL=http://localhost:3000` in backend `.env`

### Database is empty

**No problems showing up:**

- The database needs to be populated with LeetCode problems
- Sync problems using the backend API:
  ```powershell
  # Call sync endpoint (implement if needed)
  curl http://localhost:5000/api/sync/problems
  ```

---

## 📊 What's Been Integrated

### ✅ Completed Features

1. **Authentication System**

   - JWT-based auth with httpOnly cookies
   - Bcrypt password hashing
   - React Context for global auth state
   - Protected routes

2. **Dashboard → ML Integration**

   - Fetches user profile and solved problems
   - Calls ML backend for personalized recommendations
   - Displays top 3 recommended problems with difficulty
   - Real-time refresh button
   - Direct links to LeetCode

3. **Personalize → Backend Save**

   - Saves all preferences to user profile
   - Validates input before submission
   - Loading state during save
   - Redirects to dashboard after success

4. **Report → Real Analytics**

   - Fetches actual user statistics
   - Topic-wise breakdown from backend
   - Difficulty distribution (Easy/Medium/Hard)
   - Streak counter
   - Links to topic pages

5. **Profile → User Data**

   - Real user information display
   - Progress charts and calendar heatmap
   - Settings management
   - LeetCode integration settings

6. **Topic Pages → Database Problems**

   - Fetches problems by topic from database
   - Shows solved/unsolved status
   - Filter by difficulty and status
   - Search functionality
   - Direct solve links

7. **Database Optimization**
   - Indexes on User model (username, email, lastSynced)
   - Indexes on Problem model (7 indexes including compound)
   - Optimized query performance

---

## 🔜 Next Steps (Phase 2 & 3)

### Phase 2: Performance & Caching

- [ ] Implement Redis caching for problems list
- [ ] Cache user profiles (5-minute TTL)
- [ ] Pre-compute ML embeddings for faster recommendations
- [ ] Add rate limiting to APIs

### Phase 3: Security Hardening

- [ ] Input validation middleware (express-validator)
- [ ] Rate limiting (express-rate-limit)
- [ ] Encrypt LeetCode session tokens
- [ ] Add HTTPS in production
- [ ] Implement refresh tokens
- [ ] Add CSRF protection

### Phase 4: Advanced Features

- [ ] Real-time LeetCode sync
- [ ] Contest tracking
- [ ] Social features (compare with friends)
- [ ] Email notifications
- [ ] Mobile responsive improvements
- [ ] PWA support

---

## 🐛 Known Issues

1. **Empty recommendations:** Requires problems in database. Need to implement problem sync endpoint.
2. **Calendar heatmap:** Needs real submission data. Currently shows mock for visualization.
3. **Progress charts:** Monthly stats need aggregation pipeline in backend.

---

## 📚 API Endpoints

### Authentication

- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### User Management

- `GET /api/user/:username` - Get user profile
- `PUT /api/user/:username` - Update profile

### Analytics

- `GET /api/analytics/report/:username` - Get full report
- `GET /api/analytics/progress/:username` - Get progress data

### Problems

- `GET /api/problems/all` - Get all problems
- `GET /api/problems/topic/:topic` - Get problems by topic

### Preferences

- `POST /api/user/preferences` - Save user preferences
- `GET /api/user/preferences` - Get user preferences

### ML Recommendations

- `POST /api/recommend` (ML Backend) - Get personalized recommendations

---

## 💡 Tips

1. **Testing with mock data:** If database is empty, some pages will show empty states. That's expected.

2. **First-time ML recommendations:** May take 3-5 seconds as the model loads.

3. **Development workflow:**

   ```powershell
   # Terminal 1: Backend
   cd leetcode_backend; node app.js

   # Terminal 2: ML Backend
   cd dsa_backend; uvicorn main:app --reload --port 8000

   # Terminal 3: Frontend
   cd frontend; npm run dev
   ```

4. **Database seeding:** Consider creating a seed script to populate problems:
   ```javascript
   // leetcode_backend/scripts/seed.js
   // Use leetcode-query to fetch and store problems
   ```

---

## 🎯 Success Criteria

You'll know everything is working when:

- ✅ Can sign up and login successfully
- ✅ Personalization saves and redirects to dashboard
- ✅ Dashboard shows ML recommendations (if problems exist)
- ✅ Report page displays user stats
- ✅ Profile shows real user data
- ✅ Topic pages filter and display problems
- ✅ All navigation works smoothly
- ✅ Dark/light theme toggles properly

---

## 📞 Support

If you encounter issues:

1. Check browser console for errors
2. Check terminal logs for backend/ML errors
3. Verify all environment variables are set
4. Ensure all three servers are running
5. Check MongoDB connection

---

**Status:** Phase 1 Core Integration ✅ COMPLETE

**Next Phase:** Redis Caching & ML Optimization 🚀
