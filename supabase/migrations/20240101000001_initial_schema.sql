-- Napulita MVP Database Schema
-- Copyright (c) 2024 Napulita

-- Enable PostGIS extension
create extension if not exists postgis;

-- Enums
create type report_status as enum ('open','claimed','cleaned','invalid');
create type report_category as enum ('dog_poop','trash','overflowing_bin','bulky','butts','other');
create type photo_kind as enum ('before','after');
create type claim_status as enum ('active','completed','expired','canceled');
create type point_event as enum ('report_created','cleanup_verified','flag_upheld');
create type feature_flag_key as enum ('tokens','trust','phash','easter_eggs','push','sponsor_quests','partner_dash');

-- Core tables
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  handle text unique not null,
  display_name text,
  avatar_url text,
  trust int not null default 50,
  points int not null default 0,
  created_at timestamptz default now()
);

create table reports (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  category report_category not null,
  status report_status not null default 'open',
  note text,
  geom geography(Point,4326) not null,
  created_at timestamptz default now()
);
create index idx_reports_geom on reports using gist (geom);
create index idx_reports_recent on reports(created_at);

create table report_photos (
  id bigserial primary key,
  report_id bigint not null references reports(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  kind photo_kind not null,
  url text not null,
  lat double precision,
  lon double precision,
  taken_at timestamptz default now(),
  created_at timestamptz default now(),
  phash text
);

create table claims (
  id bigserial primary key,
  report_id bigint not null references reports(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status claim_status not null default 'active',
  created_at timestamptz default now()
);

create table comments (
  id bigserial primary key,
  report_id bigint not null references reports(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  parent_id bigint references comments(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz default now(),
  edited_at timestamptz
);
create index comments_report_idx on comments(report_id, created_at desc);

create table point_events (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  event point_event not null,
  points_delta int not null,
  created_at timestamptz default now()
);

-- Materialized view for weekly leaderboard
create materialized view leaderboard_weekly as
select user_id, sum(points_delta) as points
from point_events
where created_at >= date_trunc('week', now())
group by user_id;

-- Feature flags for staged rollout
create table feature_flags (
  key feature_flag_key primary key,
  enabled boolean not null default false
);

-- Cities support (for future multi-city)
create table cities (
  id bigserial primary key,
  name text not null,
  country text not null default 'IT'
);

-- Add city reference to reports
alter table reports add column city_id bigint references cities(id);

-- Insert default city (Naples)
insert into cities (name, country) values ('Naples', 'IT');

-- RLS Policies
alter table profiles enable row level security;
alter table reports enable row level security;
alter table report_photos enable row level security;
alter table claims enable row level security;
alter table comments enable row level security;
alter table point_events enable row level security;

create policy "profiles read" on profiles for select using (true);
create policy "profiles self insert" on profiles for insert with check (auth.uid() = id);
create policy "profiles self update" on profiles for update using (auth.uid() = id);

create policy "reports read" on reports for select using (true);
create policy "reports insert own" on reports for insert with check (auth.uid() = user_id);
create policy "reports update owner" on reports for update using (auth.uid() = user_id);

create policy "photos read" on report_photos for select using (true);
create policy "photos insert own" on report_photos for insert with check (auth.uid() = user_id);

create policy "claims read" on claims for select using (true);
create policy "claims insert own" on claims for insert with check (auth.uid() = user_id);
create policy "claims update own" on claims for update using (auth.uid() = user_id);

create policy "comments read" on comments for select using (true);
create policy "comments insert own" on comments for insert with check (auth.uid() = author_id);
create policy "comments update own" on comments for update using (auth.uid() = author_id);

create policy "points read" on point_events for select using (true);
