import React, { useState } from 'react';
import { useStore } from '../../store/StoreContext';
import { useUI } from '../../store/UIContext';
import {
  ArrowLeft, CheckCircle2, Circle, ChevronRight, ChevronDown,
  Clock, AlertTriangle, Flag, MessageSquare,
  Film, Image, PenLine, Code, FileText, HelpCircle, Plus
} from 'lucide-react';
import './ManagerTeamView.css';

const STATUS_OPTIONS = [
  { value: 'To Do',       label: 'To Do',       color: '#888888' },
  { value: 'In Progress', label: 'In Progress', color: '#2196f3' },
  { value: 'Done',        label: 'Completed',   color: '#4caf50' },
];

function StatusPicker({ currentStatus, taskId, onStatusChange }) {
  const [open, setOpen] = useState(false);
  const current = STATUS_OPTIONS.find(o => o.value === currentStatus) || STATUS_OPTIONS[0];
  return (
    <div style={{ position: 'relative', flexShrink: 0 }} onClick={e => e.stopPropagation()}>
      <button
        onClick={() => setOpen(p => !p)}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '5px 10px', borderRadius: '7px', cursor: 'pointer',
          border: `1px solid ${current.color}44`,
          backgroundColor: `${current.color}12`,
          color: current.color, fontSize: '12px', fontWeight: 700,
        }}
      >
        <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: current.color, flexShrink: 0 }} />
        {current.label}
        <ChevronDown size={12} />
      </button>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setOpen(false)} />
          <div style={{
            position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 100,
            backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
            borderRadius: '10px', boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
            overflow: 'hidden', minWidth: '160px',
          }}>
            {STATUS_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => { onStatusChange(taskId, opt.value); setOpen(false); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 14px',
                  background: opt.value === currentStatus ? `${opt.color}15` : 'transparent',
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                  color: opt.value === currentStatus ? opt.color : 'var(--color-text)',
                  fontSize: '13px', fontWeight: opt.value === currentStatus ? 700 : 500,
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: opt.color, flexShrink: 0 }} />
                {opt.label}
                {opt.value === currentStatus && <CheckCircle2 size={13} style={{ marginLeft: 'auto', opacity: 0.7 }} />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Priority config ────────────────────────────────
const PRIORITY_MAP = {
  Urgent: { label: 'P1', color: '#B20F00', bg: 'rgba(178,15,0,0.08)' },
  High:   { label: 'P2', color: '#080808', bg: 'rgba(8,8,8,0.06)' },
  Normal: { label: 'P3', color: '#888888', bg: 'rgba(136,136,136,0.10)' },
  Low:    { label: 'P4', color: '#BBBBBB', bg: 'rgba(187,187,187,0.10)' },
};

const STATUS_COLORS = {
  'To Do':       '#888',
  'In Progress': '#2196f3',
  'Review':      '#ff9800',
  'Blocked':     '#b20f00',
  'Done':        '#4caf50',
};

const TYPE_ICONS = {
  Static: Image, Video: Film, Design: PenLine,
  Copy: FileText, Development: Code, Other: HelpCircle,
};

// ─── Priority badge ──────────────────────────────────
function PriBadge({ priority }) {
  const cfg = PRIORITY_MAP[priority] || PRIORITY_MAP.Normal;
  return (
    <span className="mtv-pri-badge" style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}33` }}>
      <Flag size={10} />{cfg.label} · {priority}
    </span>
  );
}

// ─── Type badge ──────────────────────────────────────
function TypeBadge({ type }) {
  if (!type) return null;
  const Icon = TYPE_ICONS[type] || HelpCircle;
  return (
    <span className="mtv-type-badge">
      <Icon size={10} />{type}
    </span>
  );
}

// ─── Task Row (manager drill-down) ───────────────────
function TaskRow({ task, onClick }) {
  const isDone = task.status === 'Done';
  const dueDateObj = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDateObj && dueDateObj < new Date() && !isDone;
  const hasUnreadComment = (task.comments || []).length > 0;

  return (
    <div className={`mtv-task-row ${isDone ? 'is-done' : ''} ${isOverdue ? 'is-overdue' : ''}`} onClick={onClick}>
      <div className="mtv-task-left">
        <div className="mtv-task-icon-wrap">
          {isDone
            ? <CheckCircle2 size={18} style={{ color: 'var(--color-success)' }} />
            : <Circle size={18} style={{ color: 'var(--color-text-muted)' }} />
          }
        </div>
        <div className="mtv-task-info">
          <div className="mtv-task-title-row">
            <span className={`mtv-task-title ${isDone ? 'done-text' : ''}`}>{task.title}</span>
            <PriBadge priority={task.priority} />
            <TypeBadge type={task.type} />
          </div>
          <div className="mtv-task-meta">
            <span className="mtv-status-chip" style={{ color: STATUS_COLORS[task.status], background: `${STATUS_COLORS[task.status]}18` }}>
              {task.status}
            </span>
            {dueDateObj && (
              <span className={`mtv-due-chip ${isOverdue ? 'overdue' : ''}`}>
                {isOverdue ? <AlertTriangle size={11} /> : <Clock size={11} />}
                {dueDateObj.toLocaleDateString([], { month: 'short', day: 'numeric' })}
              </span>
            )}
            {hasUnreadComment && (
              <span className="mtv-comment-chip">
                <MessageSquare size={11} />{task.comments.length}
              </span>
            )}
          </div>
        </div>
      </div>
      <ChevronRight size={15} className="mtv-row-arrow" />
    </div>
  );
}

// ─── Member Task Drill-down ──────────────────────────
function MemberTaskView({ member, tasks, onBack }) {
  const { setSelectedTaskId, setNewTaskModalOpen, setPreSelectedAssigneeId } = useUI();
  const [filter, setFilter] = useState('all');

  const sorted = [...tasks].sort((a, b) => {
    const order = { Urgent: 0, High: 1, Normal: 2, Low: 3 };
    return (order[a.priority] ?? 3) - (order[b.priority] ?? 3);
  });

  const filtered = sorted.filter(t => {
    if (filter === 'active') return t.status !== 'Done';
    if (filter === 'done')   return t.status === 'Done';
    return true;
  });

  const doneCount = tasks.filter(t => t.status === 'Done').length;
  const pct = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;

  const handleAssignTask = () => {
    setPreSelectedAssigneeId(member.id);
    setNewTaskModalOpen(true);
  };

  return (
    <div className="mtv-member-view">
      {/* Header */}
      <div className="mtv-member-header">
        <button className="mtv-back-btn" onClick={onBack}>
          <ArrowLeft size={16} /> All Members
        </button>

        <div className="mtv-member-title">
          <img src={member.avatar} alt={member.name} className="mtv-member-avatar-lg" />
          <div>
            <h2>{member.name}</h2>
            <p className="mtv-member-sub">{tasks.length} task{tasks.length !== 1 ? 's' : ''} assigned · {doneCount} done</p>
          </div>
        </div>

        <div className="mtv-progress-wrap">
          <div className="mtv-progress-bar">
            <div className="mtv-progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="mtv-progress-label">{pct}% complete</span>
        </div>

        <button className="mtv-assign-btn" onClick={handleAssignTask}>
          <Plus size={15} /> Assign Task
        </button>
      </div>

      {/* Filters */}
      <div className="mtv-filter-pills">
        {[['all', 'All Tasks'], ['active', 'Active'], ['done', 'Completed']].map(([key, label]) => (
          <button key={key} className={`mtv-pill ${filter === key ? 'active' : ''}`} onClick={() => setFilter(key)}>
            {label}
          </button>
        ))}
      </div>

      {/* Task list */}
      {filtered.length === 0 ? (
        <div className="mtv-empty">
          <CheckCircle2 size={44} style={{ opacity: 0.25 }} />
          <p>{filter === 'done' ? 'No completed tasks yet.' : 'No active tasks for this member.'}</p>
        </div>
      ) : (
        <div className="mtv-task-list">
          {filtered.map(task => (
            <TaskRow
              key={task.id}
              task={task}
              onClick={() => setSelectedTaskId(task.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Member Card (grid) ──────────────────────────────
function MemberCard({ member, tasks, onClick }) {
  const done    = tasks.filter(t => t.status === 'Done').length;
  const p1      = tasks.filter(t => t.priority === 'Urgent' && t.status !== 'Done').length;
  const blocked = tasks.filter(t => t.status === 'Blocked').length;
  const pct     = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 100;

  // Does any task have comments? (executor may be stuck)
  const needsAttention = tasks.some(t => (t.comments || []).length > 0 && t.status !== 'Done');

  return (
    <div className="mtv-member-card" onClick={onClick}>
      {needsAttention && <span className="mtv-attn-dot" title="Has comments — check in">!</span>}

      <div className="mtv-card-top">
        <img src={member.avatar} alt={member.name} className="mtv-card-avatar" />
        <div className="mtv-card-name-wrap">
          <span className="mtv-card-name">{member.name}</span>
          <span className="mtv-card-role">{member.role}</span>
        </div>
      </div>

      <div className="mtv-card-stats">
        <div className="mtv-stat">
          <span className="mtv-stat-val">{tasks.length}</span>
          <span className="mtv-stat-lbl">Tasks</span>
        </div>
        <div className="mtv-stat">
          <span className="mtv-stat-val" style={{ color: '#4caf50' }}>{done}</span>
          <span className="mtv-stat-lbl">Done</span>
        </div>
        {p1 > 0 && (
          <div className="mtv-stat">
            <span className="mtv-stat-val" style={{ color: '#b20f00' }}>{p1}</span>
            <span className="mtv-stat-lbl">P1</span>
          </div>
        )}
        {blocked > 0 && (
          <div className="mtv-stat">
            <span className="mtv-stat-val" style={{ color: '#ff9800' }}>{blocked}</span>
            <span className="mtv-stat-lbl">Blocked</span>
          </div>
        )}
      </div>

      <div className="mtv-card-footer">
        <div className="mtv-card-bar"><div className="mtv-card-bar-fill" style={{ width: `${pct}%` }} /></div>
        <div className="mtv-card-bar-labels">
          <span>{pct}%</span>
          <span className="mtv-see-tasks">View tasks <ChevronRight size={11} /></span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Manager Team View ──────────────────────────
export default function ManagerTeamView() {
  const { state, dispatch } = useStore();
  const { setNewTaskModalOpen, setSelectedTaskId, currentUser } = useUI();
  const [activeMemberId, setActiveMemberId] = useState(null);

  // Tasks assigned directly to the current user (e.g. Admin assigned a task to a Team Lead)
  const myTasks = state.tasks.filter(t => (t.assignees || []).includes(currentUser?.id));

  const handleMyStatusChange = (taskId, newStatus) => {
    dispatch({ type: 'UPDATE_TASK_STATUS', taskId, newStatus });
  };

  // Show all team members the current user can supervise.
  // Team Lead supervises Executives + Creative Associates; Admin sees everyone except themselves.
  const executors = state.members.filter(m => {
    if (m.id === currentUser?.id) return false;
    if (currentUser?.role === 'Admin')     return m.role !== 'Admin';
    if (currentUser?.role === 'Team Lead') return m.role === 'Executive' || m.role === 'Creative Associate';
    return false;
  });

  const getTasksForMember = (memberId) =>
    state.tasks.filter(t => (t.assignees || []).includes(memberId));

  const activeMember    = executors.find(m => m.id === activeMemberId);
  const activeMemberTasks = activeMemberId ? getTasksForMember(activeMemberId) : [];

  // KPIs across all executor tasks
  const allExecTasks = state.tasks.filter(t =>
    (t.assignees || []).some(id => executors.map(m => m.id).includes(id))
  );
  const totalTasks   = allExecTasks.length;
  const doneTasks    = allExecTasks.filter(t => t.status === 'Done').length;
  const p1Tasks      = allExecTasks.filter(t => t.priority === 'Urgent' && t.status !== 'Done').length;
  const blockedTasks = allExecTasks.filter(t => t.status === 'Blocked').length;

  // Drill-down view
  if (activeMemberId && activeMember) {
    return (
      <MemberTaskView
        member={activeMember}
        tasks={activeMemberTasks}
        onBack={() => setActiveMemberId(null)}
      />
    );
  }

  // Main grid
  return (
    <div className="mtv-dashboard">
      {/* Page header */}
      <div className="mtv-dash-header">
        <div>
          <h2 className="mtv-dash-title">Team</h2>
          <p className="mtv-dash-sub">{executors.length} member{executors.length !== 1 ? 's' : ''} · {totalTasks} open task{totalTasks !== 1 ? 's' : ''}{p1Tasks > 0 ? ` · ${p1Tasks} urgent` : ''}</p>
        </div>
        <button className="mtv-assign-btn" onClick={() => setNewTaskModalOpen(true)}>
          <Plus size={14} /> New Task
        </button>
      </div>

      {/* KPI row */}
      <div className="mtv-kpi-row">
        {[
          { label: 'Total Tasks',  val: totalTasks,   color: '#2196f3' },
          { label: 'Completed',    val: doneTasks,    color: '#4caf50' },
          { label: 'P1 Urgent',    val: p1Tasks,      color: '#b20f00' },
          { label: 'Blocked',      val: blockedTasks, color: '#ff9800' },
        ].map(({ label, val, color }) => (
          <div key={label} className="mtv-kpi-card">
            <span className="mtv-kpi-val" style={{ color }}>{val}</span>
            <span className="mtv-kpi-lbl">{label}</span>
          </div>
        ))}
      </div>

      {/* My Tasks — for Team Leads who have tasks assigned directly to them */}
      {myTasks.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <div className="mtv-section-label">My Tasks ({myTasks.length})</div>
          <div className="mtv-task-list">
            {[...myTasks]
              .sort((a, b) => {
                const order = { Urgent: 0, High: 1, Normal: 2, Low: 3 };
                return (order[a.priority] ?? 3) - (order[b.priority] ?? 3);
              })
              .map(task => {
                const isDone = task.status === 'Done';
                const dueDateObj = task.dueDate ? new Date(task.dueDate) : null;
                const isOverdue = dueDateObj && dueDateObj < new Date() && !isDone;
                return (
                  <div
                    key={task.id}
                    className={`mtv-task-row ${isDone ? 'is-done' : ''} ${isOverdue ? 'is-overdue' : ''}`}
                    onClick={() => setSelectedTaskId(task.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="mtv-task-left">
                      <StatusPicker
                        currentStatus={task.status}
                        taskId={task.id}
                        onStatusChange={handleMyStatusChange}
                      />
                      <div className="mtv-task-info">
                        <div className="mtv-task-title-row">
                          <span className={`mtv-task-title ${isDone ? 'done-text' : ''}`}>{task.title}</span>
                          <PriBadge priority={task.priority} />
                          <TypeBadge type={task.type} />
                        </div>
                        <div className="mtv-task-meta">
                          {dueDateObj && (
                            <span className={`mtv-due-chip ${isOverdue ? 'overdue' : ''}`}>
                              {isOverdue ? <AlertTriangle size={11} /> : <Clock size={11} />}
                              {dueDateObj.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </span>
                          )}
                          {(task.comments?.length > 0) && (
                            <span className="mtv-comment-chip">
                              <MessageSquare size={11} />{task.comments.length}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={15} className="mtv-row-arrow" />
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Team grid */}
      <div className="mtv-section-label">Team Members</div>
      <div className="mtv-members-grid">
        {executors.map(member => (
          <MemberCard
            key={member.id}
            member={member}
            tasks={getTasksForMember(member.id)}
            onClick={() => setActiveMemberId(member.id)}
          />
        ))}
      </div>
    </div>
  );
}
