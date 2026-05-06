import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { STATUS_COLUMNS } from './MockData';

const StoreContext = createContext();

// ── Normalizers (snake_case → camelCase) ─────────────────────────────────────
const normalizeMember = (p) => ({
  id:     p.id,
  name:   p.name,
  email:  p.email,
  role:   p.role,
  avatar: p.avatar || `https://i.pravatar.cc/150?u=${p.email}`,
  status: p.status || 'Available',
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

const normalizeSpace = (s) => ({ id: s.id, name: s.name, color: s.color, icon: s.icon });
const normalizeList  = (l) => ({ id: l.id, spaceId: l.space_id, name: l.name });

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
    members:  [],
    spaces:   [],
    lists:    [],
    tasks:    [],
    statuses: STATUS_COLUMNS,
    loading:  true,
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
    ] = await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('spaces').select('*'),
      supabase.from('lists').select('*'),
      supabase.from('tasks').select('*, comments(*)').order('created_at'),
    ]);

    setState(s => ({
      ...s,
      members:  (members || []).map(normalizeMember),
      spaces:   (spaces  || []).map(normalizeSpace),
      lists:    (lists   || []).map(normalizeList),
      tasks:    (tasks   || []).map(normalizeTask),
      loading:  false,
    }));
  }, []);

  const fetchTasks = useCallback(async () => {
    const { data } = await supabase.from('tasks').select('*, comments(*)').order('created_at');
    setState(s => ({ ...s, tasks: (data || []).map(normalizeTask) }));
  }, []);

  useEffect(() => {
    fetchAll();

    // Real-time: re-fetch tasks whenever tasks or comments change
    const channel = supabase
      .channel('realtime-hovers')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks'    }, fetchTasks)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, fetchTasks)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchAll, fetchTasks]);

  // ── Mutations ─────────────────────────────────────────────────────────────
  const updateTaskStatus = async (taskId, newStatus) => {
    // Optimistic
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
    const { id, comments, brand, ...rest } = taskUpdates; // strip computed/nested fields
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
        // Optimistic
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
        // Optimistic
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

      default:
        console.warn('Unknown dispatch action:', action.type);
    }
  };

  return (
    <StoreContext.Provider value={{ state, dispatch, updateTaskStatus, updateTask }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
