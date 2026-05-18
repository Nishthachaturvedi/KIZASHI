# KIZASHI Frontend - Quick Reference

## 🚀 Start Here

### 1️⃣ Local Development (60 seconds)
```bash
pnpm install        # Install dependencies
pnpm dev            # Start dev server → http://localhost:3000
```

**What you need:**
- Backend running on `http://127.0.0.1:8000`
- `.env.local` configured ✓ (already done)

### 2️⃣ Deploy to Vercel (5 minutes)

```bash
# Option A: Push to GitHub (connected to Vercel)
git push origin main

# Option B: Use Vercel CLI
vercel deploy --prod
```

**Then set environment variable in Vercel dashboard:**
- Go to **Settings → Environment Variables**
- Add: `NEXT_PUBLIC_API_BASE_URL=https://your-api.com`
- Redeploy

## 📁 Key Files at a Glance

| File | Purpose | Edit For |
|------|---------|----------|
| `.env.local` | API base URL (local) | Change backend URL |
| `vercel.json` | Vercel deployment config | Add security headers, redirects |
| `lib/api/client.ts` | API client | Add new endpoints |
| `lib/types/api.ts` | TypeScript types | Define new data structures |
| `lib/context/auth-context.tsx` | Auth state | Modify auth flow |
| `app/layout.tsx` | Root layout | Update metadata, fonts |
| `app/page.tsx` | Landing page | Change homepage |
| `app/globals.css` | Design tokens | Customize colors/fonts |

## 🔧 Environment Variables

### Local (Development)
```env
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

### Vercel (Production)
Set in dashboard → Settings → Environment Variables
```env
NEXT_PUBLIC_API_BASE_URL=https://api.kizashi.com
```

## 📱 Pages & Routes

```
/                    Landing page
/login               User login
/register            Sign up
/dashboard           Main dashboard
/behaviour-logging   Track behaviors
/productivity        Work analytics
/lifestyle           Health metrics
/mental-health       Wellness tracking
/recommendations     Personalized insights
```

## 🔐 Authentication Flow

```
[User] → /register → Create account → /dashboard
         /login → Check credentials → /dashboard
         /logout → Clear token → /
```

## 📊 API Integration

### Every API call uses:
```
NEXT_PUBLIC_API_BASE_URL + endpoint

Example:
NEXT_PUBLIC_API_BASE_URL = "https://api.com"
endpoint = "/login"
→ Full URL = "https://api.com/login"
```

### Core Endpoints
```
POST   /login              ← Login user
POST   /register           ← Create account
GET    /user/profile            ← Get user data
GET    /behavior/logs           ← List behaviors
POST   /behavior/logs           ← Add behavior
GET    /analytics/productivity  ← Work metrics
GET    /analytics/lifestyle     ← Health metrics
GET    /analytics/mental-health ← Wellness
```

## 🎨 Design System

### Colors
```css
--primary: oklch(0.55 0.22 257)      /* Purple */
--accent: oklch(0.52 0.18 47)        /* Orange */
--background: oklch(0.08 0 0)        /* Deep dark */
--foreground: oklch(0.95 0 0)        /* Off-white */
```

### CSS Classes
```html
<div class="glass">              <!-- Glassmorphic card -->
<div class="glass-sm">           <!-- Smaller version -->
<div class="glow">               <!-- Shadow effect -->
```

## 🛠️ Common Tasks

### Add a New Page
```typescript
// Create: app/new-feature/page.tsx
'use client';
import { useAuth } from '@/lib/context/auth-context';

export default function NewFeaturePage() {
  const { isAuthenticated } = useAuth();
  
  // Add your content
  return <main></main>;
}
```

### Add an API Endpoint
```typescript
// Step 1: Add type in lib/types/api.ts
export interface MyData { ... }

// Step 2: Add method in lib/api/client.ts
async getMyData() {
  return this.request<APIResponse<MyData>>('/my-endpoint');
}

// Step 3: Use in component
const response = await apiClient.getMyData();
```

### Customize Colors
```css
/* app/globals.css */
.dark {
  --primary: oklch(0.55 0.22 257);  /* Change purple */
  --accent: oklch(0.52 0.18 47);    /* Change orange */
}
```

## 🐛 Troubleshooting

### "Cannot connect to API"
```bash
# Check:
1. Is backend running? curl http://127.0.0.1:8000/health
2. Is NEXT_PUBLIC_API_BASE_URL correct?
3. Does backend have CORS enabled?
```

### "Env variable not updating"
```bash
# On Vercel: Set in dashboard → Settings → Environment Variables
# Then: Redeploy (vercel deploy --prod)
# Then: Hard refresh browser (Cmd/Ctrl + Shift + R)
```

### "Build fails"
```bash
# Try:
pnpm install          # Reinstall
pnpm build            # Test build locally
npm run lint          # Check for errors
```

## 📚 Documentation Files

| File | Contains |
|------|----------|
| `README.md` | Complete project overview |
| `SETUP.md` | Quick setup guide |
| `DEPLOYMENT.md` | Production deployment |
| `API_INTEGRATION.md` | Full API reference |
| `BUILD_SUMMARY.md` | What was built |
| `QUICK_REFERENCE.md` | This file |

## ✅ Deployment Checklist

- [ ] Backend API deployed and accessible
- [ ] CORS configured on backend for your domain
- [ ] Environment variable set in Vercel dashboard
- [ ] Local build successful: `pnpm build`
- [ ] Run production: `pnpm start` (test locally)
- [ ] Deploy: `vercel deploy --prod`
- [ ] Test login/register in production
- [ ] Test all analytics pages

## 💡 Pro Tips

### 1. Preview Deployments
Every branch push automatically creates a preview:
```bash
git checkout -b feature-branch
git push origin feature-branch
# Vercel creates automatic preview URL
```

### 2. Environment Isolation
```env
# .env.local (git-ignored, local only)
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000

# Set different URL in Vercel for production
```

### 3. Fast Debugging
```bash
# See what's in browser console
console.log(process.env.NEXT_PUBLIC_API_BASE_URL)

# Test API manually
curl -H "Authorization: Bearer {token}" https://api.com/endpoint
```

### 4. Type Safety
```typescript
// TypeScript catches errors before runtime
const response = await apiClient.getProductivityMetrics();
response.data.daily_average  // ✓ Autocomplete works
response.data.invalid_field  // ✗ Error (type mismatch)
```

## 📞 Need Help?

1. **Setup issues**: See `SETUP.md`
2. **Deployment issues**: See `DEPLOYMENT.md`
3. **API questions**: See `API_INTEGRATION.md`
4. **Architecture**: See `README.md`
5. **What was built**: See `BUILD_SUMMARY.md`

## 🎯 What's Ready

✅ All 9 pages built and working
✅ API client with all endpoints
✅ Authentication system
✅ Dark mode UI with animations
✅ Type-safe TypeScript
✅ Mobile responsive
✅ Production optimized
✅ Environment variable support
✅ Comprehensive documentation
✅ Build verified and tested

## 🚀 Ready to Deploy!

Your frontend is production-ready. Just:

1. Set the environment variable in Vercel dashboard
2. Run `vercel deploy --prod`
3. Test in production

That's it! 🎉
