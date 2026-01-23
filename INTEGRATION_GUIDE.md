# Frontend-Backend Integration Guide

## ✅ Integration Complete!

Your Next.js frontend is now connected to the FastAPI backend with PostgreSQL (Neon DB).

## What's Been Integrated

### 1. **API Client** ([lib/api.ts](lib/api.ts))
   - Centralized API client with authentication
   - JWT token management
   - Error handling
   - Type-safe API calls

### 2. **Environment Configuration** ([.env.local](.env.local))
   - Backend API URL configuration
   - Can be changed for production deployment

### 3. **Authentication Pages Updated**
   - **Login Page** - Now calls FastAPI `/api/auth/login`
   - **Signup Page** - Now calls FastAPI `/api/auth/signup`
   - Auto-login after signup
   - JWT token stored in localStorage
   - User data fetched from backend

## How to Test the Integration

### Step 1: Start Backend (Terminal 1)
```bash
cd backend
.\venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

Backend will run on: http://localhost:8000

### Step 2: Start Frontend (Terminal 2)
```bash
# From root directory
pnpm dev
```

Frontend will run on: http://localhost:3000

### Step 3: Test Signup Flow
1. Go to http://localhost:3000/signup
2. Select **Teacher** or **Student**
3. Fill in the form:
   - Full Name: John Doe
   - Email: john@example.com
   - Username: johndoe123
   - Password: securepass123 (min 8 chars)
   - Confirm Password: securepass123
4. Click **Sign Up**
5. You should be automatically logged in and redirected!

### Step 4: Test Login Flow
1. Go to http://localhost:3000/login
2. Enter credentials:
   - Email: john@example.com
   - Password: securepass123
3. Click **Log In**
4. You'll be redirected to dashboard based on user type

### Step 5: Verify in Database
Check your Neon DB to see the user was created:
1. Go to https://console.neon.tech
2. Open SQL Editor
3. Run:
   ```sql
   SELECT * FROM users;
   ```

## API Endpoints Being Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/signup` | POST | Register new user |
| `/api/auth/login` | POST | Login and get JWT token |
| `/api/auth/me` | GET | Get current user info |
| `/api/auth/verify` | GET | Verify token validity |

## Authentication Flow

```
1. User fills signup form
   ↓
2. Frontend → POST /api/auth/signup
   ↓
3. Backend creates user in Neon DB
   ↓
4. Frontend → POST /api/auth/login (auto-login)
   ↓
5. Backend returns JWT token
   ↓
6. Frontend stores token in localStorage
   ↓
7. Frontend → GET /api/auth/me (get user details)
   ↓
8. Redirect to appropriate dashboard
```

## Token Management

### How It Works
- JWT token stored in `localStorage` as `access_token`
- Token automatically included in all API requests
- Token expires in 30 minutes (configurable)
- User info stored separately for UI

### Checking Token
```javascript
// In browser console
localStorage.getItem('access_token')
localStorage.getItem('user')
```

### Manual Logout
```javascript
import { authApi } from '@/lib/api'
authApi.logout() // Clears token and user data
```

## Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (.env)
```env
DATABASE_URL=postgresql://...@neon.tech/neondb?sslmode=require&channel_binding=require
SECRET_KEY=your-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=["http://localhost:3000","http://localhost:3001"]
```

## CORS Configuration

Backend is configured to allow requests from:
- http://localhost:3000 (Next.js dev)
- http://localhost:3001 (alternative port)

To add more origins, edit `backend/config.py`:
```python
CORS_ORIGINS: list = ["http://localhost:3000", "https://your-production-domain.com"]
```

## Error Handling

### Common Errors

**"Email already registered"**
- Solution: Use a different email or login instead

**"Password must be at least 8 characters"**
- Solution: Use a longer password

**"Could not validate credentials"**
- Solution: Token expired, login again

**"Network request failed"**
- Solution: Ensure backend is running on port 8000

### Debugging API Calls

Open browser DevTools (F12) → Network tab to see:
- Request payloads
- Response data
- Status codes
- Error messages

## Next Steps

### 1. Add Protected Routes
Create middleware to check authentication:

```typescript
// middleware.ts (create in root)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*']
}
```

### 2. Add More API Features
- Quiz management endpoints
- Class management endpoints
- Real-time features with WebSockets
- File uploads for materials

### 3. Deploy to Production
- Frontend → Vercel/Netlify
- Backend → Render/Railway/Fly.io
- Database → Already on Neon (production-ready)

## Testing Authentication

### Quick Test Script
```bash
# Test signup
curl -X POST "http://localhost:8000/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "testpass123",
    "full_name": "Test User",
    "is_teacher": false
  }'

# Test login
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

## Troubleshooting

### Frontend can't reach backend
1. Check backend is running: http://localhost:8000/health
2. Check CORS settings in `backend/config.py`
3. Verify `.env.local` has correct API URL

### Token issues
1. Clear localStorage and try again
2. Check token expiration time in backend
3. Verify SECRET_KEY is set in backend `.env`

### Database connection issues
1. Check Neon DB connection string
2. Verify `sslmode=require` is in URL
3. Test connection in Neon Console

---

## 🎉 Success!

Your full-stack Quiz App is now operational with:
- ✅ Next.js frontend (TypeScript + Tailwind)
- ✅ FastAPI backend (Python)
- ✅ Neon PostgreSQL database
- ✅ JWT authentication
- ✅ Real-time integration

Ready to build more features! 🚀
