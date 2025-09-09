# Napulita MVP - Keep Naples Clean

A Progressive Web App (PWA) that allows citizens of Naples to report trash and dog poop, claim cleanups, earn points, and compete on leaderboards.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- A Supabase account and project

### 1. Setup Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

### 2. Run Database Migrations

1. Install Supabase CLI: `npm install -g supabase`
2. Link your project: `supabase link --project-ref YOUR_PROJECT_REF`
3. Run migrations: `supabase db push`

### 3. Setup Storage Buckets

In your Supabase dashboard, create these storage buckets:
- `reports` (public read, authenticated write)
- `avatars` (public read, authenticated write)

### 4. Install and Run

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to see the app.

## 📱 Features

### MVP Features (Phase 0)
- ✅ **Authentication**: Apple/Google/Email magic link
- ✅ **Report Creation**: Photo + GPS + category
- ✅ **Interactive Map**: Clustered pins with filters
- ✅ **Claim & Cleanup**: After-photo with validation (3h, 40m rules)
- ✅ **Points System**: +2 report, +20 verified cleanup
- ✅ **Leaderboards**: Weekly and all-time
- ✅ **Comments**: Threaded comments on reports
- ✅ **Rate Limiting**: 10 reports/day per user

### Future Features (Phase 1+)
- 🔄 **Trust Score**: Weight verifications
- 🔄 **pHash**: Duplicate detection
- 🔄 **Push Notifications**: Real-time updates
- 🔄 **Native Apps**: Flutter iOS/Android
- 🔄 **Tokens/Tipping**: Reward system

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Supabase (Postgres + PostGIS + Auth + Storage + Realtime)
- **Maps**: MapLibre GL JS
- **Deployment**: Vercel (frontend) + Supabase (backend)

### Database Schema
- **Core Tables**: profiles, reports, report_photos, claims, comments, point_events
- **Geospatial**: PostGIS for location queries and distance calculations
- **RLS**: Row Level Security enabled on all tables
- **RPC Functions**: Server-side business logic (rate limits, validation)

### API Design
All client mutations go through RPC functions:
- `rpc_create_report()` - Create report with validation
- `rpc_claim_report()` - Claim a report
- `rpc_submit_cleanup()` - Submit cleanup with time/distance checks
- `rpc_get_reports()` - Fetch reports with bbox filtering
- `rpc_post_comment()` - Add comments
- `rpc_get_leaderboard()` - Get weekly/all-time leaderboards

## 🗺️ Project Structure

```
napulita/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── signin/            # Auth page
│   │   ├── report/            # Create report page
│   │   ├── reports/[id]/      # Report detail page
│   │   ├── leaderboard/       # Leaderboard page
│   │   └── profile/[id]/      # Profile page
│   ├── components/            # React components
│   │   ├── ui/               # Base UI components
│   │   ├── map/              # Map components
│   │   └── reports/          # Report components
│   └── lib/                  # Utilities
│       ├── supabase.ts       # Supabase client
│       ├── utils.ts          # Helper functions
│       └── storage.ts        # File upload utilities
├── supabase/
│   └── migrations/           # Database migrations
├── public/                   # Static assets
└── README.md
```

## 🔧 Development

### Environment Variables
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database Migrations
```bash
# Create new migration
supabase migration new migration_name

# Apply migrations
supabase db push

# Reset database
supabase db reset
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Backend (Supabase)
- Database and storage are hosted on Supabase
- No additional deployment needed

## 📊 Business Rules

### Report Creation
- Max 10 reports per user per day
- Required: GPS location, category, photo
- Optional: note
- +2 points for creating report

### Claim & Cleanup
- Only open reports can be claimed
- One claim per report per user
- Cleanup must be within 3 hours of report creation
- Cleanup must be within 40 meters of original location
- +20 points for verified cleanup

### Leaderboards
- Weekly leaderboard refreshes daily
- All-time leaderboard shows total points
- Top 100 users displayed

## 🔒 Security & Privacy

- **RLS**: All data access controlled by Row Level Security
- **Rate Limiting**: Server-side validation prevents abuse
- **EXIF Stripping**: Images processed to remove metadata
- **Public Space Only**: Clear terms of service
- **Age Gate**: 16+ requirement

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Test specific features
npm run test:api
npm run test:components
```

## 📈 Analytics

- Activity events logged for key actions
- Privacy-safe metrics (no PII beyond auth UID)
- Error reporting to console and errors table

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

Copyright (c) 2024 Napulita. All rights reserved.

## 🆘 Support

For issues and questions:
- Create an issue on GitHub
- Check the documentation
- Contact the development team

---

**Built with ❤️ for Naples**
