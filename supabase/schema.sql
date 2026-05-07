-- ══════════════════════════════════════════════════════
--  Hovers Agency — Supabase Schema
--  Run this entire file in the Supabase SQL Editor once.
--  Re-running is safe: every statement is idempotent.
-- ══════════════════════════════════════════════════════

-- ── Profiles (one row per auth user) ─────────────────
create table if not exists profiles (
  id       uuid primary key references auth.users(id) on delete cascade,
  name     text not null,
  email    text not null unique,
  role     text not null default 'Creative Associate',
  avatar   text default '',
  status   text default 'Available',
  created_at timestamptz default now()
);

-- Profile bio fields (added later — safe to run on existing tables)
alter table profiles add column if not exists bio      text default '';
alter table profiles add column if not exists phone    text default '';
alter table profiles add column if not exists title    text default '';
alter table profiles add column if not exists location text default '';

-- ── Spaces (brands) ───────────────────────────────────
create table if not exists spaces (
  id    text primary key,
  name  text not null,
  color text,
  icon  text
);

alter table spaces add column if not exists description text default '';
alter table spaces add column if not exists website     text default '';
alter table spaces add column if not exists industry    text default '';

-- ── Lists ─────────────────────────────────────────────
create table if not exists lists (
  id       text primary key,
  space_id text references spaces(id) on delete cascade,
  name     text not null
);

-- ── Tasks ─────────────────────────────────────────────
create table if not exists tasks (
  id            text primary key,
  list_id       text references lists(id) on delete cascade,
  title         text not null,
  description   text default '',
  status        text default 'To Do',
  priority      text default 'Normal',
  type          text default 'Other',
  assignees     uuid[]      default '{}',
  assigned_by   uuid        references profiles(id),
  due_date      timestamptz,
  tags          text[]      default '{}',
  time_estimate integer     default 0,
  time_tracked  integer     default 0,
  attachments   jsonb       default '[]',
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ── Comments ──────────────────────────────────────────
create table if not exists comments (
  id            text primary key,
  task_id       text references tasks(id) on delete cascade,
  author_id     uuid references profiles(id),
  author_name   text,
  author_avatar text,
  text          text not null,
  created_at    timestamptz default now()
);

-- ── Brand Assignments ─────────────────────────────────
-- Links a user to a brand. Optional task_type (Static/Video/Design/Copy/Strategy/Other)
-- lets a Manager sub-assign team members for specific work types within a brand.
create table if not exists brand_assignments (
  id           uuid primary key default gen_random_uuid(),
  profile_id   uuid not null references profiles(id) on delete cascade,
  space_id     text not null references spaces(id) on delete cascade,
  task_type    text,
  assigned_by  uuid references profiles(id),
  created_at   timestamptz default now()
);

create unique index if not exists brand_assignments_unique
  on brand_assignments (profile_id, space_id, coalesce(task_type, ''));

-- ── Auto-update tasks.updated_at ──────────────────────
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tasks_updated_at on tasks;
create trigger tasks_updated_at
  before update on tasks
  for each row execute function update_updated_at();

-- ── Row-Level Security ────────────────────────────────
-- All tables: authenticated users can read everything;
-- write policies are permissive for the demo.

alter table profiles enable row level security;
drop policy if exists "profiles: auth read"  on profiles;
drop policy if exists "profiles: auth write" on profiles;
create policy "profiles: auth read"   on profiles for select to authenticated using (true);
create policy "profiles: auth write"  on profiles for all    to authenticated using (true) with check (true);

alter table spaces enable row level security;
drop policy if exists "spaces: auth read"  on spaces;
drop policy if exists "spaces: auth write" on spaces;
create policy "spaces: auth read"     on spaces   for select to authenticated using (true);
create policy "spaces: auth write"    on spaces   for all    to authenticated using (true) with check (true);

alter table lists enable row level security;
drop policy if exists "lists: auth read"  on lists;
drop policy if exists "lists: auth write" on lists;
create policy "lists: auth read"      on lists    for select to authenticated using (true);
create policy "lists: auth write"     on lists    for all    to authenticated using (true) with check (true);

alter table tasks enable row level security;
drop policy if exists "tasks: auth read"  on tasks;
drop policy if exists "tasks: auth write" on tasks;
create policy "tasks: auth read"      on tasks    for select to authenticated using (true);
create policy "tasks: auth write"     on tasks    for all    to authenticated using (true) with check (true);

alter table comments enable row level security;
drop policy if exists "comments: auth read"  on comments;
drop policy if exists "comments: auth write" on comments;
create policy "comments: auth read"   on comments for select to authenticated using (true);
create policy "comments: auth write"  on comments for all    to authenticated using (true) with check (true);

alter table brand_assignments enable row level security;
drop policy if exists "ba: auth read"  on brand_assignments;
drop policy if exists "ba: auth write" on brand_assignments;
create policy "ba: auth read"  on brand_assignments for select to authenticated using (true);
create policy "ba: auth write" on brand_assignments for all    to authenticated using (true) with check (true);

-- ── Enable Realtime ───────────────────────────────────
alter table tasks             replica identity full;
alter table comments          replica identity full;
alter table brand_assignments replica identity full;

-- After running this file, also run (one-time):
--   alter publication supabase_realtime add table tasks;
--   alter publication supabase_realtime add table comments;
--   alter publication supabase_realtime add table brand_assignments;
