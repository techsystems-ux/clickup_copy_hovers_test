import React, { useState, useRef, useEffect } from 'react';
import { useUI } from '../../store/UIContext';
import { useStore } from '../../store/StoreContext';
import {
  X, Clock, Flag, Send, MessageSquare, Link,
  Film, Image, PenLine, Target, FileText, HelpCircle, CheckCircle2, ChevronDown
} from 'lucide-react';
import './SlideOver.css';

const STATUS_OPTIONS = [
  { value: 'To Do',       label: 'To Do',       color: '#888888' },
  { value: 'In Progress', label: 'In Progress', color: '#2196f3' },
  { value: 'Done',        label: 'Completed',   color: '#4caf50' },
];

function StatusPicker({ currentStatus, onChange }) {
  const [open, setOpen] = useState(false);
  const current = STATUS_OPTIONS.find(o => o.value === currentStatus) || STATUS_OPTIONS[0];

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(p => !p)}
        style={{
          display: 'flex', alignItems: 'center', gap: '7px',
          padding: '7px 14px', borderRadius: '8px', cursor: 'pointer',
          border: `1px solid ${current.color}55`,
          backgroundColor: `${current.color}15`,
          color: current.color, fontSize: '13px', fontWeight: 700,
        }}
      >
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: current.color, flexShrink: 0 }} />
        {current.label}
        <ChevronDown size={13} />
      </button>

      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setOpen(false)} />
          <div style={{
            position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 100,
            backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
            borderRadius: '10px', boxShadow: '0 6px 20px rgba(0,0,0,0.18)',
            overflow: 'hidden', minWidth: '160px',
          }}>
            {STATUS_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false); }}
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

const PRIORITY_MAP = {
  Urgent: { label: 'P1 · Urgent', color: '#b20f00', bg: 'rgba(178,15,0,0.12)' },
  High:   { label: 'P2 · High',   color: '#ff9800', bg: 'rgba(255,152,0,0.12)' },
  Normal: { label: 'P3 · Normal', color: '#2196f3', bg: 'rgba(33,150,243,0.12)' },
  Low:    { label: 'P4 · Low',    color: '#888',    bg: 'rgba(136,136,136,0.10)' },
};

const TYPE_ICONS = {
  Static: Image, Video: Film, Design: PenLine,
  Copy: FileText, Strategy: Target, Other: HelpCircle,
};

export default function SlideOver() {
  const { selectedTaskId, closeSlideOver, currentUser } = useUI();
  const { state, dispatch } = useStore();
  const [commentText, setCommentText] = useState('');
  const commentsEndRef = useRef(null);

  const task = state.tasks.find(t => t.id === selectedTaskId);

  // Scroll to bottom of comments when new one is added
  useEffect(() => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [task?.comments?.length]);

  const handleSendComment = () => {
    if (!commentText.trim() || !task) return;
    dispatch({
      type: 'ADD_COMMENT',
      taskId: task.id,
      comment: {
        id: `c_${crypto.randomUUID()}`,
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorAvatar: currentUser.avatar,
        text: commentText.trim(),
        timestamp: new Date().toISOString(),
      }
    });
    setCommentText('');
  };

  const handleStatusChange = (newStatus) => {
    if (!task) return;
    dispatch({ type: 'UPDATE_TASK_STATUS', taskId: task.id, newStatus });
  };

  if (!task) return <div className={`slide-over ${selectedTaskId ? 'open' : ''}`} />;

  const priority = PRIORITY_MAP[task.priority] || PRIORITY_MAP.Normal;
  const TypeIcon = TYPE_ICONS[task.type] || HelpCircle;
  const isDone = task.status === 'Done';
  const dueDateObj = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDateObj && dueDateObj < new Date() && !isDone;

  const assignedMembers = (task.assignees || []).map(id => state.members.find(m => m.id === id)).filter(Boolean);
  const comments = task.comments || [];

  return (
    <div className={`slide-over ${selectedTaskId ? 'open' : ''}`}>
      {/* Header */}
      <div className="slide-over-header">
        <span className="task-id">TASK · {task.id.toUpperCase()}</span>
        <div className="header-actions">
          <button className="icon-btn" onClick={closeSlideOver}><X size={18} /></button>
        </div>
      </div>

      <div className="slide-over-content custom-scrollbar">
        {/* Title */}
        <h2 className="task-title" style={{ textDecoration: isDone ? 'line-through' : 'none', opacity: isDone ? 0.6 : 1 }}>
          {task.title}
        </h2>

        {/* Meta block */}
        <div className="task-meta">
          <div className="meta-row">
            <span className="meta-label">Status</span>
            <StatusPicker currentStatus={task.status} onChange={handleStatusChange} />
          </div>
          <div className="meta-row">
            <span className="meta-label">Priority</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 700, padding: '3px 10px', borderRadius: '99px', color: priority.color, backgroundColor: priority.bg, border: `1px solid ${priority.color}33` }}>
              <Flag size={11} />{priority.label}
            </span>
          </div>
          {task.type && (
            <div className="meta-row">
              <span className="meta-label">Type</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', background: 'var(--color-surface-2)', padding: '3px 10px', borderRadius: '99px', border: '1px solid var(--color-border)' }}>
                <TypeIcon size={12} />{task.type}
              </span>
            </div>
          )}
          <div className="meta-row">
            <span className="meta-label">Assigned to</span>
            <div className="assignees-list">
              {assignedMembers.length > 0 ? assignedMembers.map(m => (
                <img key={m.id} src={m.avatar} alt={m.name} className="mini-avatar" title={m.name} />
              )) : <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Unassigned</span>}
            </div>
          </div>
          {dueDateObj && (
            <div className="meta-row">
              <span className="meta-label">Due Date</span>
              <span className="meta-value" style={{ color: isOverdue ? 'var(--color-accent)' : 'inherit' }}>
                <Clock size={13} />
                {dueDateObj.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                {isOverdue && <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-accent)', marginLeft: '4px' }}>OVERDUE</span>}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        {task.description && (
          <div className="task-description-section">
            <h3>Description</h3>
            <div className="rich-text-placeholder">
              <p>{task.description}</p>
            </div>
          </div>
        )}

        {/* Attachments */}
        {task.attachments?.length > 0 && (
          <div className="task-description-section">
            <h3 style={{ marginBottom: '10px' }}>References</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {task.attachments.map(att => (
                <a
                  key={att.id}
                  href={att.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '8px', textDecoration: 'none', color: 'var(--color-text)', transition: 'border-color 0.15s', fontSize: '13px' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#111111'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
                >
                  {att.type === 'image'
                    ? <Image size={14} style={{ flexShrink: 0, color: '#7b1fa2' }} />
                    : <Link  size={14} style={{ flexShrink: 0, color: '#1565c0' }} />
                  }
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{att.name}</span>
                  {att.type === 'image' && (
                    <img
                      src={att.url}
                      alt={att.name}
                      style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0, border: '1px solid var(--color-border)' }}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  )}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Comment Thread */}
        <div className="task-activity">
          <h3>
            <MessageSquare size={13} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
            Comments {comments.length > 0 && <span style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)', fontSize: '11px', padding: '1px 7px', borderRadius: '99px', marginLeft: '4px' }}>{comments.length}</span>}
          </h3>

          {comments.length === 0 ? (
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontStyle: 'italic', padding: '8px 0' }}>
              No comments yet. The executor will post here if they're stuck.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {comments.map(c => {
                const isMe = c.authorId === currentUser?.id;
                return (
                  <div key={c.id} style={{ display: 'flex', gap: '10px', flexDirection: isMe ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
                    <img src={c.authorAvatar || `https://i.pravatar.cc/40?u=${c.authorId}`} alt={c.authorName} style={{ width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0, objectFit: 'cover' }} />
                    <div style={{ maxWidth: '80%' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px', flexDirection: isMe ? 'row-reverse' : 'row' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700 }}>{c.authorName}</span>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                          {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {' · '}
                          {new Date(c.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', lineHeight: '1.5', padding: '8px 12px', borderRadius: '10px', background: isMe ? 'rgba(178,15,0,0.12)' : 'var(--color-surface-2)', border: '1px solid', borderColor: isMe ? 'rgba(178,15,0,0.25)' : 'var(--color-border)', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                        {c.text}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={commentsEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Comment input footer */}
      <div className="slide-over-footer">
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '10px', padding: '8px 12px', transition: 'border-color 0.2s' }}
          onFocus={e => e.currentTarget.style.borderColor = 'rgba(178,15,0,0.5)'}
          onBlur={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
        >
          <img src={currentUser?.avatar} alt="me" style={{ width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0, objectFit: 'cover' }} />
          <textarea
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendComment(); } }}
            placeholder="Reply to executor…"
            rows={2}
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', resize: 'none', fontSize: '13px', color: 'var(--color-text)', lineHeight: '1.5' }}
          />
          <button
            onClick={handleSendComment}
            disabled={!commentText.trim()}
            style={{ flexShrink: 0, background: 'var(--color-accent)', color: 'white', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: commentText.trim() ? 'pointer' : 'not-allowed', opacity: commentText.trim() ? 1 : 0.35, transition: 'opacity 0.2s' }}
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
