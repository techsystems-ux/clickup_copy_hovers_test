/**
 * Hovers Agency — Supabase Seed Script
 *
 * Run once after applying schema.sql:
 *   SUPABASE_URL=https://xxx.supabase.co SUPABASE_SERVICE_ROLE_KEY=xxx node supabase/seed.js
 *
 * Requires Node 18+ (uses native fetch).
 * Uses the SERVICE ROLE key (keep secret, never commit).
 */

import { createClient } from '@supabase/supabase-js';
import { addDays, subDays } from 'date-fns';

const SUPABASE_URL             = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── Users to seed ─────────────────────────────────────────────────────────────
const USERS = [
  { legacyId: 'u1', name: 'Alice Smith',   email: 'alice@hoversagency.com',   password: 'admin123',   role: 'Admin',            avatar: 'https://i.pravatar.cc/150?u=1', status: 'Available'      },
  { legacyId: 'u2', name: 'Bob Jones',     email: 'bob@hoversagency.com',     password: 'exec123',    role: 'Executive',         avatar: 'https://i.pravatar.cc/150?u=2', status: 'Busy'           },
  { legacyId: 'u3', name: 'Charlie Davis', email: 'charlie@hoversagency.com', password: 'design123',  role: 'Graphic Designer',  avatar: 'https://i.pravatar.cc/150?u=3', status: 'Do Not Disturb' },
  { legacyId: 'u4', name: 'Diana Prince',  email: 'diana@hoversagency.com',   password: 'diana123',   role: 'Executive',         avatar: 'https://i.pravatar.cc/150?u=4', status: 'Available'      },
  { legacyId: 'u5', name: 'Evan Wright',   email: 'evan@hoversagency.com',    password: 'evan123',    role: 'Graphic Designer',  avatar: 'https://i.pravatar.cc/150?u=5', status: 'Away'           },
  { legacyId: 'u6', name: 'James Park',    email: 'james@hoversagency.com',   password: 'manager123', role: 'Manager',           avatar: 'https://i.pravatar.cc/150?u=6', status: 'Available'      },
];

// ── Helper: create or get existing auth user ──────────────────────────────────
async function upsertUser(user) {
  // Check if already exists
  const { data: list } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  const existing = list?.users?.find(u => u.email === user.email);

  if (existing) {
    console.log(`  ↩  ${user.email} already exists (${existing.id})`);
    return existing.id;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: user.email,
    password: user.password,
    email_confirm: true,
  });
  if (error) throw new Error(`Failed to create ${user.email}: ${error.message}`);
  console.log(`  ✓  Created ${user.email} (${data.user.id})`);
  return data.user.id;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n── Creating auth users & profiles ──');
  const idMap = {}; // legacyId → Supabase UUID

  for (const user of USERS) {
    const uuid = await upsertUser(user);
    idMap[user.legacyId] = uuid;

    await supabase.from('profiles').upsert({
      id:     uuid,
      name:   user.name,
      email:  user.email,
      role:   user.role,
      avatar: user.avatar,
      status: user.status,
    }, { onConflict: 'id' });
  }

  console.log('\n── Seeding tasks ──');
  const today = new Date();

  const TASKS = [
    {
      id: 't1', list_id: 'l1',
      title: 'Create Homepage Banner Static',
      description: 'Design a 1200x628px static banner for the homepage hero section. Use brand colors and the new tagline.',
      status: 'In Progress', priority: 'High', type: 'Static',
      assignees: [idMap['u2']], assigned_by: idMap['u6'],
      due_date: addDays(today, 2).toISOString(),
      tags: ['Design'], time_estimate: 240, time_tracked: 120,
      attachments: [],
    },
    {
      id: 't2', list_id: 'l1',
      title: 'Produce Product Launch Video',
      description: 'Create a 60-second product launch video highlighting the top 3 features. Include captions.',
      status: 'To Do', priority: 'Urgent', type: 'Video',
      assignees: [idMap['u3']], assigned_by: idMap['u6'],
      due_date: addDays(today, 1).toISOString(),
      tags: ['Content'], time_estimate: 480, time_tracked: 0,
      attachments: [],
    },
    {
      id: 't3', list_id: 'l1',
      title: 'Instagram Story Set (5 frames)',
      description: 'Design 5-frame Instagram story sequence for the new collection drop. Size: 1080x1920.',
      status: 'Review', priority: 'Normal', type: 'Static',
      assignees: [idMap['u3']], assigned_by: idMap['u1'],
      due_date: subDays(today, 1).toISOString(),
      tags: ['Social'], time_estimate: 180, time_tracked: 180,
      attachments: [],
    },
    {
      id: 't4', list_id: 'l2',
      title: 'Write Q3 Campaign Email Copy',
      description: 'Write subject line, preview text and body copy for the Q3 campaign email. 250 words max.',
      status: 'Done', priority: 'High', type: 'Copy',
      assignees: [idMap['u4']], assigned_by: idMap['u1'],
      due_date: subDays(today, 5).toISOString(),
      tags: ['Email'], time_estimate: 240, time_tracked: 240,
      attachments: [],
    },
    {
      id: 't5', list_id: 'l2',
      title: 'Facebook Ad Creative (Static)',
      description: 'Create 3 static ad variants (1200x628) for A/B testing. Follow the brief in the shared drive.',
      status: 'Blocked', priority: 'Urgent', type: 'Static',
      assignees: [idMap['u5']], assigned_by: idMap['u6'],
      due_date: today.toISOString(),
      tags: ['Ads'], time_estimate: 180, time_tracked: 60,
      attachments: [],
    },
    {
      id: 't6', list_id: 'l3',
      title: 'YouTube Thumbnail Batch (10 videos)',
      description: 'Create 10 YouTube thumbnails for the weekly content batch. Template is in the shared drive.',
      status: 'To Do', priority: 'Normal', type: 'Static',
      assignees: [idMap['u2']], assigned_by: idMap['u1'],
      due_date: addDays(today, 7).toISOString(),
      tags: ['YouTube'], time_estimate: 240, time_tracked: 0,
      attachments: [],
    },
    {
      id: 't7', list_id: 'l4',
      title: 'Edit Brand Reel Video',
      description: 'Edit a 30-second brand reel using the footage from last shoot. Add background music and captions.',
      status: 'In Progress', priority: 'High', type: 'Video',
      assignees: [idMap['u3']], assigned_by: idMap['u6'],
      due_date: addDays(today, 3).toISOString(),
      tags: ['Reel'], time_estimate: 360, time_tracked: 120,
      attachments: [],
    },
    {
      id: 't8', list_id: 'l4',
      title: 'Campaign Strategy Deck — Q4',
      description: 'Prepare the Q4 campaign strategy presentation covering target audiences, channels, budget split, and KPIs.',
      status: 'To Do', priority: 'High', type: 'Strategy',
      assignees: [idMap['u4']], assigned_by: idMap['u1'],
      due_date: addDays(today, 10).toISOString(),
      tags: ['Strategy'], time_estimate: 300, time_tracked: 0,
      attachments: [],
    },
  ];

  for (const task of TASKS) {
    const { error } = await supabase.from('tasks').upsert(task, { onConflict: 'id' });
    if (error) console.error(`  ✗  ${task.id}: ${error.message}`);
    else console.log(`  ✓  ${task.id}: ${task.title}`);
  }

  // Seed one sample comment
  console.log('\n── Seeding comments ──');
  const { error: ce } = await supabase.from('comments').upsert({
    id: 'c1t1',
    task_id: 't1',
    author_id: idMap['u6'],
    author_name: 'James Park',
    author_avatar: 'https://i.pravatar.cc/150?u=6',
    text: 'Make sure to use the updated brand colors from the style guide. Check the shared drive for the latest assets.',
    created_at: subDays(today, 1).toISOString(),
  }, { onConflict: 'id' });

  if (ce) console.error(`  ✗  c1t1: ${ce.message}`);
  else console.log('  ✓  c1t1');

  console.log('\n✅ Seed complete!\n');
  console.log('User credentials:');
  USERS.forEach(u => console.log(`  ${u.role.padEnd(16)} ${u.email.padEnd(32)} ${u.password}`));
  console.log('');
}

main().catch(e => { console.error(e); process.exit(1); });
