# Napulita Deployment Guide

## 🚀 Quick Setup & Deploy

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `napulita`
   - Database Password: (choose a strong password - save this!)
   - Region: Choose closest to Italy (Europe West)
5. Click "Create new project"
6. Wait for the project to be created (2-3 minutes)

### Step 2: Get Your Credentials
1. Go to Settings > API in your Supabase dashboard
2. Copy these values:
   - **Project URL** (looks like: `https://abcdefgh.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)
   - **service_role key** (long string starting with `eyJ...` - keep this secret!)

### Step 3: Update Environment Variables
Edit `.env.local` and replace with your real values:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 4: Run Database Migrations
```bash
# Link your project (replace YOUR_PROJECT_REF with your actual project ref)
supabase link --project-ref YOUR_PROJECT_REF

# Run migrations
supabase db push
```

### Step 5: Create Storage Buckets
In your Supabase dashboard, go to Storage and create:

**Bucket: `reports`**
- Public bucket: ✅ Yes
- File size limit: 10MB
- Allowed MIME types: image/jpeg, image/png

**Bucket: `avatars`**
- Public bucket: ✅ Yes
- File size limit: 5MB
- Allowed MIME types: image/jpeg, image/png

### Step 6: Enable Authentication
In Supabase dashboard > Authentication > Providers:
- Enable email provider ✅
- Enable Google provider ✅ (optional)

## 🌐 Deploy to Vercel (Production)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Initial Napulita MVP"
git push origin main
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` (set to your Vercel domain)
5. Click "Deploy"

### Step 3: Update Supabase Settings
1. In Supabase dashboard > Authentication > URL Configuration
2. Add your Vercel domain to "Site URL" and "Redirect URLs"
3. Update CORS settings if needed

## 🧪 Test Everything

### Local Testing
1. `npm run dev`
2. Visit `http://localhost:3000`
3. Try signing in with email magic link
4. Test report creation (after implementing pages)

### Production Testing
1. Visit your Vercel domain
2. Test all functionality
3. Check Supabase dashboard for data

## 📱 PWA Features

The app is already configured as a PWA:
- Installable on mobile devices
- Works offline (basic functionality)
- App-like experience

## 🔧 Troubleshooting

- **Migration errors**: Check project ref is correct
- **Auth errors**: Verify environment variables
- **CORS errors**: Add domain to Supabase allowed origins
- **Storage errors**: Check bucket permissions

## 🎯 Next Steps After Deployment

1. **Complete the placeholder pages** with full functionality
2. **Add real map integration** (MapLibre GL)
3. **Implement camera functionality** for reports
4. **Add push notifications**
5. **Optimize for mobile**

## 📊 Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **Supabase Dashboard**: Database and auth monitoring
- **Error Tracking**: Consider adding Sentry for production

Your app will be live and scalable! 🚀
