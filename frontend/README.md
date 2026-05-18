# KIZASHI - AI Behavioral Analytics Platform

A modern, production-ready frontend for the KIZASHI behavioral analytics platform. Track productivity, wellness, and mental health with advanced AI-powered insights.

## Features

- 🔐 **Secure Authentication**: Email/password registration and login with token-based auth
- 📊 **Interactive Analytics**: Real-time charts and visualizations with Recharts
- 📱 **Responsive Design**: Mobile-first dark mode with glassmorphism UI
- ⚡ **Production-Ready**: Optimized for Vercel deployment with environment variables
- 🎨 **Beautiful UI**: Smooth animations with Framer Motion and Tailwind CSS
- 🔌 **Scalable API**: Centralized API client with proper error handling
- 🌙 **Dark Mode**: Elegant dark theme optimized for eye comfort

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS with design tokens
- **Charts**: Recharts for data visualization
- **Animations**: Framer Motion
- **State Management**: React Context API
- **HTTP Client**: Native Fetch API
- **Validation**: Zod for schema validation
- **Deployment**: Vercel (production-ready)

## Project Structure

```
├── app/
│   ├── layout.tsx                 # Root layout with providers
│   ├── page.tsx                   # Landing page
│   ├── login/page.tsx             # Login page
│   ├── register/page.tsx          # Registration page
│   ├── dashboard/page.tsx         # Main dashboard
│   ├── behaviour-logging/page.tsx # Behavior tracking
│   ├── productivity/page.tsx      # Productivity analytics
│   ├── lifestyle/page.tsx         # Lifestyle metrics
│   ├── mental-health/page.tsx     # Mental health tracking
│   ├── recommendations/page.tsx   # Personalized recommendations
│   └── globals.css                # Global styles with design tokens
│
├── components/
│   ├── analytics-chart.tsx        # Recharts wrapper
│   ├── metric-card.tsx            # Stats card component
│   └── navbar.tsx                 # Navigation bar
│
├── lib/
│   ├── api/
│   │   └── client.ts              # Centralized API client
│   ├── context/
│   │   └── auth-context.tsx       # Auth provider & hook
│   ├── types/
│   │   └── api.ts                 # TypeScript type definitions
│   └── utils.ts                   # Utility functions
│
├── .env.example                   # Environment variables template
├── .env.local                     # Local development variables
├── DEPLOYMENT.md                  # Production deployment guide
└── README.md                      # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm/yarn

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd kizashi-frontend
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Configure environment variables**

Create `.env.local` (or copy from `.env.example`):

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

For production, this should point to your backend API.

4. **Start development server**

```bash
pnpm dev
```

Visit `http://localhost:3000` in your browser.

## Environment Variables

### `NEXT_PUBLIC_API_BASE_URL`

- **Required**: Yes
- **Type**: URL string
- **Example**: `https://api.kizashi.com`
- **Description**: Base URL for the KIZASHI backend API

This variable:
- Must start with `http://` or `https://`
- Is accessible in the browser (public)
- Is **not** sensitive data (just an endpoint URL)
- Must point to a CORS-enabled backend

## Building for Production

### Build Locally

```bash
pnpm build
pnpm start
```

### Deploy to Vercel

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

Quick deployment:

```bash
# Option 1: Using Vercel CLI
vercel deploy --prod

# Option 2: Push to GitHub (if connected)
git push origin main
```

Then set environment variable in Vercel dashboard:
- **Settings** → **Environment Variables**
- Add `NEXT_PUBLIC_API_BASE_URL` with your production API URL

## API Endpoints

The frontend uses these endpoints (configurable via API client):

```typescript
// Authentication
POST   /login          - User login
POST   /register       - User registration

// User
GET    /user/profile        - Get user profile

// Behavior Logs
GET    /behavior/logs       - List behavior logs
POST   /behavior/logs       - Create new log

// Analytics
GET    /analytics/productivity    - Productivity metrics
GET    /analytics/lifestyle       - Lifestyle metrics
GET    /analytics/mental-health   - Mental health metrics
GET    /analytics/drift           - Drift analysis
GET    /analytics/recommendations - Recommendations
GET    /analytics/risk            - Risk assessment
GET    /analytics/summary         - Weekly summary
```

## Features Overview

### Authentication
- Registration with email and password
- Login with email and password
- Token-based session management
- Automatic redirect to login for unauthenticated users
- Logout functionality

### Dashboard
- Overview of key metrics
- Weekly productivity and wellness trends
- Quick action buttons to analytics pages
- Real-time data from API

### Behavior Logging
- Log daily behaviors (Exercise, Sleep, Work, etc.)
- Record duration and add notes
- View recent behavior history
- Track patterns over time

### Analytics Pages
- **Productivity**: Focus sessions, break time, daily trends
- **Lifestyle**: Sleep, exercise, water intake, nutrition
- **Mental Health**: Mood, stress, anxiety levels
- **Recommendations**: Personalized action items and insights

## Styling & Design System

### Color Palette

- **Primary**: Purple (`oklch(0.55 0.22 257)`)
- **Accent**: Orange (`oklch(0.52 0.18 47)`)
- **Background**: Deep dark (`oklch(0.08 0 0)`)
- **Foreground**: Off-white (`oklch(0.95 0 0)`)

### Components

- **`.glass`**: Full-width glassmorphic card
- **`.glass-sm`**: Smaller glassmorphic element
- **`.glow`**: Shadow effect with primary color
- **Gradients**: Background with dark blue to purple gradient

### Animations

- Page transitions with Framer Motion
- Staggered item animations
- Smooth hover effects
- Loading spinner

## Development

### Adding a New Page

1. Create file in `app/new-feature/page.tsx`
2. Use `useAuth()` hook for authentication check
3. Fetch data with `apiClient.getEndpoint()`
4. Style with Tailwind and glass components
5. Add to navbar in `components/navbar.tsx`

### Adding API Endpoints

1. Add types in `lib/types/api.ts`
2. Add method in `lib/api/client.ts`
3. Use in components with `apiClient.methodName()`

### Creating Components

```typescript
'use client';

import { motion } from 'framer-motion';

export function MyComponent() {
  return (
    <motion.div
      className="glass glow p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      Content
    </motion.div>
  );
}
```

## Performance

- **Code Splitting**: Next.js automatic route-based splitting
- **Image Optimization**: Built-in Next.js Image component support
- **CSS**: Tailwind with PurgeCSS for minimal bundle
- **Caching**: API responses can be cached with SWR (easy to add)
- **Vercel CDN**: Automatic global edge caching on Vercel

## Security

- ✓ No hardcoded API URLs or secrets
- ✓ Token stored in localStorage (move to HTTP-only cookies in backend)
- ✓ CORS-enabled API communication
- ✓ 401 handling with redirect to login
- ✓ Input validation before form submission
- ✓ Environment variable validation at startup

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

## Troubleshooting

### Build Fails

```bash
# Clear cache and reinstall
rm -rf .next node_modules
pnpm install
pnpm build
```

### Environment Variable Not Recognized

1. Ensure `.env.local` is in project root
2. Restart dev server: `pnpm dev`
3. For Vercel: Redeploy after setting variables

### API Errors

- Check API base URL in environment
- Verify backend is running and accessible
- Check browser Network tab in DevTools
- Review backend error logs

### Authentication Issues

- Clear localStorage in browser DevTools
- Log in again
- Check API `/login` endpoint is working

## License

Proprietary - KIZASHI Inc.

## Support

For issues or questions:
1. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment issues
2. Review API responses in browser DevTools Network tab
3. Check backend logs for server-side errors
4. Create an issue in the repository

---

**Ready to deploy?** See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment instructions.
