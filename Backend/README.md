# KIZASHI Backend Setup & Testing Guide

## Prerequisites
- Python 3.8+
- MongoDB running locally (mongodb://localhost:27017)
- pip package manager

## Setup Instructions

### 1. Install Dependencies
```bash
cd Backend
pip install -r requirements.txt
```

### 2. Start MongoDB
Make sure MongoDB is running on localhost:27017

```bash
# On Windows (if MongoDB is installed)
mongod

# On Mac
brew services start mongodb-community

# On Linux
sudo systemctl start mongod
```

### 3. Run the Backend Server
```bash
cd Backend
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

The backend will be available at: http://127.0.0.1:8000

## API Endpoints

### Authentication
- `POST /register` - Register a new user
- `POST /login` - Login user
- `GET /user/profile?email=user@example.com` - Get user profile

### Behavior Logs
- `POST /behavior/logs` - Create a behavior log
- `GET /behavior/logs?user_email=user@example.com` - Get user's behavior logs

### Analytics
- `GET /analytics/productivity?user_email=user@example.com&days=7` - Get productivity metrics
- `GET /analytics/lifestyle?user_email=user@example.com&days=7` - Get lifestyle metrics
- `GET /analytics/mental-health?user_email=user@example.com&days=7` - Get mental health metrics

### Dashboard
- `GET /dashboard?user_email=user@example.com` - Get dashboard summary

### Analytics Insights
- `GET /analytics/drift?user_email=user@example.com` - Get drift analysis
- `GET /analytics/risk?user_email=user@example.com` - Get risk assessment
- `GET /analytics/recommendations?user_email=user@example.com` - Get recommendations

## Testing the API

### 1. Register a User
```bash
curl -X POST http://127.0.0.1:8000/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

Expected Response:
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "user": {
      "id": "0_john@example.com",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### 2. Add Behavior Metrics
```bash
curl -X POST http://127.0.0.1:8000/behavior/log \
  -H "Content-Type: application/json" \
  -d '{
    "user_email": "john@example.com",
    "date": "2024-05-18",
    "study_hours": 5.5,
    "focus_sessions": 3,
    "tasks_completed": 8,
    "sleep_hours": 7.5,
    "screen_time": 6,
    "routine_score": 8,
    "mood": 7,
    "stress": 4,
    "motivation": 8,
    "energy": 8
  }'
```

### 3. Add Behavior Log Entry
```bash
curl -X POST http://127.0.0.1:8000/behavior/logs \
  -H "Content-Type: application/json" \
  -d '{
    "user_email": "john@example.com",
    "category": "Exercise",
    "duration": 30,
    "notes": "Morning jog in the park"
  }'
```

### 4. Get Dashboard Data
```bash
curl "http://127.0.0.1:8000/dashboard?user_email=john@example.com"
```

### 5. Get Recommendations
```bash
curl "http://127.0.0.1:8000/analytics/recommendations?user_email=john@example.com"
```

## Common Issues

### MongoDB Connection Error
- Ensure MongoDB is running
- Check that it's accessible at mongodb://localhost:27017

### Port Already in Use
- Change the port: `python -m uvicorn main:app --reload --port 8001`

### JWT Import Error
- Make sure PyJWT is installed: `pip install pyjwt`

## Frontend Connection

The frontend expects the backend at: `http://127.0.0.1:8000`

This is configured in `.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

## Database Collections

The MongoDB database (kizashi) contains:
- `users` - User accounts and credentials
- `behaviour` - Daily behavior metrics
- `behaviour_logs` - Individual behavior log entries
