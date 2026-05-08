import React, { useState } from 'react';
import { useStore } from '../../store/StoreContext';
import { useUI } from '../../store/UIContext';
import {
  ArrowLeft, CheckCircle2, MessageSquare,
  Send, ChevronRight, ChevronDown, Clock, AlertTriangle, Tag,
  Layers, Flag, Link,
  Film, Image, PenLine, Target, FileText, HelpCircle
} from 'lucide-react';
import './ExecutorDashboard.css';

const TYPE_ICONS = {
  Static: Image, Video: Film, Design: PenLine,
  Copy: FileText, Strategy: Target, Other: HelpCircle,
};

// ─────────────────────────────────────────────
// Priority config
// ─────────────────────────────────────────────
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

function PriorityBadge({ priority }) {
  const cfg = PRIORITY_MAP[priority] || PRIORITY_MAP.Normal;
  return (
    <span
      className="priority-badge"
      style={{ color: cfg.color, backgroundColor: cfg.bg, border: `1px solid ${cfg.color}33` }}
    >
      <Flag size={10} />
      {cfg.label} · {priority}
    </span>
  );
}

// ─────────────────────────────────────────────
// Comment Thread per task
// ─────────────────────────────────────────────
function CommentThread({ task, currentUser, onAddComment }) {
  const [text, setText] = useState('');
  const comments = task.comments || [];

  const handleSend = () => {
    if (!text.trim()) return;
    onAddComment(task.id, {
      id: `c_${crypto.randomUUID()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      text: text.trim(),
      timestamp: new Date().toISOString(),
    });
    setText('');
  };

  return (
    <div className="comment-thread">
      <div className="comment-thread-title">
        <MessageSquare size={14} />
        Comments {comments.length > 0 && <span className="comment-count">{comments.length}</span>}
      </div>

      {comments.length === 0 && (
        <div className="no-comments">No comments yet. If you're stuck, leave a note for the manager.</div>
      )}

      <div className="comments-list">
        {comments.map(c => {
          const isMe = c.authorId === currentUser.id;
          return (
            <div key={c.id} className={`comment-bubble ${isMe ? 'mine' : 'theirs'}`}>
              <img src={c.authorAvatar || `https://i.pravatar.cc/40?u=${c.authorId}`} alt={c.authorName} className="comment-avatar" />
              <div className="comment-body">
                <div className="comment-meta">
                  <span className="comment-author">{c.authorName}</span>
                  <span className="comment-time">
                    {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {' · '}
                    {new Date(c.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <div className="comment-text">{c.text}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="comment-input-row">
        <img
          src={currentUser.avatar || `https://i.pravatar.cc/40?u=${currentUser.id}`}
          alt="me"
          className="comment-avatar small"
        />
        <div className="comment-input-wrap">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Leave a comment or describe where you're stuck…"
            rows={2}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          />
          <button className="send-btn" onClick={handleSend} disabled={!text.trim()}>
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Status Picker — 3-option dropdown
// ─────────────────────────────────────────────
const STATUS_OPTIONS = [
  { value: 'To Do',       label: 'To Do',       color: '#888888' },
  { value: 'In Progress', label: 'In Progress',  color: '#2196f3' },
  { value: 'Done',        label: 'Completed',    color: '#4caf50' },
];

function StatusPicker({ currentStatus, taskId, onStatusChange }) {
  const [open, setOpen] = useState(false);
  const current = STATUS_OPTIONS.find(o => o.value === currentStatus) || STATUS_OPTIONS[0];

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={() => setOpen(p => !p)}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '5px 10px', borderRadius: '7px', cursor: 'pointer',
          border: `1px solid ${current.color}44`,
          backgroundColor: `${current.color}12`,
          color: current.color, fontSize: '12px', fontWeight: '700',
          transition: 'all 0.15s',
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
            borderRadius: '10px', boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
            overflow: 'hidden', minWidth: '148px',
          }}>
            {STATUS_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => { onStatusChange(taskId, opt.value); setOpen(false); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 14px', background: opt.value === currentStatus ? `${opt.color}12` : 'transparent',
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                  color: opt.value === currentStatus ? opt.color : 'var(--color-text)',
                  fontSize: '13px', fontWeight: opt.value === currentStatus ? '700' : '500',
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

// ─────────────────────────────────────────────
// Task Card (inside a brand)
// ─────────────────────────────────────────────
function TaskCard({ task, currentUser, onMarkDone, onAddComment }) {
  const [expanded, setExpanded] = useState(false);
  const isDone = task.status === 'Done';

  const dueDateObj = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDateObj && dueDateObj < new Date() && !isDone;

  return (
    <div className={`exec-task-card ${isDone ? 'is-done' : ''} ${isOverdue ? 'is-overdue' : ''}`}>
      <div className="task-card-top">
        {/* Status picker */}
        <StatusPicker currentStatus={task.status} taskId={task.id} onStatusChange={onMarkDone} />

        <div className="task-card-info" onClick={() => setExpanded(p => !p)}>
          <div className="task-card-title-row">
            <span className={`task-title ${isDone ? 'done-text' : ''}`}>{task.title}</span>
            <PriorityBadge priority={task.priority} />
            {task.type && (() => { const TIcon = TYPE_ICONS[task.type] || HelpCircle; return (
              <span className="tag-chip"><TIcon size={10} />{task.type}</span>
            ); })()}
          </div>

          <div className="task-card-meta">
            {/* Due date */}
            {dueDateObj && (
              <span className={`due-chip ${isOverdue ? 'overdue' : ''}`}>
                {isOverdue ? <AlertTriangle size={12} /> : <Clock size={12} />}
                {dueDateObj.toLocaleDateString([], { month: 'short', day: 'numeric' })}
              </span>
            )}

            {/* Tags */}
            {task.tags?.map(tag => (
              <span key={tag} className="tag-chip"><Tag size={10} />{tag}</span>
            ))}

            {/* Comment count hint */}
            {(task.comments?.length > 0) && (
              <span className="comment-hint"><MessageSquare size={12}/>{task.comments.length}</span>
            )}
          </div>
        </div>

        <button className={`expand-btn ${expanded ? 'open' : ''}`} onClick={() => setExpanded(p => !p)}>
          <ChevronRight size={16} />
        </button>
      </div>

      {expanded && (
        <div className="task-card-expanded">
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}

          {/* Time tracking */}
          {task.timeEstimate > 0 && (
            <div className="time-bar-wrap">
              <div className="time-bar-labels">
                <span>Time Tracked</span>
                <span>{Math.round(task.timeTracked / 60)}h / {Math.round(task.timeEstimate / 60)}h</span>
              </div>
              <div className="time-bar">
                <div
                  className="time-bar-fill"
                  style={{ width: `${Math.min(100, (task.timeTracked / task.timeEstimate) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Attachments / References */}
          {task.attachments?.length > 0 && (
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>References</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {task.attachments.map(att => (
                  <a
                    key={att.id}
                    href={att.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '7px', textDecoration: 'none', color: 'var(--color-text)', fontSize: '13px' }}
                  >
                    {att.type === 'image'
                      ? <Image size={13} style={{ flexShrink: 0, color: '#7b1fa2' }} />
                      : <Link  size={13} style={{ flexShrink: 0, color: '#1565c0' }} />
                    }
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{att.name}</span>
                    {att.type === 'image' && (
                      <img src={att.url} alt="" style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0, border: '1px solid var(--color-border)' }} onError={e => { e.target.style.display = 'none'; }} />
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}

          <CommentThread
            task={task}
            currentUser={currentUser}
            onAddComment={onAddComment}
          />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Brand / Space view — task list inside a brand
// ─────────────────────────────────────────────
function BrandTaskView({ space, tasks, currentUser, onBack, onMarkDone, onAddComment }) {
  const [filter, setFilter] = useState('all'); // all | active | done

  const sortedTasks = [...tasks].sort((a, b) => {
    const order = { Urgent: 0, High: 1, Normal: 2, Low: 3 };
    return (order[a.priority] ?? 3) - (order[b.priority] ?? 3);
  });

  const filteredTasks = sortedTasks.filter(t => {
    if (filter === 'active') return t.status !== 'Done';
    if (filter === 'done') return t.status === 'Done';
    return true;
  });

  const doneCount = tasks.filter(t => t.status === 'Done').length;
  const progressPct = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;

  return (
    <div className="brand-task-view">
      <div className="brand-task-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={18} /> All Brands
        </button>
        <div className="brand-task-title">
          <span className="brand-icon-lg">{space.icon}</span>
          <div>
            <h2>{space.name}</h2>
            <p className="brand-subtitle">{tasks.length} task{tasks.length !== 1 ? 's' : ''} assigned · {doneCount} done</p>
          </div>
        </div>

        {/* Mini progress bar */}
        <div className="brand-progress-wrap">
          <div className="brand-progress-bar">
            <div className="brand-progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="brand-progress-label">{progressPct}% complete</span>
        </div>
      </div>

      {/* Filter pills */}
      <div className="filter-pills">
        {['all', 'active', 'done'].map(f => (
          <button key={f} className={`filter-pill ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All Tasks' : f === 'active' ? 'Active' : 'Completed'}
          </button>
        ))}
      </div>

      {filteredTasks.length === 0 ? (
        <div className="empty-state">
          <CheckCircle2 size={48} className="empty-icon" />
          <p>{filter === 'done' ? 'No completed tasks yet.' : 'No active tasks. Great work!'}</p>
        </div>
      ) : (
        <div className="task-list">
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              currentUser={currentUser}
              onMarkDone={onMarkDone}
              onAddComment={onAddComment}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Brand Card (grid view)
// ─────────────────────────────────────────────
function BrandCard({ space, tasks, onClick }) {
  const done = tasks.filter(t => t.status === 'Done').length;
  const urgent = tasks.filter(t => t.priority === 'Urgent' && t.status !== 'Done').length;
  const pct = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 100;

  return (
    <div className="brand-card" onClick={onClick} style={{ '--brand-color': space.color || '#b20f00' }}>
      <div className="brand-card-header">
        <div className="brand-card-icon">{space.icon}</div>
        {urgent > 0 && (
          <span className="urgent-dot" title={`${urgent} urgent task${urgent > 1 ? 's' : ''}`}>
            {urgent}
          </span>
        )}
      </div>

      <div className="brand-card-body">
        <h3 className="brand-card-name">{space.name}</h3>
        <p className="brand-card-count">
          {tasks.length > 0
            ? `${tasks.length} task${tasks.length > 1 ? 's' : ''} · ${done} done`
            : 'No tasks assigned'}
        </p>
      </div>

      <div className="brand-card-footer">
        <div className="brand-card-progress-bar">
          <div className="brand-card-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="brand-card-progress-labels">
          <span>{pct}%</span>
          <span className="see-tasks">See tasks <ChevronRight size={12} /></span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Executor Dashboard
// ─────────────────────────────────────────────
export default function ExecutorDashboard() {
  const { state, dispatch } = useStore();
  const { currentUser, setSelectedTaskId } = useUI();
  const [activeBrandId, setActiveBrandId] = useState(null);

  const myTasks = state.tasks.filter(t => t.assignees?.includes(currentUser?.id));
  // Tasks the current user assigned to OTHERS — for Executive who can assign to Creative Associates.
  const tasksIAssigned = state.tasks.filter(t =>
    t.assignedBy === currentUser?.id && !(t.assignees || []).includes(currentUser?.id)
  );

  // Group my tasks by space
  const tasksBySpace = state.spaces.map(space => {
    const spaceLists = state.lists.filter(l => l.spaceId === space.id).map(l => l.id);
    const spaceTasks = myTasks.filter(t => spaceLists.includes(t.listId));
    return { space, tasks: spaceTasks };
  }).filter(entry => entry.tasks.length > 0); // only show brands with tasks

  // KPIs
  const total = myTasks.length;
  const done = myTasks.filter(t => t.status === 'Done').length;
  const overdue = myTasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Done').length;
  const urgent = myTasks.filter(t => t.priority === 'Urgent' && t.status !== 'Done').length;

  const handleMarkDone = (taskId, newStatus) => {
    dispatch({ type: 'UPDATE_TASK_STATUS', taskId, newStatus });
  };

  const handleAddComment = (taskId, comment) => {
    dispatch({ type: 'ADD_COMMENT', taskId, comment });
  };

  const activeBrandEntry = tasksBySpace.find(e => e.space.id === activeBrandId);

  // ── Drill-down: brand task view ──
  if (activeBrandId && activeBrandEntry) {
    return (
      <BrandTaskView
        space={activeBrandEntry.space}
        tasks={activeBrandEntry.tasks}
        currentUser={currentUser}
        onBack={() => setActiveBrandId(null)}
        onMarkDone={handleMarkDone}
        onAddComment={handleAddComment}
      />
    );
  }

  // ── Main grid ──
  return (
    <div className="executor-dashboard custom-scrollbar">
      {/* Header */}
      <div className="exec-dash-header">
        <div>
          <h2 className="exec-dash-title">My Tasks</h2>
          <p className="exec-dash-sub">{currentUser?.name?.split(' ')[0]} · {state.tasks.filter(t => t.assignees?.includes(currentUser?.id) && t.status !== 'Done').length} open</p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="exec-kpi-row">
        <div className="exec-kpi-card">
          <Layers size={20} className="kpi-ic" style={{ color: '#2196f3' }} />
          <div>
            <div className="exec-kpi-val">{total}</div>
            <div className="exec-kpi-lbl">Total Tasks</div>
          </div>
        </div>
        <div className="exec-kpi-card">
          <CheckCircle2 size={20} className="kpi-ic" style={{ color: '#4caf50' }} />
          <div>
            <div className="exec-kpi-val">{done}</div>
            <div className="exec-kpi-lbl">Completed</div>
          </div>
        </div>
        <div className="exec-kpi-card">
          <Flag size={20} className="kpi-ic" style={{ color: '#b20f00' }} />
          <div>
            <div className="exec-kpi-val">{urgent}</div>
            <div className="exec-kpi-lbl">P1 Urgent</div>
          </div>
        </div>
        <div className="exec-kpi-card">
          <AlertTriangle size={20} className="kpi-ic" style={{ color: '#ff9800' }} />
          <div>
            <div className="exec-kpi-val">{overdue}</div>
            <div className="exec-kpi-lbl">Overdue</div>
          </div>
        </div>
      </div>

      {/* Brands section */}
      <div className="exec-brands-header">
        <h3>Your Brands</h3>
        <p className="exec-dash-sub">Click a brand to view your assigned tasks.</p>
      </div>

      {tasksBySpace.length === 0 && myTasks.length === 0 && tasksIAssigned.length === 0 ? (
        <div className="empty-state" style={{ marginTop: '60px' }}>
          <CheckCircle2 size={56} className="empty-icon" />
          <p>You have no tasks assigned. Enjoy the peace! 🎉</p>
        </div>
      ) : (
        <>
          {tasksBySpace.length > 0 && (
            <div className="brands-grid">
              {tasksBySpace.map(({ space, tasks }) => (
                <BrandCard
                  key={space.id}
                  space={space}
                  tasks={tasks}
                  onClick={() => setActiveBrandId(space.id)}
                />
              ))}
            </div>
          )}

          {/* Flat task list — always visible so tasks are always openable */}
          {myTasks.length > 0 && (
            <div style={{ marginTop: '32px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                All Tasks ({myTasks.length})
              </h3>
              <div className="task-list">
                {[...myTasks]
                  .sort((a, b) => {
                    const order = { Urgent: 0, High: 1, Normal: 2, Low: 3 };
                    return (order[a.priority] ?? 3) - (order[b.priority] ?? 3);
                  })
                  .map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      currentUser={currentUser}
                      onMarkDone={handleMarkDone}
                      onAddComment={handleAddComment}
                    />
                  ))}
              </div>
            </div>
          )}

          {/* Tasks I've assigned — for Executives who delegate work to Creative Associates */}
          {tasksIAssigned.length > 0 && (
            <div style={{ marginTop: '32px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Tasks I've Assigned ({tasksIAssigned.length})
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                Track progress, change details, or reply to comments. Click a task to open it.
              </p>
              <div className="task-list">
                {[...tasksIAssigned]
                  .sort((a, b) => {
                    const order = { Urgent: 0, High: 1, Normal: 2, Low: 3 };
                    return (order[a.priority] ?? 3) - (order[b.priority] ?? 3);
                  })
                  .map(task => {
                    const isDone = task.status === 'Done';
                    const dueDateObj = task.dueDate ? new Date(task.dueDate) : null;
                    const isOverdue = dueDateObj && dueDateObj < new Date() && !isDone;
                    const assignedTo = (task.assignees || [])
                      .map(id => state.members.find(m => m.id === id))
                      .filter(Boolean);
                    const commentCount = (task.comments || []).length;

                    return (
                      <div
                        key={task.id}
                        onClick={() => setSelectedTaskId(task.id)}
                        className={`exec-task-card ${isDone ? 'is-done' : ''} ${isOverdue ? 'is-overdue' : ''}`}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="task-card-top">
                          <StatusPicker
                            currentStatus={task.status}
                            taskId={task.id}
                            onStatusChange={handleMarkDone}
                          />
                          <div className="task-card-info" onClick={e => e.stopPropagation()} style={{ cursor: 'default' }}>
                            <div className="task-card-title-row" onClick={() => setSelectedTaskId(task.id)} style={{ cursor: 'pointer' }}>
                              <span className={`task-title ${isDone ? 'done-text' : ''}`}>{task.title}</span>
                              <PriorityBadge priority={task.priority} />
                              {task.type && (() => { const TIcon = TYPE_ICONS[task.type] || HelpCircle; return (
                                <span className="tag-chip"><TIcon size={10} />{task.type}</span>
                              ); })()}
                            </div>
                            <div className="task-card-meta">
                              {assignedTo.length > 0 && (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                                  Assigned to:
                                  {assignedTo.map(m => (
                                    <span key={m.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                      <img src={m.avatar} alt={m.name} style={{ width: '18px', height: '18px', borderRadius: '50%' }} />
                                      <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{m.name}</span>
                                    </span>
                                  ))}
                                </span>
                              )}
                              {dueDateObj && (
                                <span className={`due-chip ${isOverdue ? 'overdue' : ''}`}>
                                  {isOverdue ? <AlertTriangle size={12} /> : <Clock size={12} />}
                                  {dueDateObj.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                </span>
                              )}
                              {commentCount > 0 && (
                                <span className="comment-hint">
                                  <MessageSquare size={12}/>{commentCount}
                                </span>
                              )}
                            </div>
                          </div>
                          <ChevronRight size={16} style={{ color: 'var(--color-text-muted)' }} />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
