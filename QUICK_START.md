# KIZASHI Quick Start Guide

## Prerequisites
- Python 3.8+ (for backend)
- Node.js 16+ (for frontend)
- MongoDB running locally
- npm or pnpm (for frontend package management)

## Step 1: Start MongoDB

### Windows
If MongoDB is installed:
```bash
mongod
```

### Mac
```bash
brew services start mongodb-community
```

### Linux
```bash
sudo systemctl start mongod
```

### Docker (Alternative)
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

Verify MongoDB is running:
```bash
mongo
> show dbs
```

## Step 2: Install & Run Backend

### Install Dependencies
```bash
cd Backend
pip install -r requirements.txt
```

### Start Backend Server
```bash
cd Backend
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### Verify Backend
Open browser and go to: http://127.0.0.1:8000/

Should return:
```json
{"message": "KIZASHI Backend Running"}
```

## Step 3: Install & Run Frontend

### Install Dependencies
```bash
cd frontend
npm install
# OR
pnpm install
```

### Start Frontend Development Server
```bash
cd frontend
npm run dev
# OR
pnpm dev
```

You should see:
```
▲ Next.js 14.x.x
- ready started server on 0.0.0.0:3000
```

### Verify Frontend
Open browser and go to: http://localhost:3000/

You should see the KIZASHI login page.

## Step 4: Test the Application

### Create Test Account
1. Go to http://localhost:3000/register
2. Register with:
   - Name: Test User
   - Email: test@example.com
   - Password: Test@123456

### Login
1. Go to http://localhost:3000/login
2. Use credentials from registration
3. Should redirect to dashboard

### Add Test Data
1. Go to Behavior Logging page
2. Add some behavior entries
3. Check dashboard for data

### Verify API Integration
```bash
# Test backend directly
curl http://127.0.0.1:8000/

# Test auth
curl -X POST http://127.0.0.1:8000/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

## Useful Commands

### Backend Development
```bash
# Run with auto-reload
python -m uvicorn main:app --reload

# Run without auto-reload
python -m uvicorn main:app

# Run on specific port
python -m uvicorn main:app --port 8001

# Enable debug logging
python -m uvicorn main:app --log-level debug
```

### Frontend Development
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run production build locally
npm run start

# Lint and format
npm run lint
npm run format
```

### Database
```bash
# Connect to MongoDB shell
mongo

# Select database
use kizashi

# Check collections
show collections

# View users
db.users.find()

# View behavior data
db.behaviour.find()

# View behavior logs
db.behaviour_logs.find()
```

## Troubleshooting

### MongoDB Connection Failed
**Error**: `Failed to connect to mongodb://localhost:27017`

**Solution**:
1. Verify MongoDB is running: `mongo`
2. Check MongoDB is on port 27017
3. Try restarting MongoDB service

### Port Already in Use
**Error**: `Address already in use`

**Solution**:
```bash
# Backend (use different port)
python -m uvicorn main:app --port 8001

# Frontend (automatically tries next port)
npm run dev -- -p 3001
```

### JWT Import Error
**Error**: `ModuleNotFoundError: No module named 'jwt'`

**Solution**:
```bash
pip install pyjwt
```

### API Base URL Not Found
**Error**: `NEXT_PUBLIC_API_BASE_URL environment variable is not set`

**Solution**:
1. Check frontend/.env.local exists
2. Verify it contains: `NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000`
3. Restart frontend dev server

### Database Not Found
**Error**: `No database selected` or data not appearing

**Solution**:
1. Verify MongoDB is running
2. Check collection names are correct
3. Verify user_email is being passed to API calls

## Project Structure

```
KIZASHI/
├── Backend/
│   ├── main.py              # FastAPI app entry point
│   ├── database.py          # MongoDB connection
│   ├── requirements.txt      # Python dependencies
│   ├── routes/              # API route handlers
│   │   ├── auth.py
│   │   ├── behaviour.py
│   │   ├── analytics.py
│   │   ├── dashboard.py
│   │   ├── drift.py
│   │   ├── risk.py
│   │   ├── recommendations.py
│   │   └── ml.py
│   └── README.md
│
├── frontend/
│   ├── app/                 # Next.js pages
│   │   ├── login/
│   │   ├── register/
│   │   ├── dashboard/
│   │   ├── behaviour-logging/
│   │   ├── productivity/
│   │   ├── lifestyle/
│   │   ├── mental-health/
│   │   └── recommendations/
│   ├── lib/
│   │   ├── api/client.ts    # API client
│   │   ├── context/         # React contexts
│   │   └── types/           # TypeScript types
│   ├── components/          # React components
│   ├── public/              # Static assets
│   ├── .env.local           # Environment config
│   └── package.json
│
├── ML/
│   ├── main.py              # ML module entry point
│   ├── requirements.txt
│   └── kizashi_model.pkl    # Pre-trained model
│
├── INTEGRATION_GUIDE.md      # Full integration documentation
├── API_REFERENCE.md          # API endpoint reference
└── README.md
```

## Default Credentials (After Setup)

**Test User** (auto-created):
- Email: test@example.com
- Password: Test@123456

## Environment Variables

**Frontend (.env.local)**:
```
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

**Backend (hardcoded in routes/auth.py)**:
```
SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"
```

> ⚠️ In production, move these to environment variables!

## Performance Tips

1. **Backend**: Use production ASGI server in production
   ```bash
   pip install gunicorn
   gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
   ```

2. **Frontend**: Use production build
   ```bash
   npm run build
   npm start
   ```

3. **Database**: Create indexes for frequently queried fields
   ```bash
   use kizashi
   db.behaviour.createIndex({"user_email": 1, "date": -1})
   db.users.createIndex({"email": 1})
   ```

## Next Steps

1. ✅ Start MongoDB
2. ✅ Start Backend Server
3. ✅ Start Frontend Server
4. ✅ Create account
5. ✅ Login
6. ✅ Add data and test features
7. ✅ Review INTEGRATION_GUIDE.md for detailed documentation
8. ✅ Check API_REFERENCE.md for endpoint details

## Support

For issues or questions:
1. Check INTEGRATION_GUIDE.md
2. Check API_REFERENCE.md
3. Check Backend/README.md
4. Review error messages in browser console and terminal

## Security Considerations

⚠️ **This setup is for development only!**

For production deployment:
1. Use bcrypt for password hashing (not SHA256)
2. Move secrets to environment variables
3. Implement proper CORS configuration
4. Use HTTPS/TLS
5. Add rate limiting
6. Implement proper error handling
7. Add authentication middleware
8. Use production database with proper backup

Happy coding! 🚀
