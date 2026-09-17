-- Run this once in the Supabase SQL editor for your project.
-- All access goes through server-side API routes using the service_role key,
-- which always bypasses RLS. RLS is still enabled below (with zero policies)
-- so the anon/publishable key — and Supabase's auto-generated public REST API —
-- gets denied by default instead of having open read/write access to every row.

create extension if not exists pgcrypto;

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  client_id text not null,
  mode text check (mode in ('basic', 'interactive')), -- null until the first wizard step is answered
  title text,
  status text not null default 'collecting'
    check (status in ('collecting', 'generating', 'completed', 'error')),
  flow_state jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists conversations_client_id_idx
  on conversations (client_id, created_at desc);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  role text not null check (role in ('assistant', 'user')),
  content text not null,
  message_type text not null default 'text'
    check (message_type in ('text', 'options', 'summary', 'game_result')),
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists messages_conversation_id_idx
  on messages (conversation_id, created_at);

create table if not exists generated_games (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  spec jsonb not null,
  html_content text not null,
  created_at timestamptz not null default now()
);

create index if not exists generated_games_conversation_id_idx
  on generated_games (conversation_id);

-- No policies defined on purpose: with RLS on and no policy, every role except
-- service_role is denied by default. service_role (used by our API routes) is
-- unaffected since it always bypasses RLS.
alter table conversations enable row level security;
alter table messages enable row level security;
alter table generated_games enable row level security;
