# 🚀 Quick Start Commands

## One-Time Setup

### 1. Backend Dependencies

```powershell
cd DSA-Recommender\leetcode_backend
npm install
npm install bcryptjs
Copy-Item .env.example .env
# Edit .env and add JWT_SECRET (32+ characters)
```

### 2. ML Backend Dependencies

```powershell
cd DSA-Recommender\dsa_backend
pip install -r requirements.txt
```

### 3. Frontend Dependencies

```powershell
cd DSA-Recommender\frontend
npm install
# .env.local already created with correct values
```

---

## Daily Development

### Start All Servers (3 Terminals)

**Terminal 1 - Node.js Backend (Port 5000)**

```powershell
cd DSA-Recommender\leetcode_backend
node app.js
```

**Terminal 2 - ML Backend (Port 8000)**

```powershell
cd DSA-Recommender\dsa_backend
uvicorn main:app --reload --port 8000
```

**Terminal 3 - Frontend (Port 3000)**

```powershell
cd DSA-Recommender\frontend
npm run dev
```

### Access Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- ML API: http://localhost:8000/docs

---

## Test Flow

1. **Signup:** http://localhost:3000/login → Sign up tab → Create account
2. **Personalize:** Fill preferences → Click "Go to Dashboard"
3. **Dashboard:** View AI recommendations → Click "Start Practice"
4. **Report:** Navigate to Reports → See analytics
5. **Profile:** Click profile icon → View stats
6. **Topics:** Click topic card → Browse problems

---

## Environment Variables

### Backend (.env)

```env
JWT_SECRET=generate-with-crypto-randomBytes-32-chars-minimum
MONGODB_URI=mongodb://localhost:27017/dsa_recommender
PORT=5000
FRONTEND_URL=http://localhost:3000
```

Generate secret:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Frontend (.env.local) - Already Created ✅

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_ML_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=CodeAscend
```

---

## Troubleshooting

### Backend won't start

```powershell
# Check MongoDB is running
Get-Service MongoDB

# Verify .env exists and JWT_SECRET is set
Get-Content .env

# Check port 5000 is free
netstat -ano | findstr :5000
```

### ML Backend errors

```powershell
# Reinstall dependencies
pip install --upgrade sentence-transformers transformers torch

# Test model loading
python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')"
```

### Frontend build errors

```powershell
# Clear cache and reinstall
Remove-Item -Recurse -Force node_modules, .next
npm install
npm run dev
```

---

## API Endpoints Reference

### Auth

- POST `/api/auth/signup` - Create account
- POST `/api/auth/login` - Login
- POST `/api/auth/logout` - Logout
- GET `/api/auth/me` - Get current user

### User

- GET `/api/user/:username` - Get profile
- POST `/api/user/preferences` - Save preferences

### Analytics

- GET `/api/analytics/report/:username` - Get report
- GET `/api/analytics/progress/:username` - Get progress

### Problems

- GET `/api/problems/all` - All problems
- GET `/api/problems/topic/:topic` - Topic problems

### ML (Port 8000)

- POST `/api/recommend` - Get recommendations

---

## Files Modified (Phase 1)

### Frontend ✅

- `src/pages/dashboard.js` - ML recommendations
- `src/pages/report.js` - Real analytics
- `src/pages/personalize.js` - Save preferences
- `src/pages/profile.js` - User data
- `src/pages/topic/[topic].js` - Database problems
- `src/pages/login.js` - Real authentication
- `src/pages/_app.js` - Auth provider wrapper
- `src/contexts/AuthContext.js` - NEW (auth state)
- `src/utils/api.js` - NEW (API client)
- `.env.local` - NEW (environment config)

### Backend ✅

- `src/middleware/auth.js` - NEW (JWT middleware)
- `src/api/auth.js` - NEW (auth endpoints)
- `src/model/userModel.js` - Enhanced (password, indexes)
- `src/model/problemModel.js` - Enhanced (7 indexes)
- `app.js` - Updated (auth routes, CORS)
- `.env.example` - NEW (config template)

---

## Next Steps

### To Test Authentication:

1. Start all 3 servers
2. Visit http://localhost:3000/login
3. Create account → See personalization page
4. Fill preferences → See dashboard with recommendations

### To Add Problems to Database:

(Not yet implemented - Phase 2)

```javascript
// Will need to create seed script
// Use leetcode-query to fetch and store problems
```

### To Enable Redis Caching:

(Phase 2 - Not started)

```powershell
# Install Redis for Windows
# Configure REDIS_HOST and REDIS_PORT in .env
```

---

## Status

✅ **Phase 1 Complete** - Core Integration

- Authentication system
- Frontend → Backend integration
- Backend → ML integration
- Database optimization
- Real-time data flow

🔜 **Phase 2 Next** - Performance & Caching

- Redis implementation
- ML optimization
- Response compression

---

## Quick Health Check

All systems operational when you see:

**Terminal 1 (Backend):**

```
Server running on port 5000
Connected to MongoDB
```

**Terminal 2 (ML):**

```
INFO: Uvicorn running on http://127.0.0.1:8000
```

**Terminal 3 (Frontend):**

```
ready - started server on 0.0.0.0:3000
```

---

## Documentation

- 📘 Full Setup Guide: `SETUP_GUIDE.md`
- 📊 Implementation Details: `IMPLEMENTATION_SUMMARY.md`
- 🎯 This Quick Reference: `QUICK_START.md`

---

**Last Updated:** November 21, 2025
