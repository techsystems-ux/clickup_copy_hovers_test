import React from 'react';
import { useStore } from '../../store/StoreContext';
import { useUI } from '../../store/UIContext';
import { Clock, AlertTriangle, Flag, CheckCircle2 } from 'lucide-react';

const PRIORITY_MAP = {
  Urgent: { label: 'P1', color: '#b20f00', bg: 'rgba(178,15,0,0.12)' },
  High:   { label: 'P2', color: '#ff9800', bg: 'rgba(255,152,0,0.12)' },
  Normal: { label: 'P3', color: '#2196f3', bg: 'rgba(33,150,243,0.12)' },
  Low:    { label: 'P4', color: '#888',    bg: 'rgba(136,136,136,0.10)' },
};

const STATUS_COLORS = {
  'To Do':       '#888',
  'In Progress': '#2196f3',
  'Review':      '#ff9800',
  'Blocked':     '#b20f00',
  'Done':        '#4caf50',
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

// ─── Designer / Executor Home ───────────────────────────────────────────────
function DesignerHome({ currentUser, state }) {
  const myTasks = state.tasks.filter(t => t.assignees?.includes(currentUser.id));

  const tasksWithBrand = myTasks.map(t => {
    const list = state.lists.find(l => l.id === t.listId);
    const space = list ? state.spaces.find(s => s.id === list.spaceId) : null;
    return { ...t, brand: space };
  });

  const sorted = [...tasksWithBrand].sort((a, b) => {
    const order = { Urgent: 0, High: 1, Normal: 2, Low: 3 };
    const pd = (order[a.priority] ?? 3) - (order[b.priority] ?? 3);
    if (pd !== 0) return pd;
    if (a.dueDate && b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate);
    return 0;
  });

  const assignerIds = [...new Set(myTasks.map(t => t.assignedBy).filter(Boolean))];
  const assigners = assignerIds.map(id => state.members.find(m => m.id === id)).filter(Boolean);

  const total   = myTasks.length;
  const done    = myTasks.filter(t => t.status === 'Done').length;
  const overdue = myTasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Done').length;
  const urgent  = myTasks.filter(t => t.priority === 'Urgent' && t.status !== 'Done').length;

  return (
    <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px', letterSpacing: '-0.5px' }}>
          {getGreeting()}, {currentUser.name.split(' ')[0]}
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
          {new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })} · {total - done} task{total - done !== 1 ? 's' : ''} remaining
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', alignItems: 'start' }}>

        {/* LEFT — Task list */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--color-text-muted)' }}>My Tasks</h2>
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{total} total · {done} done</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {sorted.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--color-text-muted)', fontSize: '14px', backgroundColor: 'var(--color-surface)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                No tasks assigned yet. Enjoy the quiet! 🎉
              </div>
            ) : sorted.map(task => {
              const p = PRIORITY_MAP[task.priority] || PRIORITY_MAP.Normal;
              const due = task.dueDate ? new Date(task.dueDate) : null;
              const isOverdue = due && due < new Date() && task.status !== 'Done';
              const isDone = task.status === 'Done';
              const progress = task.timeEstimate > 0 ? Math.min(100, (task.timeTracked / task.timeEstimate) * 100) : null;

              return (
                <div key={task.id} style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderLeft: `3px solid ${p.color}`,
                  borderRadius: '10px',
                  padding: '16px',
                  opacity: isDone ? 0.55 : 1,
                  transition: 'opacity 0.2s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
                    <div style={{ minWidth: 0 }}>
                      {task.brand && (
                        <span style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--color-text-muted)', display: 'block', marginBottom: '3px' }}>
                          {task.brand.icon} {task.brand.name}
                        </span>
                      )}
                      <span style={{ fontSize: '14px', fontWeight: '600', textDecoration: isDone ? 'line-through' : 'none', color: isDone ? 'var(--color-text-muted)' : 'var(--color-text)', display: 'block' }}>
                        {task.title}
                      </span>
                    </div>
                    <span style={{ flexShrink: 0, fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '99px', color: p.color, backgroundColor: p.bg, border: `1px solid ${p.color}33` }}>
                      {p.label} · {task.priority}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: progress !== null ? '12px' : '0' }}>
                    <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '99px', backgroundColor: `${STATUS_COLORS[task.status]}18`, color: STATUS_COLORS[task.status], border: `1px solid ${STATUS_COLORS[task.status]}33`, fontWeight: '700' }}>
                      {task.status}
                    </span>
                    {due && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: isOverdue ? '#b20f00' : 'var(--color-text-muted)' }}>
                        {isOverdue ? <AlertTriangle size={11} /> : <Clock size={11} />}
                        {due.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        {isOverdue && <strong style={{ fontSize: '10px', letterSpacing: '0.4px' }}> OVERDUE</strong>}
                      </span>
                    )}
                  </div>

                  {progress !== null && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '5px' }}>
                        <span>Time tracked</span>
                        <span>{Math.round(task.timeTracked / 60)}h / {Math.round(task.timeEstimate / 60)}h</span>
                      </div>
                      <div style={{ height: '4px', borderRadius: '99px', backgroundColor: 'var(--color-surface-2)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${progress}%`, backgroundColor: progress >= 100 ? '#4caf50' : '#2196f3', borderRadius: '99px', transition: 'width 0.4s' }} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT — Stats + Assigners */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '24px' }}>

          {/* Quick Stats */}
          <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.7px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>Quick Stats</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { label: 'Total',   value: total,   color: '#111111' },
                { label: 'Done',    value: done,    color: '#4caf50' },
                { label: 'Overdue', value: overdue, color: '#b20f00' },
                { label: 'Urgent',  value: urgent,  color: '#ff9800' },
              ].map(stat => (
                <div key={stat.label} style={{ textAlign: 'center', padding: '14px 10px', backgroundColor: 'var(--color-bg)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '26px', fontWeight: '800', color: stat.color, lineHeight: '1', marginBottom: '4px' }}>{stat.value}</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: '600' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Task Assigners */}
          {assigners.length > 0 && (
            <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px' }}>
              <h3 style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.7px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>Task Assigners</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {assigners.map(assigner => {
                  const count = myTasks.filter(t => t.assignedBy === assigner.id).length;
                  return (
                    <div key={assigner.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={assigner.avatar} alt={assigner.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '1px solid var(--color-border)' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{assigner.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{assigner.role}</div>
                      </div>
                      <span style={{ flexShrink: 0, fontSize: '11px', fontWeight: '700', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-surface-2)', padding: '2px 8px', borderRadius: '99px', border: '1px solid var(--color-border)' }}>
                        {count} task{count !== 1 ? 's' : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Manager / Admin Home ────────────────────────────────────────────────────
function ManagerHome({ currentUser, state }) {
  const allTasks = state.tasks;
  const total   = allTasks.length;
  const done    = allTasks.filter(t => t.status === 'Done').length;
  const overdue = allTasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Done').length;
  const urgent  = allTasks.filter(t => t.priority === 'Urgent' && t.status !== 'Done').length;

  const byStatus = ['To Do', 'In Progress', 'Review', 'Blocked', 'Done'].map(s => ({
    status: s,
    count: allTasks.filter(t => t.status === s).length,
  }));

  const executors = state.members.filter(m => m.role === 'Executive' || m.role === 'Creative Associate');

  return (
    <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px', letterSpacing: '-0.5px' }}>
          {getGreeting()}, {currentUser.name.split(' ')[0]}
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
          {new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })} · {overdue > 0 ? `${overdue} task${overdue > 1 ? 's' : ''} overdue` : 'All tasks on track'}
        </p>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '28px' }}>
        {[
          { label: 'Total Tasks', value: total,   color: '#111111' },
          { label: 'Completed',   value: done,    color: '#4caf50' },
          { label: 'Overdue',     value: overdue, color: '#b20f00' },
          { label: 'P1 Urgent',   value: urgent,  color: '#ff9800' },
        ].map(stat => (
          <div key={stat.label} style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: '800', color: stat.color, lineHeight: '1', marginBottom: '6px' }}>{stat.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: '600' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        {/* Team workload */}
        <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.7px', color: 'var(--color-text-muted)', marginBottom: '18px' }}>Team Workload</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {executors.map(member => {
              const mt = allTasks.filter(t => t.assignees?.includes(member.id));
              const md = mt.filter(t => t.status === 'Done').length;
              const pct = mt.length > 0 ? Math.round((md / mt.length) * 100) : 100;
              return (
                <div key={member.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '7px' }}>
                    <img src={member.avatar} alt={member.name} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--color-border)' }} />
                    <span style={{ fontSize: '13px', fontWeight: '600', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.name}</span>
                    <span style={{ flexShrink: 0, fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: '600' }}>{mt.length} tasks · {pct}%</span>
                  </div>
                  <div style={{ height: '4px', borderRadius: '99px', backgroundColor: 'var(--color-surface-2)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, backgroundColor: '#4caf50', borderRadius: '99px', transition: 'width 0.4s' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status breakdown */}
        <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.7px', color: 'var(--color-text-muted)', marginBottom: '18px' }}>Status Breakdown</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {byStatus.map(({ status, count }) => {
              const color = STATUS_COLORS[status] || '#888';
              const pct = total > 0 ? (count / total) * 100 : 0;
              return (
                <div key={status}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '5px' }}>
                    <span style={{ color, fontWeight: '700' }}>{status}</span>
                    <span style={{ color: 'var(--color-text-muted)', fontWeight: '600' }}>{count}</span>
                  </div>
                  <div style={{ height: '4px', borderRadius: '99px', backgroundColor: 'var(--color-surface-2)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, backgroundColor: color, borderRadius: '99px', transition: 'width 0.4s' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Root export ─────────────────────────────────────────────────────────────
export default function HomeView() {
  const { state } = useStore();
  const { currentUser } = useUI();

  if (!currentUser) return null;

  const isManager = currentUser.role === 'Admin' || currentUser.role === 'Team Lead';
  return isManager
    ? <ManagerHome currentUser={currentUser} state={state} />
    : <DesignerHome currentUser={currentUser} state={state} />;
}
