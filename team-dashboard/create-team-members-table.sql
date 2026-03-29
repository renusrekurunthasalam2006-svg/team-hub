-- SQL Script to create team_members table
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL,
    contact TEXT,
    linkedin TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Temporarily disable RLS for testing
ALTER TABLE public.team_members DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON public.team_members TO anon;
GRANT ALL ON public.team_members TO authenticated;