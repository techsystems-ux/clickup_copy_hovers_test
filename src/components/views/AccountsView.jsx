import React, { useState } from 'react';
import { useStore } from '../../store/StoreContext';
import { useUI } from '../../store/UIContext';
import './AccountsView.css';
import { Search, Mail, User } from 'lucide-react';
import { Film, Image, PenLine, Target, FileText, HelpCircle } from 'lucide-react';

const STATUS_COLOR = {
  Available:       '#2e7d32',
  Busy:            '#e65100',
  'Do Not Disturb':'#b71c1c',
  Away:            '#f9a825',
};

const ROLE_LABEL = {
  'Admin':            { label: 'Admin',            bg: '#111111', color: '#ffffff' },
  'Manager':          { label: 'Manager',          bg: '#333333', color: '#ffffff' },
  'Executive':        { label: 'Executive',        bg: '#ebebeb', color: '#111111' },
  'Graphic Designer': { label: 'Graphic Designer', bg: '#f5f5f5', color: '#555555' },
};

const TYPE_ICONS = {
  Static: Image, Video: Film, Design: PenLine,
  Copy: FileText, Strategy: Target, Other: HelpCircle,
};

const TYPE_COLORS = {
  Static:   { color: '#7b1fa2', bg: 'rgba(123,31,162,0.10)' },
  Video:    { color: '#1565c0', bg: 'rgba(21,101,192,0.10)' },
  Design:   { color: '#e65100', bg: 'rgba(230,81,0,0.10)'   },
  Copy:     { color: '#2e7d32', bg: 'rgba(46,125,50,0.10)'  },
  Strategy: { color: '#111111', bg: 'rgba(17,17,17,0.08)'   },
  Other:    { color: '#888888', bg: 'rgba(136,136,136,0.10)' },
};

// ─── Designer brand view ─────────────────────────────────────────────────────
function DesignerAccountsView({ currentUser, state }) {
  const myTasks = state.tasks.filter(t => t.assignees?.includes(currentUser.id));

  const brandsWithTasks = state.spaces.map(space => {
    const listIds = state.lists.filter(l => l.spaceId === space.id).map(l => l.id);
    const tasks = myTasks.filter(t => listIds.includes(t.listId));
    if (tasks.length === 0) return null;

    const typeBreakdown = {};
    tasks.forEach(t => { if (t.type) typeBreakdown[t.type] = (typeBreakdown[t.type] || 0) + 1; });

    const done = tasks.filter(t => t.status === 'Done').length;
    const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Done').length;
    const pct = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;
    return { space, tasks, typeBreakdown, done, overdue, pct };
  }).filter(Boolean);

  return (
    <div className="accounts-view">
      <div className="accounts-header">
        <div>
          <h2 className="accounts-title">My Brands</h2>
          <p className="accounts-sub">{brandsWithTasks.length} brand{brandsWithTasks.length !== 1 ? 's' : ''} with active tasks</p>
        </div>
      </div>

      {brandsWithTasks.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '80px 20px', color: 'var(--color-text-muted)', fontSize: '14px' }}>
          <User size={40} style={{ opacity: 0.2 }} />
          <p>No brands assigned yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px', paddingBottom: '40px' }}>
          {brandsWithTasks.map(({ space, tasks, typeBreakdown, done, overdue, pct }) => (
            <div key={space.id} style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '14px', padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Brand header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--color-surface-2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', border: '1px solid var(--color-border)', flexShrink: 0 }}>
                  {space.icon}
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '2px' }}>{space.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                    {tasks.length} task{tasks.length !== 1 ? 's' : ''} · {done} done
                    {overdue > 0 && <span style={{ color: '#b20f00', marginLeft: '6px', fontWeight: '700' }}>· {overdue} overdue</span>}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '6px', fontWeight: '600' }}>
                  <span>Progress</span>
                  <span>{pct}% complete</span>
                </div>
                <div style={{ height: '6px', borderRadius: '99px', backgroundColor: 'var(--color-surface-2)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, backgroundColor: pct === 100 ? '#4caf50' : '#111111', borderRadius: '99px', transition: 'width 0.4s' }} />
                </div>
              </div>

              {/* Task type breakdown */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--color-text-muted)', marginBottom: '10px' }}>Task Types</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {Object.entries(typeBreakdown).map(([type, count]) => {
                    const TypeIcon = TYPE_ICONS[type] || HelpCircle;
                    const tc = TYPE_COLORS[type] || TYPE_COLORS.Other;
                    return (
                      <span key={type} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: '700', padding: '4px 10px', borderRadius: '99px', color: tc.color, backgroundColor: tc.bg, border: `1px solid ${tc.color}33` }}>
                        <TypeIcon size={11} />
                        {type} <span style={{ opacity: 0.7 }}>× {count}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Manager member directory ────────────────────────────────────────────────
function ManagerAccountsView({ state }) {
  const [query, setQuery] = useState('');

  const filtered = state.members.filter(m =>
    m.name.toLowerCase().includes(query.toLowerCase()) ||
    m.email.toLowerCase().includes(query.toLowerCase()) ||
    m.role.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="accounts-view">
      <div className="accounts-header">
        <div>
          <h2 className="accounts-title">Accounts</h2>
          <p className="accounts-sub">{state.members.length} members in your workspace</p>
        </div>

        <div className="accounts-search">
          <Search size={15} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search members…"
          />
        </div>
      </div>

      <div className="accounts-table">
        <div className="accounts-table-head">
          <span className="col-member">Member</span>
          <span className="col-role">Role</span>
          <span className="col-status">Status</span>
          <span className="col-email">Email</span>
        </div>

        {filtered.map(member => {
          const roleStyle = ROLE_LABEL[member.role] || ROLE_LABEL.Member;
          return (
            <div key={member.id} className="accounts-row">
              <div className="col-member">
                <img src={member.avatar} alt={member.name} className="acc-avatar" />
                <div>
                  <div className="acc-name">{member.name}</div>
                </div>
              </div>

              <div className="col-role">
                <span
                  className="acc-role-badge"
                  style={{ background: roleStyle.bg, color: roleStyle.color }}
                >
                  {roleStyle.label}
                </span>
              </div>

              <div className="col-status">
                <span className="acc-status-dot" style={{ background: STATUS_COLOR[member.status] || '#aaa' }} />
                <span className="acc-status-label">{member.status}</span>
              </div>

              <div className="col-email">
                <Mail size={13} style={{ flexShrink: 0, color: 'var(--color-text-muted)' }} />
                <span>{member.email}</span>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="accounts-empty">
            <User size={32} style={{ opacity: 0.25 }} />
            <p>No members match "{query}"</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Root export ─────────────────────────────────────────────────────────────
export default function AccountsView() {
  const { state } = useStore();
  const { currentUser } = useUI();

  if (!currentUser) return null;

  const isManager = currentUser.role === 'Admin' || currentUser.role === 'Manager';
  return isManager
    ? <ManagerAccountsView state={state} />
    : <DesignerAccountsView currentUser={currentUser} state={state} />;
}
