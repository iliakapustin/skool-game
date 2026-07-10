-- Skool Game Supabase schema
-- Run this in Supabase SQL Editor before wiring the Next.js API to Supabase.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  browser_player_id text not null unique,
  display_name text not null check (char_length(display_name) between 1 and 24),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.runs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 24),
  category text not null check (
    category in (
      'hobbies',
      'music',
      'money',
      'spirituality',
      'tech',
      'health',
      'careers',
      'sports',
      'love',
      'selfImprovement'
    )
  ),
  difficulty text not null check (difficulty in ('easy', 'normal', 'hard')),
  activity integer not null check (activity >= 0 and activity <= 250000),
  members integer not null check (members >= 1 and members <= 50000),
  mrr integer not null check (mrr >= 0 and mrr <= 5000000),
  level integer not null check (level >= 1 and level <= 300),
  duration_ms integer not null check (duration_ms >= 5000 and duration_ms <= 3600000),
  monetized boolean not null,
  won boolean not null,
  score integer not null check (score >= 0),
  game_version text not null,
  submitted_at timestamptz not null default now()
);

create index if not exists runs_score_idx on public.runs (score desc, submitted_at asc);
create index if not exists runs_category_difficulty_score_idx on public.runs (category, difficulty, score desc, submitted_at asc);
create index if not exists runs_profile_idx on public.runs (profile_id, submitted_at desc);

create or replace view public.leaderboard as
select
  row_number() over (order by r.score desc, r.submitted_at asc) as rank,
  p.browser_player_id as player_id,
  r.display_name,
  r.category,
  r.difficulty,
  r.activity,
  r.members,
  r.mrr,
  r.level,
  r.duration_ms,
  r.monetized,
  r.won,
  r.score,
  r.submitted_at
from public.runs r
join public.profiles p on p.id = r.profile_id;

alter table public.profiles enable row level security;
alter table public.runs enable row level security;

drop policy if exists "Profiles are readable by leaderboard API" on public.profiles;
drop policy if exists "Runs are readable by leaderboard API" on public.runs;
drop policy if exists "No direct browser profile writes" on public.profiles;
drop policy if exists "No direct browser run writes" on public.runs;

create policy "Profiles are readable by leaderboard API"
on public.profiles
for select
using (true);

create policy "Runs are readable by leaderboard API"
on public.runs
for select
using (true);

-- Inserts and updates are intentionally not allowed for anon/authenticated clients.
-- The Next.js server route will write with SUPABASE_SERVICE_ROLE_KEY after validating scores.

