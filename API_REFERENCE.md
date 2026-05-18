# KIZASHI API Reference

## Base URL
```
http://127.0.0.1:8000
```

## Authentication Endpoints

### Register User
- **Method**: POST
- **Endpoint**: `/register`
- **Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "user": {
      "id": "0_john@example.com",
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2024-05-18T10:30:00"
    }
  }
}
```

### Login User
- **Method**: POST
- **Endpoint**: `/login`
- **Body**:
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```
- **Response**: Same as register

### Get User Profile
- **Method**: GET
- **Endpoint**: `/user/profile?email=john@example.com`
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "0_john@example.com",
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2024-05-18T10:30:00"
    }
  }
}
```

## Behavior Endpoints

### Create Behavior Log Entry
- **Method**: POST
- **Endpoint**: `/behavior/logs`
- **Headers**: `Authorization: Bearer {token}`
- **Body**:
```json
{
  "user_email": "john@example.com",
  "category": "Exercise",
  "duration": 30,
  "notes": "Morning jog in the park"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Log added",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "timestamp": "2024-05-18T10:45:00"
  }
}
```

### Get Behavior Logs
- **Method**: GET
- **Endpoint**: `/behavior/logs?user_email=john@example.com&limit=50&offset=0`
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "user_email": "john@example.com",
      "category": "Exercise",
      "duration": 30,
      "notes": "Morning jog",
      "timestamp": "2024-05-18T10:45:00"
    }
  ]
}
```

### Save Daily Behavior Metrics
- **Method**: POST
- **Endpoint**: `/behavior/log`
- **Headers**: `Authorization: Bearer {token}`
- **Body**:
```json
{
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
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Behavior metrics saved"
}
```

## Analytics Endpoints

### Get Productivity Metrics
- **Method**: GET
- **Endpoint**: `/analytics/productivity?user_email=john@example.com&days=7`
- **Headers**: `Authorization: Bearer {token}`
- **Parameters**:
  - `user_email` (required): User email address
  - `days` (optional): Number of days to retrieve (default: 7)
- **Response**:
```json
{
  "success": true,
  "data": {
    "daily_average": 6.5,
    "data_points": [
      {
        "date": "2024-05-18",
        "study_hours": 5.5,
        "focus_sessions": 3,
        "tasks_completed": 8,
        "productivity_score": 5.5
      }
    ]
  }
}
```

### Get Lifestyle Metrics
- **Method**: GET
- **Endpoint**: `/analytics/lifestyle?user_email=john@example.com&days=7`
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
```json
{
  "success": true,
  "data": {
    "nutrition_score": 7.2,
    "data_points": [
      {
        "date": "2024-05-18",
        "sleep_hours": 7.5,
        "screen_time": 6,
        "routine_score": 8,
        "lifestyle_score": 7.17
      }
    ]
  }
}
```

### Get Mental Health Metrics
- **Method**: GET
- **Endpoint**: `/analytics/mental-health?user_email=john@example.com&days=7`
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
```json
{
  "success": true,
  "data": {
    "mood_score": 7.5,
    "data_points": [
      {
        "date": "2024-05-18",
        "mood": 7,
        "stress": 4,
        "motivation": 8,
        "energy": 8,
        "mental_score": 6.75
      }
    ]
  }
}
```

## Dashboard Endpoint

### Get Dashboard Summary
- **Method**: GET
- **Endpoint**: `/dashboard?user_email=john@example.com`
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
```json
{
  "success": true,
  "data": {
    "weekly_productivity": 6.5,
    "weekly_lifestyle": 7.2,
    "weekly_mental": 7.8,
    "overall_score": 7.2,
    "drift_score": 1.2,
    "risk": "Low"
  }
}
```

## Insights Endpoints

### Get Drift Analysis
- **Method**: GET
- **Endpoint**: `/analytics/drift?user_email=john@example.com`
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
```json
{
  "success": true,
  "data": {
    "drift_score": 1.2,
    "risk": "Low"
  }
}
```

### Get Risk Assessment
- **Method**: GET
- **Endpoint**: `/analytics/risk?user_email=john@example.com`
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
```json
{
  "success": true,
  "data": {
    "risk_level": "Low",
    "burnout_probability": 15.5,
    "productivity_decline_probability": 25.0
  }
}
```

### Get Recommendations
- **Method**: GET
- **Endpoint**: `/analytics/recommendations?user_email=john@example.com`
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Improve Sleep Duration",
      "description": "Your current sleep duration is below recommended levels.",
      "priority": "high",
      "category": "Sleep",
      "action_items": [
        "Go to bed 30 minutes earlier",
        "Create a bedtime routine",
        "Reduce screen time before sleep",
        "Keep bedroom cool and dark"
      ]
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "title": "Reduce Screen Time",
      "description": "Your screen time exceeds 8 hours daily.",
      "priority": "high",
      "category": "Lifestyle",
      "action_items": [
        "Take 5-minute breaks every 30 minutes",
        "Use the 20-20-20 rule",
        "Schedule screen-free time",
        "Practice outdoor activities"
      ]
    }
  ]
}
```

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

### Common Errors

**Missing Required Parameter**:
```json
{
  "success": false,
  "error": "user_email required"
}
```

**Invalid Credentials**:
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**User Already Exists**:
```json
{
  "success": false,
  "message": "User already exists"
}
```

**Missing Fields**:
```json
{
  "success": false,
  "detail": "Missing required fields"
}
```

## Rate Limiting

Currently no rate limiting is implemented. In production, consider adding:
- Max requests per minute per IP
- Max requests per user account
- Exponential backoff for failed login attempts

## Data Types

### Date Format
- ISO 8601: `YYYY-MM-DD` (e.g., `2024-05-18`)

### Timestamp Format
- ISO 8601: `YYYY-MM-DDTHH:MM:SS` (e.g., `2024-05-18T10:30:00`)

### Numeric Fields
- All numeric values use standard decimal format
- Percentages and scores typically range 0-10

### Priority Levels
- `high`: Immediate attention needed
- `medium`: Should address soon
- `low`: Nice to have

### Risk Levels
- `Low`: No significant risk detected
- `Moderate`: Some risk factors present
- `High`: Multiple risk factors or high severity

## Authentication

All authenticated endpoints require the `Authorization` header:
```
Authorization: Bearer {access_token}
```

The access token is obtained from the `/login` or `/register` endpoint and should be stored in the client (e.g., localStorage) and included in all subsequent requests.

## CORS Configuration

Currently allows all origins. In production, configure specific allowed origins:
```python
allow_origins=["https://yourdomain.com"]
```

## Version History

- **v1.0** (2024-05-18): Initial integration complete
  - Authentication system with JWT
  - Behavior logging and metrics
  - Analytics endpoints
  - Recommendations engine
  - Dashboard data aggregation
