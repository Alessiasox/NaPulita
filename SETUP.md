# Napulita Setup Guide

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `napulita`
   - Database Password: (choose a strong password)
   - Region: Choose closest to Italy
5. Click "Create new project"
6. Wait for the project to be created (2-3 minutes)

## 2. Get Your Credentials

1. Go to Settings > API in your Supabase dashboard
2. Copy these values:
   - Project URL
   - anon/public key
   - service_role key (keep this secret!)

## 3. Update Environment Variables

Edit `.env.local` and replace the placeholder values:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 4. Run Database Migrations

Install Supabase CLI:
```bash
npm install -g supabase
```

Link your project:
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

Run migrations:
```bash
supabase db push
```

## 5. Create Storage Buckets

In your Supabase dashboard, go to Storage and create these buckets:

### Bucket: `reports`
- Public bucket: ✅ Yes
- File size limit: 10MB
- Allowed MIME types: image/jpeg, image/png

### Bucket: `avatars`  
- Public bucket: ✅ Yes
- File size limit: 5MB
- Allowed MIME types: image/jpeg, image/png

## 6. Test the Setup

1. Make sure your dev server is running: `npm run dev`
2. Visit `http://localhost:3000`
3. Try signing in with email magic link
4. Check the Supabase dashboard to see if data is being created

## 7. Enable Authentication Providers

In Supabase dashboard > Authentication > Providers:

### Email
- Enable email provider ✅
- Confirm email: ✅ (for production)

### Google (optional)
- Enable Google OAuth provider ✅
- Add your Google OAuth credentials

## Troubleshooting

- **Migration errors**: Make sure you're using the correct project ref
- **Auth errors**: Check that your environment variables are correct
- **Storage errors**: Verify bucket permissions and policies
- **CORS errors**: Make sure your domain is added to allowed origins

## Next Steps

Once setup is complete:
1. Test report creation
2. Test claim/cleanup flow  
3. Test leaderboard
4. Deploy to Vercel
