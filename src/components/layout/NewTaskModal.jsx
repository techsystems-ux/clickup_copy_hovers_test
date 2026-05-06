import React, { useState } from 'react';
import { X, Flag, Film, Image, PenLine, Target, FileText, HelpCircle, Link, Plus, Trash2 } from 'lucide-react';
import { useStore } from '../../store/StoreContext';
import { useUI } from '../../store/UIContext';
import { TASK_TYPES } from '../../store/MockData';

const TYPE_ICONS = {
  Static: Image, Video: Film, Design: PenLine,
  Copy: FileText, Strategy: Target, Other: HelpCircle,
};

const PRIORITY_COLORS = {
  Urgent: '#b20f00', High: '#ff9800', Normal: '#2196f3', Low: '#888888',
};

export default function NewTaskModal() {
  const { state, dispatch } = useStore();
  const { setNewTaskModalOpen, activeSpaceId, activeListId, preSelectedAssigneeId, setPreSelectedAssigneeId, currentUser } = useUI();

  const [title,       setTitle]       = useState('');
  const [description, setDescription] = useState('');
  const [assignees,   setAssignees]   = useState(() =>
    preSelectedAssigneeId ? [preSelectedAssigneeId] : []
  );
  const [priority,  setPriority]  = useState('Normal');
  const [taskType,  setTaskType]  = useState('Static');
  const [dueDate,   setDueDate]   = useState('');

  // ── Attachments ─────────────────────────────────────────────────────────
  const [attachments,   setAttachments]   = useState([]);
  const [imgUrl,        setImgUrl]        = useState('');
  const [imgLabel,      setImgLabel]      = useState('');
  const [linkUrl,       setLinkUrl]       = useState('');
  const [linkLabel,     setLinkLabel]     = useState('');

  const addAttachment = (type) => {
    const url   = type === 'image' ? imgUrl.trim()   : linkUrl.trim();
    const label = type === 'image' ? imgLabel.trim()  : linkLabel.trim();
    if (!url) return;
    setAttachments(prev => [...prev, { id: crypto.randomUUID(), type, url, name: label || url }]);
    if (type === 'image') { setImgUrl(''); setImgLabel(''); }
    else                  { setLinkUrl(''); setLinkLabel(''); }
  };

  const removeAttachment = (id) => setAttachments(prev => prev.filter(a => a.id !== id));

  // ─────────────────────────────────────────────────────────────────────────

  const defaultList = activeListId || state.lists.find(l => l.spaceId === activeSpaceId)?.id || state.lists[0]?.id;

  const toggleAssignee = (userId) => {
    setAssignees(p => p.includes(userId) ? p.filter(id => id !== userId) : [...p, userId]);
  };

  const handleClose = () => {
    setNewTaskModalOpen(false);
    setPreSelectedAssigneeId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    dispatch({
      type: 'ADD_TASK',
      payload: {
        id:           `t_${crypto.randomUUID()}`,
        listId:       defaultList,
        title:        title.trim(),
        description:  description.trim(),
        status:       'To Do',
        priority,
        type:         taskType,
        assignees,
        assignedBy:   currentUser?.id || null,
        dueDate:      dueDate ? new Date(dueDate).toISOString() : new Date().toISOString(),
        tags:         [],
        timeEstimate: 0,
        timeTracked:  0,
        attachments,
        comments:     [],
      }
    });
    handleClose();
  };

  const executors = state.members.filter(m => m.role === 'Executive' || m.role === 'Graphic Designer');

  const inputStyle  = { width: '100%', padding: '10px 14px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'var(--color-text)', outline: 'none', fontSize: '14px', boxSizing: 'border-box' };
  const labelStyle  = { display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.6px' };
  const miniInput   = { flex: 1, padding: '8px 12px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '7px', color: 'var(--color-text)', outline: 'none', fontSize: '13px' };
  const addBtnStyle = { padding: '8px 14px', background: '#111111', color: 'white', border: 'none', borderRadius: '7px', fontWeight: 700, fontSize: '12px', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '5px' };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
      <div style={{ width: '100%', maxWidth: '580px', maxHeight: '90vh', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '14px', boxShadow: '0 24px 64px rgba(0,0,0,0.3)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid var(--color-border)', flexShrink: 0 }}>
          <h2 style={{ fontSize: '17px', fontFamily: 'var(--font-display)' }}>Assign New Task</h2>
          <button onClick={handleClose} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '4px' }}><X size={20} /></button>
        </div>

        {/* Scrollable body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px', overflowY: 'auto' }}>

          {/* Title */}
          <div>
            <label style={labelStyle}>Task Name</label>
            <input
              autoFocus
              type="text"
              placeholder="e.g. Create homepage banner static"
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={{ ...inputStyle, fontSize: '16px', padding: '12px 14px' }}
            />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Brief / Description</label>
            <textarea
              placeholder="What needs to be done? Include specs, sizes, deadlines…"
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={{ ...inputStyle, height: '72px', resize: 'none', lineHeight: '1.5' }}
            />
          </div>

          {/* Task Type */}
          <div>
            <label style={labelStyle}>Task Type</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {TASK_TYPES.map(t => {
                const Icon = TYPE_ICONS[t] || HelpCircle;
                const active = taskType === t;
                return (
                  <button
                    key={t} type="button"
                    onClick={() => setTaskType(t)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '99px', fontSize: '13px', fontWeight: 600, border: '1px solid', cursor: 'pointer', transition: 'all 0.15s', backgroundColor: active ? '#111111' : 'var(--color-bg)', borderColor: active ? 'transparent' : 'var(--color-border)', color: active ? 'white' : 'var(--color-text-muted)' }}
                  >
                    <Icon size={13} />{t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Assignees */}
          <div>
            <label style={labelStyle}>Assign To</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', padding: '10px', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
              {executors.map(m => {
                const selected = assignees.includes(m.id);
                return (
                  <div
                    key={m.id}
                    onClick={() => toggleAssignee(m.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '6px 12px', backgroundColor: selected ? '#111111' : 'var(--color-surface)', borderRadius: '99px', cursor: 'pointer', border: '1px solid', borderColor: selected ? '#111111' : 'var(--color-border)', transition: 'all 0.15s' }}
                  >
                    <img src={m.avatar} alt={m.name} style={{ width: '18px', height: '18px', borderRadius: '50%' }} />
                    <span style={{ fontSize: '13px', fontWeight: 600, color: selected ? '#ffffff' : 'var(--color-text-muted)' }}>{m.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Priority + Due Date */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}><Flag size={10} style={{ display: 'inline', marginRight: '4px' }} />Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value)}
                style={{ ...inputStyle, appearance: 'none', cursor: 'pointer', color: PRIORITY_COLORS[priority] }}
              >
                <option value="Urgent">P1 · Urgent</option>
                <option value="High">P2 · High</option>
                <option value="Normal">P3 · Normal</option>
                <option value="Low">P4 · Low</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                style={{ ...inputStyle, colorScheme: 'light' }}
              />
            </div>
          </div>

          {/* ── Attachments ─────────────────────────────────────────────────── */}
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <label style={labelStyle}><Image size={10} style={{ display: 'inline', marginRight: '4px' }} />Image References</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="url"
                value={imgUrl}
                onChange={e => setImgUrl(e.target.value)}
                placeholder="Paste image URL…"
                style={miniInput}
              />
              <input
                type="text"
                value={imgLabel}
                onChange={e => setImgLabel(e.target.value)}
                placeholder="Label (optional)"
                style={{ ...miniInput, maxWidth: '130px' }}
              />
              <button type="button" onClick={() => addAttachment('image')} style={addBtnStyle} disabled={!imgUrl.trim()}>
                <Plus size={13} /> Add
              </button>
            </div>

            <label style={{ ...labelStyle, marginTop: '4px' }}><Link size={10} style={{ display: 'inline', marginRight: '4px' }} />Link References</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="url"
                value={linkUrl}
                onChange={e => setLinkUrl(e.target.value)}
                placeholder="Paste link URL (Figma, Drive, etc.)…"
                style={miniInput}
              />
              <input
                type="text"
                value={linkLabel}
                onChange={e => setLinkLabel(e.target.value)}
                placeholder="Label (optional)"
                style={{ ...miniInput, maxWidth: '130px' }}
              />
              <button type="button" onClick={() => addAttachment('link')} style={addBtnStyle} disabled={!linkUrl.trim()}>
                <Plus size={13} /> Add
              </button>
            </div>

            {/* Attached items */}
            {attachments.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {attachments.map(att => (
                  <div key={att.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
                    {att.type === 'image' ? <Image size={13} style={{ flexShrink: 0, color: '#7b1fa2' }} /> : <Link size={13} style={{ flexShrink: 0, color: '#1565c0' }} />}
                    <span style={{ flex: 1, fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{att.name}</span>
                    <button type="button" onClick={() => removeAttachment(att.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '2px', flexShrink: 0 }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px', flexShrink: 0 }}>
            <button type="button" onClick={handleClose} style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: 'transparent', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              style={{ padding: '10px 24px', borderRadius: '8px', backgroundColor: '#111111', color: 'white', border: 'none', fontWeight: 700, cursor: title.trim() ? 'pointer' : 'not-allowed', opacity: title.trim() ? 1 : 0.45, fontSize: '14px' }}
            >
              Assign Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
