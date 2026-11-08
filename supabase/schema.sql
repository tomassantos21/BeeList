-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_games table
CREATE TABLE IF NOT EXISTS public.user_games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    game_id INTEGER NOT NULL,
    game_title TEXT NOT NULL,
    cover_url TEXT,
    status TEXT NOT NULL CHECK (status IN ('wishlist', 'owned', 'playing', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_game UNIQUE (user_id, game_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_games ENABLE ROW LEVEL SECURITY;

-- Policies for user_games
DROP POLICY IF EXISTS "Users can view their own game entries" ON public.user_games;
CREATE POLICY "Users can view their own game entries"
    ON public.user_games FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own game entries" ON public.user_games;
CREATE POLICY "Users can insert their own game entries"
    ON public.user_games FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own game entries" ON public.user_games;
CREATE POLICY "Users can update their own game entries"
    ON public.user_games FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own game entries" ON public.user_games;
CREATE POLICY "Users can delete their own game entries"
    ON public.user_games FOR DELETE
    USING (auth.uid() = user_id);

-- Optional: index for fast lookup by user and status
CREATE INDEX IF NOT EXISTS idx_user_games_user_status ON public.user_games (user_id, status);
CREATE INDEX IF NOT EXISTS idx_user_games_user_game ON public.user_games (user_id, game_id);
