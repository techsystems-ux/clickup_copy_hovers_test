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

## Roles and Routing

| Role             | `isManager` | Main experience |
|------------------|-------------|-----------------|
| Admin            | ✓           | Manager views   |
| Manager          | ✓           | Manager views   |
| Executive        | ✗           | ExecutorDashboard (Tasks page) + brand views |
| Graphic Designer | ✗           | ExecutorDashboard (Tasks page) + brand views |

`isManager = role === 'Admin' || role === 'Manager'` (App.jsx:33)

The Tasks page routes to `<ManagerTeamView>` for managers and `<ExecutorDashboard>` for everyone else.

## Key Source Files

```
src/
  App.jsx                          # Root — auth guard, page routing
  store/
    UIContext.jsx                  # Auth state (Supabase), activePage, selectedTaskId, signOut
    StoreContext.jsx                # All data (members, spaces, lists, tasks) + Supabase mutations
    MockData.js                    # Seed shapes, STATUS_COLUMNS, BRAND_GUIDELINES
  lib/
    supabase.js                    # createClient singleton
  components/
    layout/
      Sidebar.jsx / Sidebar.css
      Topbar.jsx / Topbar.css
      SlideOver.jsx / SlideOver.css   # Task detail panel (comments, attachments)
      NewTaskModal.jsx               # Task creation (image + link attachments)
      CommandPalette.jsx
      QuickAdd.jsx
    views/
      LoginView.jsx                 # supabase.auth.signInWithPassword + quick-fill buttons
      HomeView.jsx                  # DesignerHome (2-col) / ManagerHome (KPIs + workload)
      AccountsView.jsx              # DesignerAccountsView (brand cards) / ManagerAccountsView (members)
      KnowledgeBaseView.jsx         # DesignerKnowledgeBase (brand guidelines) / ManagerKnowledgeBase (articles)
      ExecutorDashboard.jsx         # Designer/Executive task list with StatusPicker
      ManagerTeamView.jsx           # Manager: all team tasks
      SettingsView.jsx
supabase/
  schema.sql                       # Run once in Supabase SQL Editor to set up all tables + RLS + seeds
  seed.js                          # Node script to seed auth users + tasks (requires service_role key)
vercel.json                        # SPA catch-all rewrite
```

## Data Model (Supabase)

Tables: `profiles`, `spaces`, `lists`, `tasks`, `comments`

All tables have RLS enabled with permissive `authenticated` policies (read + write for any logged-in user).

**Task shape (camelCase in app, snake_case in DB):**
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

**Status values**: `'To Do'`, `'In Progress'`, `'Done'`  
**Priority values**: `'Urgent'`, `'High'`, `'Normal'`, `'Low'`  
**Type values**: `'Static'`, `'Video'`, `'Design'`, `'Copy'`, `'Strategy'`, `'Other'`

## State Management

- **StoreContext** holds all app data. Access via `useStore()` → `{ state, dispatch, updateTask, updateTaskStatus }`.
- **UIContext** holds auth + UI state. Access via `useUI()` → `{ currentUser, activePage, selectedTaskId, signOut, … }`.
- All mutations are **optimistic** (update local state immediately, then write to Supabase).
- Real-time: Supabase channel `realtime-hovers` subscribes to `tasks` and `comments` postgres_changes, calling `fetchTasks` on any event.
- `dispatch()` is a compatibility shim — maps action types (`ADD_TASK`, `UPDATE_TASK`, `UPDATE_TASK_STATUS`, `ADD_COMMENT`, `ADD_MEMBER`) to Supabase writes.

## Auto-Delete Done Tasks
- **Client-side**: `fetchAll()` in StoreContext deletes tasks where `status = 'Done'` and `updated_at < now() - 4 days` before loading data.
- **Server-side (Pro plan)**: pg_cron job commented in `schema.sql` — runs nightly at 2am.

## Supabase Realtime Setup
Run in SQL Editor (one-time, if not already done):
```sql
alter publication supabase_realtime add table tasks;
alter publication supabase_realtime add table comments;
```
Both tables also have `replica identity full` set in schema.sql.

## Seed Users (in Supabase Auth)

| Email                       | Password    | Role             |
|-----------------------------|-------------|------------------|
| alice@hoversagency.com      | admin123    | Admin            |
| james@hoversagency.com      | manager123  | Manager          |
| bob@hoversagency.com        | exec123     | Executive        |
| diana@hoversagency.com      | diana123    | Executive        |
| charlie@hoversagency.com    | design123   | Graphic Designer |
| evan@hoversagency.com       | evan123     | Graphic Designer |

Seed was run via `supabase/seed.js` using the service_role key.

## Spaces and Lists (seeded)
- `sp1` — Nova Brand → lists: Q3 Social Campaign, Print & OOH Materials
- `sp2` — Peak Retail → list: Influencer Campaign
- `sp3` — Bloom Studio → list: Rebrand Project

## Vercel Deployment
- Repo: `techsystems-ux/clickup_copy_hovers_test`
- Environment Variables set in Vercel dashboard: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- `vercel.json` rewrites all paths to `index.html` for client-side routing

## Credentials File
Full credentials (tokens, keys, user logins) stored at:
`C:\Users\darsh\Downloads\hovers_project_creds.md` — **never commit this file**.

## Conventions
- CSS is co-located per component (e.g. `ExecutorDashboard.css` next to `ExecutorDashboard.jsx`)
- No TypeScript — plain JSX throughout
- No comments in code unless the why is non-obvious
- `currentUser` is always the logged-in profile object from `useUI()`
- Avatar fallback: `https://i.pravatar.cc/150?u=${email}`
