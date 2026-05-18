# KIZASHI API Integration Guide

## Overview

This document describes how the KIZASHI frontend integrates with the backend API. The API client is configured to use environment variables for flexibility across different environments.

## API Client Configuration

### Location
`lib/api/client.ts`

### Environment Variable
```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

### How It Works

The API client reads the base URL from the environment variable at startup:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL environment variable is not set');
}
```

Every API request uses this base URL:

```typescript
private async request<T>(endpoint: string, options?: RequestInit) {
  const url = `${this.baseURL}${endpoint}`;
  // ... make fetch request to full URL
}
```

## API Endpoints

All endpoints should be relative paths. The client prepends the base URL.

### Authentication

#### POST /login
```typescript
apiClient.login(email: string, password: string)
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "access_token": "token_string",
    "token_type": "Bearer",
    "user": {
      "id": "user-id",
      "name": "User Name",
      "email": "user@example.com",
      "created_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

#### POST /register
```typescript
apiClient.register(name: string, email: string, password: string)
```

**Request Body:**
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** Same as login

### User Profile

#### GET /user/profile
```typescript
apiClient.getProfile()
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-id",
    "name": "User Name",
    "email": "user@example.com",
    "created_at": "2024-01-01T00:00:00Z",
    "preferences": {
      "theme": "dark",
      "notifications_enabled": true
    }
  }
}
```

### Behavior Logs

#### GET /behavior/logs?limit=50&offset=0
```typescript
apiClient.getBehaviorLogs(limit?: number, offset?: number)
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "log-id",
      "user_id": "user-id",
      "timestamp": "2024-01-15T10:30:00Z",
      "category": "Exercise",
      "duration": 30,
      "notes": "Morning run"
    }
  ]
}
```

#### POST /behavior/logs
```typescript
apiClient.createBehaviorLog(
  category: string,
  duration: number,
  notes?: string
)
```

**Request Body:**
```json
{
  "category": "Exercise",
  "duration": 30,
  "notes": "Morning run"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "new-log-id",
    "user_id": "user-id",
    "timestamp": "2024-01-15T10:30:00Z",
    "category": "Exercise",
    "duration": 30,
    "notes": "Morning run"
  }
}
```

### Analytics Endpoints

#### GET /analytics/productivity?days=7
```typescript
apiClient.getProductivityMetrics(days?: number)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "daily_average": 72.5,
    "weekly_trend": [
      { "date": "2024-01-08", "value": 65 },
      { "date": "2024-01-09", "value": 72 }
    ],
    "focus_sessions": 14,
    "break_time": 240
  }
}
```

#### GET /analytics/lifestyle?days=7
```typescript
apiClient.getLifestyleMetrics(days?: number)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sleep_hours": 7.4,
    "exercise_minutes": 45,
    "water_intake": 2.5,
    "nutrition_score": 8.2,
    "daily_trend": [
      { "date": "2024-01-08", "value": 7.2 },
      { "date": "2024-01-09", "value": 7.5 }
    ]
  }
}
```

#### GET /analytics/mental-health?days=7
```typescript
apiClient.getMentalHealthMetrics(days?: number)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "mood_score": 7.5,
    "stress_level": 3.2,
    "anxiety_level": 2.8,
    "weekly_trend": [
      { "date": "2024-01-08", "value": 6.8 },
      { "date": "2024-01-09", "value": 7.2 }
    ]
  }
}
```

#### GET /analytics/drift
```typescript
apiClient.getDriftAnalysis()
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "metric": "productivity",
      "current_value": 72.5,
      "baseline": 65,
      "change_percent": 11.5,
      "status": "improving"
    }
  ]
}
```

#### GET /analytics/recommendations
```typescript
apiClient.getRecommendations()
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "rec-1",
      "title": "Increase Daily Exercise",
      "description": "You can improve productivity by 15%",
      "priority": "high",
      "category": "Health",
      "action_items": ["Add 15-minute walk", "Try new routine"]
    }
  ]
}
```

#### GET /analytics/risk
```typescript
apiClient.getRiskAssessment()
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overall_risk": 2.3,
    "factors": [
      {
        "category": "sleep",
        "risk_level": 1.2,
        "description": "Below recommended hours"
      }
    ],
    "interventions": ["Increase sleep by 1 hour"]
  }
}
```

#### GET /analytics/summary?week_start=2024-01-08
```typescript
apiClient.getWeeklySummary(weekStart: string)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "week_start": "2024-01-08",
    "week_end": "2024-01-14",
    "highlights": ["Consistent exercise routine"],
    "challenges": ["Variable sleep schedule"],
    "metrics_summary": {
      "productivity": 72.5,
      "wellness": 8.2,
      "mental_health": 7.5
    },
    "recommendations": []
  }
}
```

## Authentication Flow

### Token Management

The API client manages authentication tokens automatically:

```typescript
// Login stores token
const response = await apiClient.login(email, password);
// Token is automatically stored in localStorage

// All subsequent requests include token
// Authorization: Bearer {token}

// Logout clears token
apiClient.logout();
// Token is removed from localStorage
```

### Token in Requests

Every request (except login/register) includes the token:

```typescript
const headers: HeadersInit = {
  'Content-Type': 'application/json',
};

const token = this.getAuthToken();
if (token) {
  headers['Authorization'] = `Bearer ${token}`;
}
```

### 401 Handling

If the backend returns 401 (Unauthorized):

```typescript
if (response.status === 401) {
  this.clearAuthToken();
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}
```

## Error Handling

### Frontend Error Handling

```typescript
try {
  const response = await apiClient.login(email, password);
  // Handle success
} catch (err) {
  const errorMessage = err instanceof Error ? err.message : 'Unknown error';
  // Show error to user
}
```

### API Error Responses

The client throws errors for non-2xx responses:

```typescript
if (!response.ok) {
  const error = await response.text();
  throw new Error(`API Error: ${response.status} - ${error}`);
}
```

## CORS Requirements

Your backend must have CORS configured to accept requests from:

### Development
```
http://localhost:3000
```

### Production
```
https://your-project.vercel.app
https://your-custom-domain.com
```

### Example CORS Header
```
Access-Control-Allow-Origin: https://your-project.vercel.app
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## Adding New API Endpoints

### 1. Add Type Definition

In `lib/types/api.ts`:

```typescript
export interface MyData {
  id: string;
  value: string;
  // ... other fields
}
```

### 2. Add API Method

In `lib/api/client.ts`:

```typescript
async getMyData(param: string) {
  return this.request<APIResponse<MyData>>(
    `/my-endpoint/${param}`
  );
}
```

### 3. Use in Component

```typescript
'use client';

import { apiClient } from '@/lib/api/client';
import { useEffect, useState } from 'react';

export function MyComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.getMyData('param-value');
        setData(response.data);
      } catch (err) {
        console.error('Failed to fetch:', err);
      }
    };

    fetchData();
  }, []);

  return <div>{/* Use data */}</div>;
}
```

## Environment-Specific Configurations

### Local Development
```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

### Staging
```env
NEXT_PUBLIC_API_BASE_URL=https://staging-api.kizashi.com
```

### Production
```env
NEXT_PUBLIC_API_BASE_URL=https://api.kizashi.com
```

## Debugging API Issues

### Check Network Requests

1. Open browser DevTools → Network tab
2. Look for API requests
3. Check response status and body
4. Verify `Authorization` header is present

### Test API Manually

```bash
# Test login endpoint
curl -X POST http://127.0.0.1:8000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Test protected endpoint
curl http://127.0.0.1:8000/user/profile \
  -H "Authorization: Bearer {token}"
```

### Check Environment Variable

```bash
# During build
echo $NEXT_PUBLIC_API_BASE_URL

# In browser console
console.log(process.env.NEXT_PUBLIC_API_BASE_URL)
```

## Performance Optimization

### Potential Improvements

1. **Add SWR for caching**:
   ```typescript
   import useSWR from 'swr';
   const { data } = useSWR('/api/data', fetcher);
   ```

2. **Implement request batching**
3. **Add request/response caching**
4. **Use GraphQL instead of REST**

## Security Considerations

1. ✓ Tokens stored in localStorage (consider HTTP-only cookies)
2. ✓ HTTPS required in production
3. ✓ Validate all responses
4. ✓ Don't log sensitive data
5. ✓ Implement request timeout

---

For more information, see [README.md](./README.md) and [DEPLOYMENT.md](./DEPLOYMENT.md).
