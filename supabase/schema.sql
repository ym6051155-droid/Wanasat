-- Wansat (ونسات) — Supabase schema for the LIVE mode.
-- Run this in the Supabase SQL editor of a NEW project (not the OAU project).
-- The app currently runs in local demo mode without these tables; this
-- schema is the migration path to live Auth + Postgres + Storage + Realtime.
-- RLS notes are inline. Adjust policies before opening registration publicly:
-- the defaults below allow any authenticated user to read public content
-- and only the owner to write their own rows.

create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null, bio text default '', state text default 'السودان',
  avatar_color text default '#0e7c7b', cover_color text default '#0a5e5d',
  created_at timestamptz default now()
);
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references profiles(id) on delete cascade,
  group_id uuid, page_id uuid, text text not null,
  image_url text, created_at timestamptz default now()
);
create table if not exists post_likes (
  post_id uuid references posts(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  primary key (post_id, user_id)
);
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  author_id uuid not null references profiles(id) on delete cascade,
  text text not null, created_at timestamptz default now()
);
create table if not exists friendships (
  id uuid primary key default gen_random_uuid(),
  from_id uuid not null references profiles(id) on delete cascade,
  to_id uuid not null references profiles(id) on delete cascade,
  status text not null check (status in ('pending','accepted')),
  unique (from_id, to_id)
);
create table if not exists follows (
  follower_id uuid references profiles(id) on delete cascade,
  following_id uuid references profiles(id) on delete cascade,
  primary key (follower_id, following_id)
);
create table if not exists groups (
  id uuid primary key default gen_random_uuid(),
  name text not null, description text default '',
  owner_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz default now()
);
create table if not exists group_members (
  group_id uuid references groups(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  primary key (group_id, user_id)
);
create table if not exists pages (
  id uuid primary key default gen_random_uuid(),
  name text not null, description text default '',
  owner_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz default now()
);
create table if not exists page_followers (
  page_id uuid references pages(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  primary key (page_id, user_id)
);
create table if not exists stories (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references profiles(id) on delete cascade,
  text text not null, created_at timestamptz default now(),
  expires_at timestamptz not null
);
create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now()
);
create table if not exists conversation_participants (
  conversation_id uuid references conversations(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  primary key (conversation_id, user_id)
);
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id uuid not null references profiles(id) on delete cascade,
  text text not null, created_at timestamptz default now()
);
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  text text not null, read boolean default false,
  created_at timestamptz default now()
);
create table if not exists listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references profiles(id) on delete cascade,
  title text not null, price numeric not null default 0,
  state text default '', description text default '',
  created_at timestamptz default now()
);
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references profiles(id) on delete cascade,
  title text not null, date date not null, location text default '',
  description text default '', created_at timestamptz default now()
);
create table if not exists event_attendees (
  event_id uuid references events(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  primary key (event_id, user_id)
);

-- RLS: enable on every table. Start with authenticated-read + owner-write.
-- Example (repeat per table, replacing the owner column):
--   alter table profiles enable row level security;
--   create policy "authenticated read" on profiles for select to authenticated using (true);
--   create policy "owner write" on profiles for all to authenticated using (auth.uid() = id) with check (auth.uid() = id);
-- For posts/comments/likes/messages, the owner column is author_id / sender_id
-- / user_id / follower_id as appropriate. Realtime: enable replication on
-- messages and notifications in Supabase Dashboard > Database > Replication
-- once live chat is switched from local state to Realtime.

alter table profiles enable row level security;
alter table posts enable row level security;
alter table post_likes enable row level security;
alter table comments enable row level security;
alter table friendships enable row level security;
alter table follows enable row level security;
alter table groups enable row level security;
alter table group_members enable row level security;
alter table pages enable row level security;
alter table page_followers enable row level security;
alter table stories enable row level security;
alter table conversations enable row level security;
alter table conversation_participants enable row level security;
alter table messages enable row level security;
alter table notifications enable row level security;
alter table listings enable row level security;
alter table events enable row level security;
alter table event_attendees enable row level security;

-- Storage (when image uploads are enabled): create a public bucket named
-- "wansat" and a policy allowing authenticated uploads to their own folder.
-- The current UI does not upload images yet; posts/stories are text in v1.
