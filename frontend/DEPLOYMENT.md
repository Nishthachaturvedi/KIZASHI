# KIZASHI Deployment Guide

## Production-Ready Frontend for Vercel

This guide explains how to deploy the KIZASHI frontend to Vercel with proper environment variable configuration.

## Environment Variables

### Local Development

The `.env.local` file is configured for local development:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

This connects to a local backend running on `http://127.0.0.1:8000`.

### Production Deployment

For production deployment on Vercel, you need to set the environment variable in your Vercel project settings.

#### Step 1: Deploy to Vercel

```bash
# Option A: Using Vercel CLI
vercel deploy

# Option B: Push to GitHub and connect repository to Vercel
git push origin main
```

#### Step 2: Configure Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new environment variable:
   - **Name**: `NEXT_PUBLIC_API_BASE_URL`
   - **Value**: `https://api.kizashi.yourdomain.com` (or your actual backend URL)
   - **Environments**: Select appropriate environments (Production, Preview, Development)

4. Click "Save"

#### Step 3: Redeploy

After setting the environment variable, redeploy your project:

```bash
vercel deploy --prod
```

Or trigger a new deployment by pushing to your main branch.

## Configuration Details

### Why NEXT_PUBLIC_ Prefix?

The `NEXT_PUBLIC_` prefix makes this variable accessible in the browser. Since the API base URL must be known by frontend code, it's public. **This is NOT sensitive data** - it's just the endpoint URL.

### API Client Configuration

The API client in `lib/api/client.ts` automatically uses the environment variable:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL environment variable is not set');
}
```

This ensures:
- ✓ Fails fast if the variable isn't set
- ✓ Uses the correct API endpoint in all environments
- ✓ No hardcoded URLs in source code

## Features

### Authentication
- Email/password based registration and login
- Token-based authentication stored in localStorage
- Automatic 401 redirect to login page
- Protected routes that check authentication status

### Analytics Dashboard
- Real-time behavioral tracking
- Productivity, lifestyle, and mental health metrics
- Interactive charts with Recharts
- Responsive grid layout for all screen sizes

### Dark Mode Glassmorphism UI
- Beautiful gradient background
- Frosted glass effect on cards
- Smooth animations with Framer Motion
- Optimized for all devices

## Security Best Practices

This frontend follows security best practices:

1. **No Hardcoded API URLs**: All endpoints configured via environment variables
2. **Token Management**: Auth tokens stored securely in localStorage
3. **CORS Ready**: API client accepts responses from any CORS-enabled backend
4. **Input Validation**: Form validation before submission
5. **Error Handling**: Graceful error handling and user feedback

## Performance Optimizations

- Next.js App Router for optimized routing
- Dynamic imports for code splitting
- Image optimization (if using Next.js Image component)
- CSS-in-JS with Tailwind for minimal bundle size
- No external analytics by default in development

## Vercel Deployment Checklist

- [ ] Repository connected to Vercel
- [ ] Environment variable `NEXT_PUBLIC_API_BASE_URL` set in Vercel project settings
- [ ] API backend is deployed and accessible
- [ ] CORS is configured on backend to accept requests from your Vercel domain
- [ ] Run `vercel deploy --prod` to deploy
- [ ] Test login/register and API calls in production

## Troubleshooting

### "NEXT_PUBLIC_API_BASE_URL is not set"

**Solution**: Add the environment variable in Vercel project settings (Settings → Environment Variables)

### API Calls Return 401 Unauthorized

**Solution**: Verify that:
1. Your backend token validation is correct
2. Tokens are being sent with `Authorization: Bearer {token}` header
3. Your backend is configured to handle this auth method

### CORS Errors

**Solution**: Configure CORS on your backend to accept requests from:
- `http://localhost:3000` (local development)
- `https://your-project.vercel.app` (production)
- Any preview deployment domains

### Environment Variable Not Updating

**Solution**: 
1. Verify the variable is set in Vercel settings
2. Redeploy: `vercel deploy --prod`
3. Wait for deployment to complete
4. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)

## Development Workflow

```bash
# 1. Clone repository
git clone <your-repo>
cd kizashi-frontend

# 2. Install dependencies
pnpm install

# 3. Create .env.local for local development
echo "NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000" > .env.local

# 4. Start development server
pnpm dev

# 5. Open http://localhost:3000
```

## Production Build

```bash
# Build for production
pnpm build

# Test production build locally
pnpm start
```

## Support

For deployment issues:
1. Check Vercel logs: `vercel logs --prod`
2. Verify environment variables: `vercel env ls`
3. Check Network tab in browser DevTools for API errors
4. Review backend logs for 401/CORS errors
