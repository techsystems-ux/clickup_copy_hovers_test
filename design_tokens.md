# Hovers OS — Design Tokens Reference

> Extracted from `globals.css`, `layout.tsx`, `sidebar.tsx`, and all four page files.

---

## 🔤 Typography

### Font Family
| Scope | Value |
|---|---|
| Global (body) | `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` |
| Knowledge Base (article sidebar) | Inherits global — **no custom font on KB** |

> No Google Fonts are imported. The system font stack is used everywhere.

---

### Font Sizes — All Pages

| Tailwind Class | Pixel Equivalent | Usage |
|---|---|---|
| `text-[7px]` | 7px | Avatar initials (small overlapping avatars) |
| `text-[8px]` | 8px | Avatar initials (medium), small badge labels |
| `text-[9px]` | 9px | Overdue badges, "late" labels, metadata chips, status badges, tag labels |
| `text-[10px]` | 10px | Section subtitles, timestamps, column headers, due date labels, breadcrumb text |
| `text-[10px]` / `text-xs` | 10–12px | Filter tab text, search input, secondary labels |
| `text-[11px]` | 11px | Panel titles (uppercase), activity feed text, task title in board view |
| `text-[13px]` | 13px | Task titles (brands/list view), account names in table, sidebar nav labels, user name in sidebar |
| `text-sm` (14px) | 14px | Task detail description, account POC name, notes textarea, KB article body text, dropdown items |
| `text-xs` (12px) | 12px | General body text, filter labels, table cells, sub-headings in detail panels |
| `text-base` (16px) | 16px | Account detail panel heading |
| `text-lg` (18px) | 18px | Stat numbers in account detail quick stats |
| `text-xl` (20px) | 20px | Page headings (Tasks, Accounts), KB article `<h1>` title, Home greeting |
| `text-2xl` (24px) | 24px | KB article main title (`<h1>`) |
| `text-lg` in `font-black` | 18px | Stat value on home page stat cards |
| `text-xl` in `font-black` | 20px | Page H2 headers |

---

### Font Weights

| Weight | Tailwind | Usage |
|---|---|---|
| 400 (normal) | `font-normal` | Not explicitly used |
| 500 | `font-medium` | KB nav links, date labels, dropdown items |
| 600 | `font-semibold` | Nav labels, task titles, account names, filter buttons, most body text |
| 700 | `font-bold` | Panel headers, section headings, KB topic/section titles |
| 800–900 | `font-black` | Page headings, logo, stat values, task detail title |

---

## 🎨 Colour System

### Global CSS Variables (`globals.css`)

| Variable | Hex | Usage |
|---|---|---|
| `--white` | `#FFFFFF` | Pure white |
| `--off-white` | `#FAFAFA` | Body background, hover states, raised surfaces |
| `--light-grey` | `#F5F5F5` | Surface sunken, tag backgrounds, stat card fills |
| `--mid-grey` | `#E8E8E8` | Priority bar (medium), borders |
| `--border` | `#E0E0E0` | Input borders, subtle dividers |
| `--border-subtle` | `#EEEEEE` | Very subtle borders |
| `--text-primary` | `#080808` | All primary text, headings, active nav, buttons |
| `--text-secondary` | `#444444` | Secondary text (e.g. creator name in activity) |
| `--text-tertiary` | `#888888` | Subtitles, placeholders, icon colour |
| `--text-muted` | `#BBBBBB` | Account name in task row, designation text |
| `--accent` | `#B20F00` | Brand red — overdue alerts, urgent priority, logo dot, CTA borders |
| `--accent-hover` | `#9A0D00` | Hover state of accent |
| `--surface` | `#FFFFFF` | Card background |
| `--surface-raised` | `#FAFAFA` | Hover background, raised panels |
| `--surface-sunken` | `#F5F5F5` | Inputs, tags, badges |

---

### Extended Colour Usage (hardcoded in components)

| Hex | Role | Pages |
|---|---|---|
| `#080808` | Primary text, active nav bg, avatar bg, button bg, "In Progress" status | All |
| `#FAFAFA` | Hover state bg, `surface-raised` | All |
| `#F5F5F5` | Tags, badge bg, inactive status, sunken surfaces | All |
| `#E8E8E8` | Card borders, sidebar borders, medium priority bar | All |
| `#E0E0E0` | Input borders, dot separator, online indicator (offline) | Tasks, Accounts |
| `#EEEEEE` | Subtle borders | Global |
| `#B20F00` | Accent red — urgent, overdue, churned, logo dot, accent borders | All |
| `#9A0D00` | Accent hover | Global vars only |
| `#888888` | Tertiary text, icon colour, placeholder | All |
| `#BBB` / `#BBBBBB` | Muted text — account name in task rows | Home, Tasks |
| `#CCC` / `#CCCCCC` | Very muted — timestamps, empty states, chevron icons | All |
| `#AAA` / `#AAAAAA` | Dimmer text — task count labels, inactive priorities | All |
| `#444444` | Secondary text (e.g. activity creator name) | Home |
| `#10B981` | Online/active indicator dot (green) | Home |
| `#222222` | Button hover (bg-[#080808] hover) | Tasks, Accounts |
| `#B20F00]/5` | Translucent red bg (5% opacity) — overdue strip, at-risk badge bg | Home, Tasks |
| `#B20F00]/10` | Translucent red bg (10%) — at-risk avatar bg | Home |
| `#B20F00]/15` | Translucent red border — attention strip border | Home |
| `#080808]/20` | Translucent dark border on hover | Home stat cards |
| `#080808]/30` | Translucent dark border on hover | Home stat cards |
| `black/20` | Modal overlay scrim | Tasks, Accounts |

---

## 📄 Page-by-Page Breakdown

---

### 🏠 Home (`/`)

| Element | Font Size | Weight | Colour |
|---|---|---|---|
| Page greeting (H2) | `text-lg` (18px) | `font-black` | `#080808` + `.` in `#B20F00` |
| Date subtitle | `text-xs` (12px) | normal | `#888` |
| "Master DB" link | `text-[10px]` | `font-semibold` | `#888` → `#080808` on hover |
| Online count label | `text-[10px]` | normal | `#CCC` |
| Attention strip text | `text-xs` | `font-semibold` | `#080808` / `#B20F00` |
| Stat value | `text-xl` (20px) | `font-black` | `#080808` or `#B20F00` (highlight) |
| Stat label | `text-[10px]` | `font-semibold uppercase` | `#888` |
| Panel title | `text-[11px]` | `font-bold uppercase tracking-widest` | `#080808` |
| Panel badge | `text-[9px]` | `font-bold` | `#888` on `#F5F5F5` |
| Panel "All" link | `text-[10px]` | `font-semibold` | `#888` → `#080808` |
| Panel subtitle | `text-[10px]` | normal | `#CCC` |
| Task title (in row) | `text-xs` | `font-semibold` | `#080808` |
| Account name in row | `text-[10px]` | normal | `#BBB` |
| Due date (normal) | `text-[10px]` | normal | `#CCC` |
| Due date (overdue) | `text-[10px]` | `font-semibold` | `#B20F00` |
| "Overdue" section label | `text-[9px]` | `font-bold uppercase tracking-widest` | `#B20F00` |
| "Today" section label | `text-[9px]` | `font-bold uppercase tracking-widest` | `#080808` |
| Activity text | `text-[11px]` | normal | `#080808` |
| Activity timestamp | `text-[9px]` | normal | `#CCC` |
| Account name (matrix) | `text-xs` | `font-semibold` | `#080808` |
| "Lead" label | `text-[9px]` | normal | `#888` |
| "open tasks" label | `text-[9px]` | `font-semibold` | `#888` |
| "late" badge | `text-[9px]` | `font-bold` | `#B20F00` |
| Member name (workload) | `text-xs` | `font-semibold` | `#080808` |
| Acc count label | `text-[9px]` | normal | `#CCC` |
| Workload bar label | `text-[9px]` | `font-semibold` | `#AAA` |
| Sales lead company | `text-xs` | `font-semibold` | `#080808` |
| Lead source text | `text-[10px]` | normal | `#CCC` |
| Empty state text | `text-xs` | normal | `#CCC` |

**Priority bar colours:**
- Urgent → `#B20F00`
- High → `#080808`
- Medium → `#CCC`
- Low → `#E8E8E8`

---

### ✅ Tasks (`/tasks`)

| Element | Font Size | Weight | Colour |
|---|---|---|---|
| Page heading (H2) | `text-xl` (20px) | `font-black` | `#080808` |
| Subtitle | `text-xs` | normal | `#888` |
| View toggle (active) | `text-[11px]` | `font-semibold` | `#080808` on `white` |
| View toggle (inactive) | `text-[11px]` | `font-semibold` | `#AAA` |
| "New Task" button | `text-xs` | `font-semibold` | `white` on `#080808` → `#222` hover |
| Search input | `text-xs` | normal | `#080808` / placeholder `#CCC` |
| Account select | `text-xs` | normal | `#444` |
| "Hide completed" label | `text-xs` | normal | `#888` |
| Brand name (group header) | `text-sm` (14px) | `font-bold` | `#080808` |
| Brand industry | `text-[10px]` | normal | `#CCC` |
| Brand overdue badge | `text-[10px]` | `font-bold` | `#B20F00` on `#B20F00/5` |
| Brand active badge | `text-[10px]` | `font-semibold` | `#080808` on `#F5F5F5` |
| Brand task count | `text-[10px]` | `font-semibold` | `#CCC` |
| Task title (brands view) | `text-[13px]` | `font-semibold` | `#080808` (done: `line-through #CCC`) |
| Task description | `text-[11px]` | normal | `#BBB` |
| Tag label | `text-[9px]` | `font-medium` | `#AAA` on `#F5F5F5` |
| Status badge (backlog) | `text-[10px]` | `font-semibold` | `#AAA` on `#F5F5F5` |
| Status badge (todo) | `text-[10px]` | `font-semibold` | `#080808` on `#F5F5F5` |
| Status badge (in progress/review) | `text-[10px]` | `font-semibold` | `white` on `#080808` |
| Status badge (done) | `text-[10px]` | `font-semibold` | `#CCC` on `#F5F5F5` |
| Assignee name | `text-[10px]` | normal | `#888` |
| Due date (normal) | `text-[11px]` | `font-medium` | `#AAA` |
| Due date (overdue) | `text-[11px]` | `font-medium` | `#B20F00` |
| List view column header | `text-[10px]` | `font-bold uppercase tracking-widest` | `#BBB` |
| List view task title | `text-[13px]` | `font-semibold` | `#080808` |
| List view account name | `text-xs` | normal | `#888` |
| Board column label | `text-[11px]` | `font-bold uppercase tracking-wider` | `#080808` |
| Board column count | `text-[10px]` | `font-semibold` | `#CCC` |
| Board card task title | `text-xs` | `font-semibold` | `#080808` |
| Board card account | `text-[10px]` | normal | `#BBB` |
| Board card due date | `text-[10px]` | normal/semibold | `#CCC` / `#B20F00` |
| **Detail panel** — account label | `text-xs` | `font-semibold` | `#888` |
| Detail panel title | `text-xl` (20px) | `font-black` | `#080808` |
| Detail panel description | `text-sm` | normal | `#888` |
| Detail prop label | `text-[11px]` | `font-bold uppercase tracking-wider` | `#888` |
| Detail prop value | `text-sm` | `font-semibold` | `#080808` |
| Detail section heading | `text-xs` | `font-bold uppercase tracking-widest` | `#080808` |
| Notes textarea | `text-sm` | normal | `#080808` / placeholder `#CCC` |
| Activity creator | `text-xs` | `font-semibold` | `#444` |
| Activity date | `text-[10px]` | normal | `#CCC` |

---

### 🏢 Accounts (`/accounts`)

| Element | Font Size | Weight | Colour |
|---|---|---|---|
| Page heading (H2) | `text-xl` (20px) | `font-black` | `#080808` |
| Subtitle | `text-xs` | normal | `#888` |
| "Add Account" button | `text-xs` | `font-semibold` | `white` on `#080808` |
| Search input | `text-xs` | normal | `#080808` / placeholder `#CCC` |
| Status filter (active) | `text-[11px]` | `font-semibold` | `white` on `#080808` |
| Status filter (inactive) | `text-[11px]` | `font-semibold` | `#888` → `#080808` on hover |
| Table column header | `text-[10px]` | `font-bold uppercase tracking-widest` | `#BBB` |
| Account name | `text-[13px]` | `font-bold` | `#080808` |
| Open tasks badge | `text-[9px]` | `font-semibold` | `#888` on `#F5F5F5` |
| Website text | `text-[10px]` | normal | `#CCC` |
| Industry column | `text-xs` | normal | `#888` |
| Service tag | `text-[9px]` | `font-medium` | `#888` on `#F5F5F5` |
| Status: Active | `text-[10px]` | `font-semibold` | `white` on `#080808` |
| Status: Onboarding | `text-[10px]` | `font-semibold` | `#080808` on `#F5F5F5` border `#E0E0E0` |
| Status: Paused | `text-[10px]` | `font-semibold` | `#AAA` on `#F5F5F5` |
| Status: Churned | `text-[10px]` | `font-semibold` | `white` on `#B20F00` |
| GMV badge | `text-[11px]` | `font-semibold` | `#080808` on `#F5F5F5` |
| Manager name | `text-xs` | normal | `#888` |
| Retention days | `text-xs` | `font-medium` | `#AAA` |
| **Detail panel** heading | `text-base` (16px) | `font-black` | `#080808` |
| Quick stat value | `text-lg` (18px) | `font-black` | `#080808` / `#B20F00` (overdue) |
| Quick stat label | `text-[10px]` | `font-semibold uppercase` | `#888` |
| Section heading | `text-xs` | `font-bold uppercase tracking-widest` | `#080808` |
| Detail row label | `text-[10px]` | `font-semibold uppercase tracking-wider` | `#AAA` |
| Detail row value | `text-xs` | `font-medium` | `#080808` |
| POC name | `text-sm` | `font-semibold` | `#080808` |
| POC email/phone | `text-xs` | normal | `#888` |
| Manager badge | `text-[9px]` | `font-bold uppercase` | `#080808` on `#E8E8E8` |
| Member designation | `text-[10px]` | normal | `#CCC` |
| Task title in detail | `text-xs` | `font-semibold` | `#080808` |
| Due date (overdue) | `text-[10px]` | `font-medium` | `#B20F00` |
| Churn section heading | `text-xs` | `font-bold uppercase tracking-widest` | `#B20F00` |
| Churn reason | `text-sm` | normal | `#080808` |
| Notes textarea | `text-sm` | normal | `#080808` / placeholder `#CCC` |

---

### 📚 Knowledge Base (`/kb`)

> KB uses a **different neutral colour palette** (`neutral-*` Tailwind classes) instead of hardcoded hex values.

| Tailwind neutral | Equivalent | Usage |
|---|---|---|
| `neutral-50` | ~`#FAFAFA` | Sidebar bg, section header bg |
| `neutral-100` | ~`#F5F5F5` | Tag backgrounds, table header |
| `neutral-200` | ~`#E5E5E5` | Borders (sidebar, cards, tables) |
| `neutral-300` | ~`#D4D4D4` | Checkbox borders |
| `neutral-400` | ~`#A3A3A3` | Icons, muted text, breadcrumb separators |
| `neutral-500` | ~`#737373` | Secondary text, section labels, filter chip text |
| `neutral-600` | ~`#525252` | Nav link text, article body text, table cells |
| `neutral-700` | ~`#404040` | Section titles, list items, paragraph text |
| `neutral-800` | ~`#262626` | Topic name, sidebar header text |
| `neutral-900` | ~`#171717` | Article title, active nav, headings, filter toggle active |

**Accent colour used in KB:**
- `#B20F00` — search input focus ring, checkbox colour, inline `<code>` text colour, blockquote left border

| Element | Font Size | Weight | Colour |
|---|---|---|---|
| Sidebar "Content Map" button | `text-xs` | `font-medium` | `neutral-500` → `neutral-800` hover |
| Sidebar topic name | `text-sm` | `font-semibold` | `neutral-800` |
| Sidebar section label | `text-[10px]` | `font-semibold uppercase tracking-wider` | `neutral-400` |
| Sidebar nav link (active) | `text-xs` | `font-medium` | `neutral-900` on `white` with border |
| Sidebar nav link (inactive) | `text-xs` | normal | `neutral-600` → `neutral-900` hover |
| Sidebar sub-section link | `text-[11px]` | normal | `neutral-500` → `neutral-800` hover |
| Content Map heading (H1) | `text-xl` (20px) | `font-bold` | `neutral-900` |
| "posts" count label | `text-xs` | normal | `neutral-400` |
| Filter button (active) | `text-xs` | normal | `white` on `neutral-900` |
| Filter button (inactive) | `text-xs` | normal | `neutral-600` on `white` |
| Tag filter chip (active) | `text-[10px]` | normal | `white` on `neutral-900` |
| Tag filter chip (inactive) | `text-[10px]` | normal | `neutral-500` on `neutral-100` |
| "Clear filter" chip | `text-xs` | normal | `neutral-600` on `neutral-200` |
| Topic card heading (H2) | `text-sm` | `font-bold` | Dynamic — topic's own colour |
| Section title in card | `text-xs` | `font-semibold` | `neutral-700` |
| Section post count | `text-[10px]` | normal | `neutral-400` |
| Post title in card | `text-xs` | normal | `neutral-600` → `neutral-900` hover |
| **Article** breadcrumb | `text-xs` | normal | `neutral-400` |
| Article topic name in breadcrumb | `text-xs` | `font-medium` | Dynamic (topic colour) |
| Article section in breadcrumb | `text-xs` | normal | `neutral-500` |
| Article main title (H1) | `text-2xl` (24px) | `font-bold` | `neutral-900` |
| Article meta (date, author) | `text-xs` | normal | `neutral-400` |
| Article tag chips | `text-[10px]` | normal | `neutral-500` on `neutral-100` |
| **Markdown H1** | `text-xl` (20px) | `font-bold` | `neutral-900` |
| **Markdown H2** | `text-base` (16px) | `font-semibold` | `neutral-900` |
| **Markdown H3** | `text-sm` (14px) | `font-semibold` | `neutral-800` |
| **Markdown paragraph** | `text-sm` (14px) | normal | `neutral-700` |
| **Markdown list item** | `text-sm` (14px) | normal | `neutral-700` |
| **Markdown blockquote** | `text-sm` (14px) | italic | `neutral-600` on `red-50/40` bg, `#B20F00` left border |
| **Markdown `<code>`** | `text-xs` (12px) | normal (monospace) | `#B20F00` on `neutral-100` |
| **Markdown `<strong>`** | inherits | `font-semibold` | `neutral-900` |
| Table header | `text-xs` | `font-semibold` | `neutral-600` on `neutral-50` |
| Table cell | `text-xs` | normal | `neutral-700` |

---

## 🧩 Shared Layout — Sidebar

| Element | Font Size | Weight | Colour |
|---|---|---|---|
| Logo "Hovers" | `text-xl` (20px) | `font-black tracking-tighter` | `#080808` |
| Logo "." | `text-xl` (20px) | `font-black tracking-tighter` | `#B20F00` |
| Nav item (active) | `text-[13px]` | `font-semibold` | `white` on `#080808` |
| Nav item (inactive) | `text-[13px]` | `font-semibold` | `#888` → `#080808` on hover, bg `#F5F5F5` |
| User full name | `text-[13px]` | `font-semibold` | `#080808` |
| User designation | `text-[10px]` | normal | `#BBB` |
| Sign out icon button | — | — | `#CCC` → `#080808` hover |
| Sidebar background | — | — | `white` |
| Sidebar border | — | — | `#E8E8E8` |

---

## 🗂 Summary: Design System at a Glance

```
FONT
  Family:  -apple-system / BlinkMacSystemFont / Segoe UI / Roboto / sans-serif
  Sizes:   7px · 8px · 9px · 10px · 11px · 12px(xs) · 13px · 14px(sm) · 16px(base) · 18px(lg) · 20px(xl) · 24px(2xl)
  Weights: medium(500) · semibold(600) · bold(700) · black(900)

COLOURS — Brand pages (Home/Tasks/Accounts)
  Backgrounds  →  #FFFFFF · #FAFAFA · #F5F5F5
  Borders      →  #E8E8E8 · #E0E0E0 · #EEEEEE
  Text         →  #080808 · #444444 · #888888 · #BBBBBB · #CCCCCC · #AAAAAA
  Accent       →  #B20F00 (red) + translucent tints at 5/10/15/20%
  Online       →  #10B981 (green dot)
  Overlay      →  black/20

COLOURS — Knowledge Base
  Uses Tailwind neutral-50 through neutral-900 (grey scale)
  Accent       →  #B20F00 (focus rings, blockquote, code text)
```
