# Project Overview: BeeList (Game Library & Wishlist)

## 1. Project Goal
Build a serverless web application that allows users to create accounts, search for video games, and add them to custom lists (Library or Wishlist). The app must be highly concurrent, handling at least 100 simultaneous users without degrading performance, and utilizing exclusively free-tier services.

## 2. Tech Stack & Architecture
- **Framework:** Next.js (React) using the App Router (`/app` directory).
- **Language:** TypeScript.
- **Styling:** Tailwind CSS + shadcn/ui (for accessible, unstyled UI components).
- **Authentication & Database:** Supabase (PostgreSQL + Supabase Auth with SSR).
- **External Data:** RAWG Video Games Database API (for game search and cover art).
- **Hosting:** Vercel.
- **State Management:** React Server Components (RSC) for data fetching; client state only when necessary (e.g., search inputs).

## 3. Database Schema (Supabase)
### Table: `user_games`
Stores the relationship between a user and a game.
- `id` (uuid, primary key, default: `uuid_generate_v4()`)
- `user_id` (uuid, foreign key referencing `auth.users(id)`, not null)
- `game_id` (integer, from RAWG API, not null)
- `game_title` (text, not null - cached to prevent excessive API calls)
- `cover_url` (text, nullable)
- `status` (text, check constraint: `'wishlist'`, `'owned'`, `'playing'`, `'completed'`, not null)
- `created_at` (timestamp with time zone, default: `now()`)
- `updated_at` (timestamp with time zone, default: `now()`)

**Security:** Row Level Security (RLS) must be enabled on `user_games`.
- Policy: `SELECT`, `INSERT`, `UPDATE`, `DELETE` allowed ONLY IF `auth.uid() = user_id`.

## 4. Agent Coding Guidelines
- **Strictly use the Next.js App Router** (`app/` directory). Do not use the older `pages/` directory.
- **Prefer Server Components.** Default to Server Components for data fetching. Use `'use client'` only for interactive components (forms, search bars, buttons).
- **Data Mutations:** Use Next.js Server Actions for communicating with the Supabase database (adding/updating games).
- **Type Safety:** Generate and utilize Supabase TypeScript types. Create strict interfaces for RAWG API responses.
- **Error Handling:** Implement graceful error handling using `error.tsx` boundaries and toast notifications for user feedback.
- **Env Variables:** Expect `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `RAWG_API_KEY` in the `.env.local` file.

---

## 5. Execution Phases

### Phase 1: Initial Scaffolding & Configuration
- [x] Initialize Next.js project with TypeScript, Tailwind CSS, and App Router.
- [x] Install dependencies: `@supabase/supabase-js`, `@supabase/ssr`, `lucide-react`, and configure shadcn/ui.
- [x] Set up the Supabase client utility files for SSR (Server, Client, and Middleware clients) according to the latest Supabase Next.js documentation.

### Phase 2: Authentication
- [x] Build the `/login` and `/signup` pages using Supabase Auth (Email/Password).
- [x] Create Next.js Middleware to protect routes (`/library`, `/wishlist`) and redirect unauthenticated users to `/login`.
- [x] Create a persistent Navigation Bar showing Auth status (Login/Logout buttons).

### Phase 3: External API Integration (RAWG)
- [x] Create a server-side utility function to fetch games from the RAWG API endpoint (`https://api.rawg.io/api/games?search={query}&key={API_KEY}`).
- [x] Build the `/search` page: A client-side search input that triggers the server-side RAWG fetch.
- [x] Create a `GameCard` component displaying the title, release year, and cover image.

### Phase 4: Database Integration & Library Management
- [x] Create Server Actions to `addGameToLibrary`, `updateGameStatus`, and `removeGame`.
- [x] Integrate action buttons into the `GameCard` component (e.g., "Add to Wishlist", "Add to Library").
- [x] Build the `/library` route: Fetch and display games from Supabase where `status` is 'owned', 'playing', or 'completed'.
- [x] Build the `/wishlist` route: Fetch and display games from Supabase where `status` is 'wishlist'. Allow moving a game from the wishlist to the library.

### Phase 5: Polish & Deployment Prep
- [x] Add loading states (`loading.tsx` and React Suspense boundaries) for API and database calls.
- [x] Ensure mobile responsiveness across all routes using Tailwind utility classes.
- [x] Final check of Supabase RLS policies to ensure user data isolation.