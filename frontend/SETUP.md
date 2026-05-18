# KIZASHI Frontend - Quick Setup Guide

## ⚡ 5-Minute Setup

### 1. Environment Configuration

The most important step: Configure your API base URL.

#### For Local Development

```bash
# This file should already exist
cat .env.local
# Should contain:
# NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

#### For Production (Vercel)

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add new variable:
   - **Name**: `NEXT_PUBLIC_API_BASE_URL`
   - **Value**: `https://your-api-domain.com` (your actual backend URL)
   - **Environments**: Select all needed environments

3. Redeploy your project

### 2. Install & Run Locally

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open http://localhost:3000
```

### 3. Test the Application

1. Visit homepage (should show "Get Started" button)
2. Click "Register" and create a test account
3. After login, you'll see the dashboard
4. Try navigating through different analytics pages

## 📋 Key Files

| File | Purpose |
|------|---------|
| `.env.example` | Template for environment variables |
| `.env.local` | Local development variables (don't commit) |
| `lib/api/client.ts` | Centralized API client - uses `NEXT_PUBLIC_API_BASE_URL` |
| `lib/context/auth-context.tsx` | Authentication state management |
| `app/dashboard/page.tsx` | Main dashboard page |
| `vercel.json` | Vercel deployment configuration |

## 🔧 Configuration Options

### API Base URL Examples

```env
# Local Backend
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000

# Production
NEXT_PUBLIC_API_BASE_URL=https://api.kizashi.com

# Staging
NEXT_PUBLIC_API_BASE_URL=https://staging-api.kizashi.com

# Docker Container
NEXT_PUBLIC_API_BASE_URL=http://backend:8000
```

## 🚀 Deployment Checklist

- [ ] Backend is deployed and accessible
- [ ] CORS is configured on backend
- [ ] Environment variable is set in Vercel
- [ ] Run production build: `pnpm build`
- [ ] Test: `pnpm start`
- [ ] Deploy: `vercel deploy --prod`

## 🔐 Security Notes

The `NEXT_PUBLIC_` prefix means this variable is public. This is **safe** because:

- It's just the API endpoint URL (not a secret)
- Your actual auth is handled by tokens in requests
- Backend validates all requests with proper auth

## ❓ Common Issues

### "Cannot reach API"

**Check:**
1. Is `NEXT_PUBLIC_API_BASE_URL` set?
2. Is your backend running?
3. Is backend accessible from your location?
4. Does backend have CORS enabled?

**Solution:**
```bash
# Test API connectivity
curl https://api.kizashi.com/health
```

### "Environment variable not updating"

**Solution:**
1. Set variable in Vercel dashboard
2. Redeploy: `vercel deploy --prod`
3. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

### "Build fails on Vercel"

**Check:**
1. All dependencies installed: `pnpm install`
2. Build works locally: `pnpm build`
3. No TypeScript errors: Review build output
4. Check Vercel logs: `vercel logs --prod`

## 📚 More Information

- **Detailed Deployment**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **API Reference**: See [README.md](./README.md#api-endpoints)
- **Code Structure**: See [README.md](./README.md#project-structure)

## 💡 Pro Tips

1. **Use Vercel CLI** for easier deployment:
   ```bash
   npm install -g vercel
   vercel deploy --prod
   ```

2. **Preview Deployments**: Every git push to a branch creates a preview:
   ```bash
   git push origin feature-branch
   # Vercel automatically creates a preview deployment
   ```

3. **Monitor Performance**: Use Vercel Analytics in dashboard

4. **Cache Busting**: If frontend seems outdated after deploy:
   - Hard refresh in browser
   - Wait 60 seconds for CDN cache invalidation

## 🆘 Need Help?

1. Check the [DEPLOYMENT.md](./DEPLOYMENT.md) troubleshooting section
2. Review [README.md](./README.md) for detailed information
3. Check browser DevTools Network tab for API errors
4. Verify backend is responding correctly

---

**Next Step**: Run `pnpm dev` and test the application locally!
