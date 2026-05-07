import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { STATUS_COLUMNS } from './MockData';

const StoreContext = createContext();

// ── Normalizers (snake_case → camelCase) ─────────────────────────────────────
const normalizeMember = (p) => ({
  id:       p.id,
  name:     p.name,
  email:    p.email,
  role:     p.role,
  avatar:   p.avatar || `https://i.pravatar.cc/150?u=${p.email}`,
  status:   p.status   || 'Available',
  bio:      p.bio      || '',
  phone:    p.phone    || '',
  title:    p.title    || '',
  location: p.location || '',
});

const normalizeComment = (c) => ({
  id:           c.id,
  authorId:     c.author_id,
  authorName:   c.author_name,
  authorAvatar: c.author_avatar,
  text:         c.text,
  timestamp:    c.created_at,
});

const normalizeTask = (t) => ({
  id:           t.id,
  listId:       t.list_id,
  title:        t.title,
  description:  t.description || '',
  status:       t.status,
  priority:     t.priority,
  type:         t.type,
  assignees:    t.assignees    || [],
  assignedBy:   t.assigned_by,
  dueDate:      t.due_date,
  tags:         t.tags         || [],
  timeEstimate: t.time_estimate || 0,
  timeTracked:  t.time_tracked  || 0,
  attachments:  t.attachments   || [],
  comments:     (t.comments     || []).map(normalizeComment),
});

const normalizeSpace = (s) => ({
  id:          s.id,
  name:        s.name,
  color:       s.color,
  icon:        s.icon,
  description: s.description || '',
  website:     s.website     || '',
  industry:    s.industry    || '',
});

const normalizeList = (l) => ({ id: l.id, spaceId: l.space_id, name: l.name });

const normalizeBrandAssignment = (b) => ({
  id:         b.id,
  profileId:  b.profile_id,
  spaceId:    b.space_id,
  taskType:   b.task_type,
  assignedBy: b.assigned_by,
});

// ── Store to Supabase shape helpers ──────────────────────────────────────────
const toDbTask = (task) => ({
  id:            task.id,
  list_id:       task.listId,
  title:         task.title,
  description:   task.description  || '',
  status:        task.status       || 'To Do',
  priority:      task.priority     || 'Normal',
  type:          task.type         || 'Other',
  assignees:     task.assignees    || [],
  assigned_by:   task.assignedBy   || null,
  due_date:      task.dueDate      || null,
  tags:          task.tags         || [],
  time_estimate: task.timeEstimate || 0,
  time_tracked:  task.timeTracked  || 0,
  attachments:   task.attachments  || [],
});

// ── Provider ──────────────────────────────────────────────────────────────────
export function StoreProvider({ children }) {
  const [state, setState] = useState({
    members:          [],
    spaces:           [],
    lists:            [],
    tasks:            [],
    brandAssignments: [],
    statuses:         STATUS_COLUMNS,
    loading:          true,
  });

  // ── Load all data ──────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    // Purge Done tasks older than 4 days before loading
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 4);
    await supabase
      .from('tasks')
      .delete()
      .eq('status', 'Done')
      .lt('updated_at', cutoff.toISOString());

    const [
      { data: members },
      { data: spaces  },
      { data: lists   },
      { data: tasks   },
      { data: bas     },
    ] = await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('spaces').select('*'),
      supabase.from('lists').select('*'),
      supabase.from('tasks').select('*, comments(*)').order('created_at'),
      supabase.from('brand_assignments').select('*'),
    ]);

    setState(s => ({
      ...s,
      members:          (members || []).map(normalizeMember),
      spaces:           (spaces  || []).map(normalizeSpace),
      lists:            (lists   || []).map(normalizeList),
      tasks:            (tasks   || []).map(normalizeTask),
      brandAssignments: (bas     || []).map(normalizeBrandAssignment),
      loading:          false,
    }));
  }, []);

  const fetchTasks = useCallback(async () => {
    const { data } = await supabase.from('tasks').select('*, comments(*)').order('created_at');
    setState(s => ({ ...s, tasks: (data || []).map(normalizeTask) }));
  }, []);

  const fetchBrandAssignments = useCallback(async () => {
    const { data } = await supabase.from('brand_assignments').select('*');
    setState(s => ({ ...s, brandAssignments: (data || []).map(normalizeBrandAssignment) }));
  }, []);

  useEffect(() => {
    let channel = null;

    const setupRealtime = () => {
      if (channel) return;
      channel = supabase
        .channel('realtime-hovers')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks'             }, fetchTasks)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'comments'          }, fetchTasks)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'brand_assignments' }, fetchBrandAssignments)
        .subscribe();
    };

    // Wait for Supabase to restore the session before fetching (fixes RLS empty-state bug)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) { fetchAll(); setupRealtime(); }
      else setState(s => ({ ...s, loading: false }));
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') { fetchAll(); setupRealtime(); }
      if (event === 'SIGNED_OUT') {
        setState({ members: [], spaces: [], lists: [], tasks: [], brandAssignments: [], statuses: STATUS_COLUMNS, loading: false });
        if (channel) { supabase.removeChannel(channel); channel = null; }
      }
    });

    return () => {
      if (channel) supabase.removeChannel(channel);
      subscription.unsubscribe();
    };
  }, [fetchAll, fetchTasks, fetchBrandAssignments]);

  // ── Mutations ─────────────────────────────────────────────────────────────
  const updateTaskStatus = async (taskId, newStatus) => {
    setState(s => ({
      ...s,
      tasks: s.tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t),
    }));
    await supabase.from('tasks').update({ status: newStatus }).eq('id', taskId);
  };

  const updateTask = async (taskUpdates) => {
    setState(s => ({
      ...s,
      tasks: s.tasks.map(t => t.id === taskUpdates.id ? { ...t, ...taskUpdates } : t),
    }));
    const { id, comments: _comments, brand: _brand, ...rest } = taskUpdates;
    const dbUpdates = {};
    if (rest.title       !== undefined) dbUpdates.title        = rest.title;
    if (rest.description !== undefined) dbUpdates.description  = rest.description;
    if (rest.status      !== undefined) dbUpdates.status       = rest.status;
    if (rest.priority    !== undefined) dbUpdates.priority     = rest.priority;
    if (rest.type        !== undefined) dbUpdates.type         = rest.type;
    if (rest.assignees   !== undefined) dbUpdates.assignees    = rest.assignees;
    if (rest.dueDate     !== undefined) dbUpdates.due_date     = rest.dueDate;
    if (rest.attachments !== undefined) dbUpdates.attachments  = rest.attachments;
    await supabase.from('tasks').update(dbUpdates).eq('id', id);
  };

  // dispatch shim — keeps all existing call sites working unchanged
  const dispatch = (action) => {
    switch (action.type) {

      case 'ADD_TASK': {
        const task = action.payload;
        setState(s => ({ ...s, tasks: [...s.tasks, task] }));
        supabase.from('tasks').insert(toDbTask(task)).then(({ error }) => {
          if (error) console.error('ADD_TASK:', error.message);
        });
        break;
      }

      case 'UPDATE_TASK':
        updateTask(action.payload);
        break;

      case 'UPDATE_TASK_STATUS':
        updateTaskStatus(action.taskId, action.newStatus);
        break;

      case 'ADD_COMMENT': {
        const { taskId, comment } = action;
        setState(s => ({
          ...s,
          tasks: s.tasks.map(t =>
            t.id === taskId ? { ...t, comments: [...(t.comments || []), comment] } : t
          ),
        }));
        supabase.from('comments').insert({
          id:            comment.id,
          task_id:       taskId,
          author_id:     comment.authorId,
          author_name:   comment.authorName,
          author_avatar: comment.authorAvatar,
          text:          comment.text,
          created_at:    comment.timestamp,
        }).then(({ error }) => {
          if (error) console.error('ADD_COMMENT:', error.message);
        });
        break;
      }

      case 'ADD_MEMBER': {
        const m = action.payload;
        setState(s => ({ ...s, members: [...s.members, m] }));
        supabase.from('profiles').insert({
          id:     m.id,
          name:   m.name,
          email:  m.email,
          role:   m.role,
          avatar: m.avatar,
          status: m.status || 'Available',
        }).then(({ error }) => {
          if (error) console.error('ADD_MEMBER:', error.message);
        });
        break;
      }

      case 'ADD_MEMBER_LOCAL': {
        setState(s => ({ ...s, members: [...s.members, action.payload] }));
        break;
      }

      case 'UPDATE_MEMBER_ROLE': {
        const { memberId, role } = action.payload;
        setState(s => ({ ...s, members: s.members.map(m => m.id === memberId ? { ...m, role } : m) }));
        supabase.from('profiles').update({ role }).eq('id', memberId)
          .then(({ error }) => { if (error) console.error('UPDATE_MEMBER_ROLE:', error.message); });
        break;
      }

      case 'UPDATE_PROFILE': {
        const { profileId, updates } = action.payload;
        setState(s => ({ ...s, members: s.members.map(m => m.id === profileId ? { ...m, ...updates } : m) }));
        supabase.from('profiles').update(updates).eq('id', profileId)
          .then(({ error }) => { if (error) console.error('UPDATE_PROFILE:', error.message); });
        break;
      }

      case 'DELETE_MEMBER': {
        const { memberId } = action.payload;
        setState(s => ({ ...s, members: s.members.filter(m => m.id !== memberId) }));
        supabase.from('profiles').delete().eq('id', memberId)
          .then(({ error }) => { if (error) console.error('DELETE_MEMBER:', error.message); });
        break;
      }

      case 'ADD_SPACE': {
        const sp = action.payload;
        setState(s => ({ ...s, spaces: [...s.spaces, sp] }));
        supabase.from('spaces').insert({
          id:          sp.id,
          name:        sp.name,
          color:       sp.color,
          icon:        sp.icon,
          description: sp.description || '',
          website:     sp.website     || '',
          industry:    sp.industry    || '',
        }).then(({ error }) => { if (error) console.error('ADD_SPACE:', error.message); });
        break;
      }

      case 'UPDATE_SPACE': {
        const { spaceId, updates } = action.payload;
        setState(s => ({ ...s, spaces: s.spaces.map(sp => sp.id === spaceId ? { ...sp, ...updates } : sp) }));
        supabase.from('spaces').update(updates).eq('id', spaceId)
          .then(({ error }) => { if (error) console.error('UPDATE_SPACE:', error.message); });
        break;
      }

      case 'DELETE_SPACE': {
        const { spaceId } = action.payload;
        setState(s => ({
          ...s,
          spaces:           s.spaces.filter(sp => sp.id !== spaceId),
          lists:            s.lists.filter(l => l.spaceId !== spaceId),
          brandAssignments: s.brandAssignments.filter(b => b.spaceId !== spaceId),
        }));
        supabase.from('spaces').delete().eq('id', spaceId)
          .then(({ error }) => { if (error) console.error('DELETE_SPACE:', error.message); });
        break;
      }

      case 'ADD_LIST': {
        const li = action.payload;
        setState(s => ({ ...s, lists: [...s.lists, li] }));
        supabase.from('lists').insert({ id: li.id, space_id: li.spaceId, name: li.name })
          .then(({ error }) => { if (error) console.error('ADD_LIST:', error.message); });
        break;
      }

      case 'DELETE_LIST': {
        const { listId } = action.payload;
        setState(s => ({ ...s, lists: s.lists.filter(l => l.id !== listId) }));
        supabase.from('lists').delete().eq('id', listId)
          .then(({ error }) => { if (error) console.error('DELETE_LIST:', error.message); });
        break;
      }

      case 'ASSIGN_BRAND': {
        const { profileId, spaceId, taskType, assignedBy } = action.payload;
        const tempId = `tmp_${crypto.randomUUID()}`;
        const local = { id: tempId, profileId, spaceId, taskType: taskType || null, assignedBy };
        setState(s => ({ ...s, brandAssignments: [...s.brandAssignments, local] }));
        supabase.from('brand_assignments').insert({
          profile_id:  profileId,
          space_id:    spaceId,
          task_type:   taskType || null,
          assigned_by: assignedBy || null,
        }).select().single().then(({ data, error }) => {
          if (error) {
            console.error('ASSIGN_BRAND:', error.message);
            setState(s => ({ ...s, brandAssignments: s.brandAssignments.filter(b => b.id !== tempId) }));
            return;
          }
          setState(s => ({
            ...s,
            brandAssignments: s.brandAssignments.map(b => b.id === tempId ? normalizeBrandAssignment(data) : b),
          }));
        });
        break;
      }

      case 'UNASSIGN_BRAND': {
        const { id } = action.payload;
        setState(s => ({ ...s, brandAssignments: s.brandAssignments.filter(b => b.id !== id) }));
        supabase.from('brand_assignments').delete().eq('id', id)
          .then(({ error }) => { if (error) console.error('UNASSIGN_BRAND:', error.message); });
        break;
      }

      default:
        console.warn('Unknown dispatch action:', action.type);
    }
  };

  return (
    <StoreContext.Provider value={{ state, dispatch, updateTaskStatus, updateTask, fetchAll }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
