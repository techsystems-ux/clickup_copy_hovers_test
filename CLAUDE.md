# Hovers Agency — Task Manager (ClickUp Copy)

## Project Overview
A role-based task management SPA built for Hovers Agency. It mimics a ClickUp-style UI with custom views per user role. Data is stored in Supabase (PostgreSQL + Auth + Realtime). Deployed on Vercel.

## Tech Stack
- **Frontend**: React 19 + Vite 8, plain CSS (no Tailwind)
- **Backend**: Supabase (auth, postgres, realtime subscriptions)
- **Icons**: lucide-react
- **DnD**: @hello-pangea/dnd
- **Dates**: date-fns
- **Deploy**: Vercel (SPA rewrite via vercel.json)

## Local Dev
```bash
npm run dev       # start dev server
npm run build     # production build
npm run preview   # preview production build
```

`.env` file (gitignored) must exist at project root:
```
VITE_SUPABASE_URL=https://pixgrkvanbxoceynyzoz.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_s-yQCIKFbpjzdzBB38-2XA_FK9HJ12P
```
`src/lib/supabase.js` falls back to hardcoded values if env vars are missing, so the app boots even when Vercel env vars are blank.

## Roles and Hierarchy

Four roles, ordered by privilege:

| Role                 | Main experience                          | Can assign tasks to                            |
|----------------------|------------------------------------------|------------------------------------------------|
| **Admin**            | AdminDashboard (sidebar shows "Admin")   | anyone except themselves                       |
| **Team Lead**        | ManagerTeamView (Tasks page)             | Executive + Creative Associate                 |
| **Executive**        | ExecutorDashboard (Tasks page)           | Creative Associate only                        |
| **Creative Associate** | ExecutorDashboard (Tasks page)         | nobody (Topbar "+ New Task" button is hidden)  |

`isManager = role === 'Admin' || role === 'Team Lead'` — used in `App.jsx`, `HomeView.jsx`, `KnowledgeBaseView.jsx`.

The hierarchy is enforced in three places:
- `NewTaskModal.jsx` — `executors` filter shows only assignable members for the current user.
- `Topbar.jsx` — hides the "+ New Task" button entirely for Creative Associate.
- `ManagerTeamView.jsx` — its team grid shows only members the current user can supervise.

The Tasks page routes:
- `Admin` / `Team Lead` → `<ManagerTeamView />` (with a "My Tasks" section above the team grid for tasks assigned directly to them)
- `Executive` / `Creative Associate` → `<ExecutorDashboard />`

## Key Source Files

```
src/
  App.jsx                          # Root — auth guard, page routing
  store/
    UIContext.jsx                  # Auth state (Supabase), activePage, selectedTaskId, signOut
                                   # Loads profile bio fields too (bio/phone/title/location)
    StoreContext.jsx               # All data + Supabase mutations
                                   # Optimistic + rollback on error
                                   # pendingMutations ref skips redundant realtime fetches
    MockData.js                    # STATUS_COLUMNS, BRAND_GUIDELINES (legacy mock seed data)
  lib/
    supabase.js                    # createClient singleton with hardcoded fallback URLs
  components/
    layout/
      Sidebar.jsx                  # NavItem defined OUTSIDE Sidebar (perf fix)
      Topbar.jsx                   # "+ New Task" hidden for Creative Associate
      SlideOver.jsx                # Task detail panel — has full StatusPicker (To Do/In Progress/Completed)
      NewTaskModal.jsx             # Hierarchy-filtered "Assign To" + image/link attachments
      CommandPalette.jsx
      QuickAdd.jsx                 # Unused legacy component
    views/
      LoginView.jsx
      HomeView.jsx                 # DesignerHome / ManagerHome
      AccountsView.jsx             # ALL non-admin roles see assigned brands as cards
                                   # Team Lead can sub-assign team members per brand with task-type
      KnowledgeBaseView.jsx
      ExecutorDashboard.jsx        # Brand cards + flat "All Tasks" list with StatusPicker
      ManagerTeamView.jsx          # "My Tasks" section + team member grid drill-down
      SettingsView.jsx             # Full profile editor for non-admins (name/avatar/title/location/phone/bio/status)
      AdminDashboard.jsx           # 3 tabs: Team / Brands / Overview
                                   # Per-user brand assignment chips
                                   # Brand creation with description/website/industry + delete brand
supabase/
  schema.sql                       # Idempotent — safe to re-run any time
  seed.js                          # Node script (requires service_role key)
vercel.json                        # SPA catch-all rewrite
```

## Data Model (Supabase)

Tables: `profiles`, `spaces`, `lists`, `tasks`, `comments`, `brand_assignments`

All tables have RLS enabled with permissive `authenticated` policies (read + write for any logged-in user).

### profiles
Standard fields plus extended bio: `bio`, `phone`, `title`, `location` (all text, default '').
Default role on new profiles: `'Creative Associate'`.

### spaces (brands)
Standard fields plus brand metadata: `description`, `website`, `industry` (all text, default '').

### tasks (camelCase in app, snake_case in DB)
```js
{
  id, listId, title, description, status, priority, type,
  assignees: uuid[],   // array of profile IDs
  assignedBy: uuid,    // profile ID of assigner
  dueDate, tags,
  timeEstimate, timeTracked,
  attachments: [{ id, type: 'image'|'link', url, name }],  // JSONB
  comments: [{ id, authorId, authorName, authorAvatar, text, timestamp }]
}
```

### brand_assignments
Links a user to a brand with optional `task_type` (Static / Video / Design / Copy / Strategy / Other).
Used by Admin to assign brands to anyone, and by Team Lead to sub-assign Executives/Creative Associates per brand for a specific work type.
```sql
brand_assignments (
  id           uuid PK,
  profile_id   uuid → profiles(id) on delete cascade,
  space_id     text → spaces(id) on delete cascade,
  task_type    text NULL,
  assigned_by  uuid → profiles(id),
  created_at   timestamptz
)
-- unique index on (profile_id, space_id, coalesce(task_type, ''))
```

### Enum-like values
- **Status**: `'To Do'`, `'In Progress'`, `'Done'`
- **Priority**: `'Urgent'`, `'High'`, `'Normal'`, `'Low'`
- **Type**: `'Static'`, `'Video'`, `'Design'`, `'Copy'`, `'Strategy'`, `'Other'`
- **Role**: `'Admin'`, `'Team Lead'`, `'Executive'`, `'Creative Associate'`

## State Management

- **StoreContext** holds all app data. Access via `useStore()` → `{ state, dispatch, updateTask, updateTaskStatus, fetchAll }`.
- **UIContext** holds auth + UI state. Access via `useUI()` → `{ currentUser, setCurrentUser, activePage, selectedTaskId, signOut, … }`.

### Optimistic mutations + rollback
Every mutation (`ADD_TASK`, `UPDATE_TASK`, `UPDATE_TASK_STATUS`, `ADD_COMMENT`, `ADD_MEMBER`, `UPDATE_PROFILE`, `DELETE_MEMBER`, `ADD_SPACE`, `UPDATE_SPACE`, `DELETE_SPACE`, `ADD_LIST`, `DELETE_LIST`, `ASSIGN_BRAND`, `UNASSIGN_BRAND`, `UPDATE_MEMBER_ROLE`) updates local state immediately, fires the Supabase write, and **reverts the local state if the write fails**. No more silent ghost data on network errors.

### Realtime loop fix
`pendingMutations` ref in StoreContext counts in-flight local writes. Realtime `fetchTasks`/`fetchBrandAssignments` handlers skip the re-fetch when `pendingMutations > 0`, so our own writes don't trigger a redundant round-trip. External writes (other clients) still propagate normally.

### Realtime channel
Supabase channel `realtime-hovers` subscribes to `tasks`, `comments`, and `brand_assignments` postgres_changes.

## Auto-Delete Done Tasks
- **Client-side**: `fetchAll()` deletes tasks where `status = 'Done'` and `updated_at < now() - 4 days` before loading data.
- **Server-side (Pro plan)**: pg_cron job commented in `schema.sql`.

## Supabase Setup Checklist

When provisioning a new project, run `schema.sql` once, then:

```sql
-- Enable realtime publication
alter publication supabase_realtime add table tasks;
alter publication supabase_realtime add table comments;
alter publication supabase_realtime add table brand_assignments;
```

Plus in **Authentication → Sign In / Providers → Email**:
- ✅ Enable Email provider
- ✅ Disable "Confirm email" (so admin-created users can log in instantly)

## User Credentials

The Admin (workspace owner) is `tech.systems@hovers.in`. All other users are created from the Admin Panel inside the app.

If recreating the Admin from scratch:
1. Supabase Dashboard → Authentication → Users → Add user → `tech.systems@hovers.in` / `admin123` with Auto Confirm
2. SQL: `INSERT INTO profiles (id, name, email, role, avatar, status) SELECT id, 'Admin', 'tech.systems@hovers.in', 'Admin', '', 'Available' FROM auth.users WHERE email = 'tech.systems@hovers.in' ON CONFLICT (id) DO UPDATE SET role = 'Admin';`

## Vercel Deployment
- Repo: `techsystems-ux/clickup_copy_hovers_test`
- Environment Variables (optional thanks to fallback): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- `vercel.json` rewrites all paths to `index.html` for client-side routing

## Credentials File
Full credentials (tokens, keys, user logins) stored at:
`C:\Users\darsh\Downloads\hovers_project_creds.md` — **never commit this file**.

## Deleting a User (FK-aware)
Profiles are referenced by `tasks.assigned_by`, `comments.author_id`, `tasks.assignees[]`, and `brand_assignments`. To safely delete a user, null/strip those references first:

```sql
UPDATE tasks    SET assigned_by = NULL WHERE assigned_by = '<uuid>';
UPDATE comments SET author_id   = NULL WHERE author_id   = '<uuid>';
UPDATE tasks    SET assignees   = array_remove(assignees, '<uuid>') WHERE assignees @> ARRAY['<uuid>']::uuid[];
DELETE FROM brand_assignments WHERE profile_id = '<uuid>';
DELETE FROM profiles          WHERE id         = '<uuid>';
DELETE FROM auth.users        WHERE id         = '<uuid>';
```

## Conventions
- CSS is co-located per component (e.g. `ExecutorDashboard.css` next to `ExecutorDashboard.jsx`)
- No TypeScript — plain JSX throughout
- No comments in code unless the *why* is non-obvious
- `currentUser` is always the logged-in profile object from `useUI()`
- Avatar fallback: `https://i.pravatar.cc/150?u=${email}`
- Brand IDs are `sp_${crypto.randomUUID()}`, list IDs `l_${crypto.randomUUID()}`, task IDs `t_${crypto.randomUUID()}`, comment IDs `c_${crypto.randomUUID()}` — never `Date.now()`
- Service-role keys never appear in `src/`; user creation from the Admin Panel uses a secondary anon `signupClient` with `persistSession: false` so signing up new users doesn't kick the admin out of their session
