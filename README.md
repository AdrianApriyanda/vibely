# Vibely

A modern location discovery platform that combines Tinder swipe interactions, Google Maps-style exploration, AI-powered recommendations, and social discovery.

## Features

- **Swipe Discovery**: Tinder-style swipe cards for place discovery
- **Interactive Map**: Fullscreen Mapbox map with dark custom style
- **AI Search**: Natural language search with intent parsing
- **Group Match**: Find places everyone in your group will love
- **Smart Filters**: Advanced filtering by category, vibe, amenities, and more
- **Saved Places**: Collections system with folders
- **Business Dashboard**: Analytics and promotion management
- **Admin Dashboard**: Moderation and user management

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Maps**: Mapbox GL JS
- **State Management**: Zustand
- **Animations**: Framer Motion

## Quick Start

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your credentials
3. Run the Supabase migration in `supabase/migrations/001_initial_schema.sql`
4. Install dependencies: `npm install`
5. Start development server: `npm run dev`

## Environment Variables

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_MAPBOX_TOKEN=your-mapbox-token
```

## Project Structure

```
src/
  components/       # Reusable UI components
  pages/            # Route pages
  hooks/            # Custom React hooks
  services/          # API services
  contexts/          # React contexts & Zustand stores
  integrations/      # Third-party integrations
  lib/               # Utilities & mock data
  utils/             # Helper functions
  styles/            # Global styles
  types/             # TypeScript types
```

## Pages

- `/` - Landing Page
- `/auth` - Authentication (Email + Google)
- `/explore` - Interactive Map
- `/swipe` - Tinder-style Discovery
- `/place/:id` - Place Detail
- `/saved` - Saved Places & Collections
- `/profile` - User Profile
- `/search` - AI Search
- `/group-match` - Group Decision Mode
- `/settings` - App Settings
- `/business` - Business Dashboard
- `/admin` - Admin Dashboard

## License

MIT
