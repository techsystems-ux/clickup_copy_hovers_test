-- ══════════════════════════════════════════════════════
--  Hovers Agency — Supabase Schema
--  Run this entire file in the Supabase SQL Editor once.
-- ══════════════════════════════════════════════════════

-- ── Profiles (one row per auth user) ─────────────────
create table if not exists profiles (
  id       uuid primary key references auth.users(id) on delete cascade,
  name     text not null,
  email    text not null unique,
  role     text not null default 'Executive',
  avatar   text default '',
  status   text default 'Available',
  created_at timestamptz default now()
);

-- ── Spaces (brands) ───────────────────────────────────
create table if not exists spaces (
  id    text primary key,
  name  text not null,
  color text,
  icon  text
);

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
create policy "profiles: auth read"   on profiles for select to authenticated using (true);
create policy "profiles: auth write"  on profiles for all    to authenticated using (true) with check (true);

alter table spaces enable row level security;
create policy "spaces: auth read"     on spaces   for select to authenticated using (true);
create policy "spaces: auth write"    on spaces   for all    to authenticated using (true) with check (true);

alter table lists enable row level security;
create policy "lists: auth read"      on lists    for select to authenticated using (true);
create policy "lists: auth write"     on lists    for all    to authenticated using (true) with check (true);

alter table tasks enable row level security;
create policy "tasks: auth read"      on tasks    for select to authenticated using (true);
create policy "tasks: auth write"     on tasks    for all    to authenticated using (true) with check (true);

alter table comments enable row level security;
create policy "comments: auth read"   on comments for select to authenticated using (true);
create policy "comments: auth write"  on comments for all    to authenticated using (true) with check (true);

-- ── Enable Realtime ───────────────────────────────────
-- In the Supabase dashboard also go to:
-- Database → Replication → enable replication for tasks & comments
alter table tasks    replica identity full;
alter table comments replica identity full;

-- ── Auto-delete Done tasks after 4 days ─────────────
-- Supabase Pro: enable pg_cron in the dashboard, then run once:
--   select cron.schedule(
--     'purge-done-tasks',
--     '0 2 * * *',
--     $$delete from tasks where status = 'Done' and updated_at < now() - interval '4 days';$$
--   );
-- On the Free plan, the client-side check in StoreContext handles this on each login.

-- ── Seed: Spaces ─────────────────────────────────────
insert into spaces (id, name, color, icon) values
  ('sp1', 'Nova Brand',   '#111111', '🚀'),
  ('sp2', 'Peak Retail',  '#e91e63', '🛍️'),
  ('sp3', 'Bloom Studio', '#ff6900', '🌸')
on conflict (id) do nothing;

-- ── Seed: Lists ───────────────────────────────────────
insert into lists (id, space_id, name) values
  ('l1', 'sp1', 'Q3 Social Campaign'),
  ('l2', 'sp1', 'Print & OOH Materials'),
  ('l3', 'sp2', 'Influencer Campaign'),
  ('l4', 'sp3', 'Rebrand Project')
on conflict (id) do nothing;
