import React, { useState } from 'react';
import { useStore } from '../../store/StoreContext';
import { useUI } from '../../store/UIContext';
import './AccountsView.css';
import { User, Plus, X, Globe, Briefcase, Film, Image, PenLine, Target, FileText, HelpCircle } from 'lucide-react';

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

const TASK_TYPES = ['Static', 'Video', 'Design', 'Copy', 'Strategy', 'Other'];

const ROLE_PILL = {
  'Team Lead':          { bg: '#2c2c2c',               color: '#ffffff' },
  Executive:            { bg: 'rgba(33,150,243,0.15)', color: '#1565c0' },
  'Creative Associate': { bg: 'rgba(156,39,176,0.12)', color: '#7b1fa2' },
  Admin:                { bg: '#111111',               color: '#ffffff' },
};

// ── Brand card (shared) ─────────────────────────────────────────────────────
function BrandCard({ space, state, currentUser, isManagerOrAdmin }) {
  const lists = state.lists.filter(l => l.spaceId === space.id);
  const listIds = lists.map(l => l.id);
  const allTasksInBrand = state.tasks.filter(t => listIds.includes(t.listId));

  const myTasks = allTasksInBrand.filter(t => (t.assignees || []).includes(currentUser.id));
  const tasksToShow = isManagerOrAdmin ? allTasksInBrand : myTasks;

  const typeBreakdown = {};
  tasksToShow.forEach(t => { if (t.type) typeBreakdown[t.type] = (typeBreakdown[t.type] || 0) + 1; });

  const done    = tasksToShow.filter(t => t.status === 'Done').length;
  const overdue = tasksToShow.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Done').length;
  const pct     = tasksToShow.length > 0 ? Math.round((done / tasksToShow.length) * 100) : 0;

  const teamOnBrand = state.brandAssignments
    .filter(b => b.spaceId === space.id)
    .map(b => ({ ...b, member: state.members.find(m => m.id === b.profileId) }))
    .filter(x => x.member);

  return (
    <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '14px', padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
        <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--color-surface-2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', border: '1px solid var(--color-border)', flexShrink: 0 }}>
          {space.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '2px', color: space.color || 'var(--color-text)' }}>{space.name}</div>
          {space.industry && <div style={{ display: 'inline-block', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '99px', background: 'var(--color-surface-2)', color: 'var(--color-text-muted)', marginBottom: '4px' }}>{space.industry}</div>}
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            {tasksToShow.length} task{tasksToShow.length !== 1 ? 's' : ''} · {done} done
            {overdue > 0 && <span style={{ color: '#b20f00', marginLeft: '6px', fontWeight: 700 }}>· {overdue} overdue</span>}
          </div>
        </div>
      </div>

      {space.description && (
        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: '1.5', margin: 0 }}>{space.description}</p>
      )}

      {space.website && (
        <a href={space.website} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--color-text-muted)', textDecoration: 'none' }}>
          <Globe size={11} /> {space.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
        </a>
      )}

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '6px', fontWeight: 600 }}>
          <span>Progress</span>
          <span>{pct}% complete</span>
        </div>
        <div style={{ height: '6px', borderRadius: '99px', backgroundColor: 'var(--color-surface-2)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, backgroundColor: pct === 100 ? '#4caf50' : '#111111', borderRadius: '99px', transition: 'width 0.4s' }} />
        </div>
      </div>

      {Object.keys(typeBreakdown).length > 0 && (
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--color-text-muted)', marginBottom: '10px' }}>Task Types</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {Object.entries(typeBreakdown).map(([type, count]) => {
              const TypeIcon = TYPE_ICONS[type] || HelpCircle;
              const tc = TYPE_COLORS[type] || TYPE_COLORS.Other;
              return (
                <span key={type} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '99px', color: tc.color, backgroundColor: tc.bg, border: `1px solid ${tc.color}33` }}>
                  <TypeIcon size={11} />
                  {type} <span style={{ opacity: 0.7 }}>× {count}</span>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Team panel — managers/admins can sub-assign within this brand */}
      {isManagerOrAdmin && (
        <BrandTeamPanel space={space} teamOnBrand={teamOnBrand} state={state} currentUser={currentUser} />
      )}
    </div>
  );
}

// ── Manager-only: sub-assign team to this brand ─────────────────────────────
function BrandTeamPanel({ space, teamOnBrand, state, currentUser }) {
  const { dispatch } = useStore();
  const [adding, setAdding] = useState(false);
  const [pickMember, setPickMember] = useState('');
  const [pickType, setPickType] = useState('');

  const candidateMembers = state.members.filter(m => m.role !== 'Admin' && m.id !== currentUser.id);

  const handleAdd = () => {
    if (!pickMember) return;
    const exists = teamOnBrand.some(b => b.profileId === pickMember && (b.taskType || '') === (pickType || ''));
    if (exists) { setAdding(false); setPickMember(''); setPickType(''); return; }
    dispatch({
      type: 'ASSIGN_BRAND',
      payload: {
        profileId:  pickMember,
        spaceId:    space.id,
        taskType:   pickType || null,
        assignedBy: currentUser.id,
      },
    });
    setAdding(false); setPickMember(''); setPickType('');
  };

  return (
    <div style={{ paddingTop: '10px', borderTop: '1px dashed var(--color-border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--color-text-muted)' }}>
          Team on This Brand
        </div>
        {!adding && (
          <button onClick={() => setAdding(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 9px', borderRadius: '99px', border: '1px dashed var(--color-border)', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: '11px', fontWeight: 600 }}>
            <Plus size={11} /> Assign
          </button>
        )}
      </div>

      {teamOnBrand.length === 0 && !adding && (
        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontStyle: 'italic', margin: 0 }}>No team members on this brand yet.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {teamOnBrand.map(({ id, member, taskType }) => {
          const rs = ROLE_PILL[member.role] || { bg: 'var(--color-surface-2)', color: 'var(--color-text-muted)' };
          const tc = TYPE_COLORS[taskType] || null;
          return (
            <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 10px', backgroundColor: 'var(--color-bg)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
              <img src={member.avatar} alt={member.name} style={{ width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>{member.name}</span>
                <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '99px', backgroundColor: rs.bg, color: rs.color }}>{member.role}</span>
                {taskType && tc && (
                  <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '99px', backgroundColor: tc.bg, color: tc.color }}>{taskType}</span>
                )}
              </div>
              <button onClick={() => dispatch({ type: 'UNASSIGN_BRAND', payload: { id } })} title="Remove" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '3px', display: 'flex', alignItems: 'center', borderRadius: '50%' }}
                onMouseEnter={e => e.currentTarget.style.color = '#b20f00'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
              ><X size={12} /></button>
            </div>
          );
        })}
      </div>

      {adding && (
        <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
          <select value={pickMember} onChange={e => setPickMember(e.target.value)} style={{ flex: '1 1 auto', minWidth: '140px', padding: '6px 10px', border: '1px solid var(--color-border)', borderRadius: '7px', fontSize: '12px', background: 'var(--color-surface)', color: 'var(--color-text)', outline: 'none' }}>
            <option value="">Pick member…</option>
            {candidateMembers.map(m => <option key={m.id} value={m.id}>{m.name} · {m.role}</option>)}
          </select>
          <select value={pickType} onChange={e => setPickType(e.target.value)} style={{ width: '110px', padding: '6px 10px', border: '1px solid var(--color-border)', borderRadius: '7px', fontSize: '12px', background: 'var(--color-surface)', color: 'var(--color-text)', outline: 'none' }}>
            <option value="">All types</option>
            {TASK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <button onClick={handleAdd} disabled={!pickMember} style={{ padding: '6px 12px', background: '#111111', color: 'white', border: 'none', borderRadius: '7px', fontWeight: 700, fontSize: '12px', cursor: pickMember ? 'pointer' : 'not-allowed', opacity: pickMember ? 1 : 0.4 }}>Add</button>
          <button onClick={() => { setAdding(false); setPickMember(''); setPickType(''); }} style={{ padding: '6px 8px', background: 'var(--color-surface-2)', color: 'var(--color-text-muted)', border: 'none', borderRadius: '7px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><X size={13} /></button>
        </div>
      )}
    </div>
  );
}

// ── Root export ─────────────────────────────────────────────────────────────
export default function AccountsView() {
  const { state } = useStore();
  const { currentUser } = useUI();

  if (!currentUser) return null;

  const isAdmin   = currentUser.role === 'Admin';
  const isManager = currentUser.role === 'Team Lead';
  const isManagerOrAdmin = isAdmin || isManager;

  // Brands assigned directly to this user (no role-in-brand filter)
  const myAssignedSpaceIds = new Set(
    state.brandAssignments.filter(b => b.profileId === currentUser.id).map(b => b.spaceId)
  );

  // Brands the user has tasks in (fallback for users without explicit assignment)
  const taskBasedSpaceIds = new Set();
  state.tasks
    .filter(t => (t.assignees || []).includes(currentUser.id))
    .forEach(t => {
      const list = state.lists.find(l => l.id === t.listId);
      if (list) taskBasedSpaceIds.add(list.spaceId);
    });

  // For Admin: show all brands. For others: assigned brands ∪ brands with their tasks
  let visibleSpaces;
  if (isAdmin) {
    visibleSpaces = state.spaces;
  } else {
    visibleSpaces = state.spaces.filter(sp => myAssignedSpaceIds.has(sp.id) || taskBasedSpaceIds.has(sp.id));
  }

  return (
    <div className="accounts-view">
      <div className="accounts-header">
        <div>
          <h2 className="accounts-title">{isAdmin ? 'All Brands' : 'My Brands'}</h2>
          <p className="accounts-sub">
            {visibleSpaces.length} brand{visibleSpaces.length !== 1 ? 's' : ''}
            {!isAdmin && ' assigned to you'}
            {isManagerOrAdmin && ' · you can sub-assign team members per brand'}
          </p>
        </div>
      </div>

      {visibleSpaces.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '80px 20px', color: 'var(--color-text-muted)', fontSize: '14px', textAlign: 'center' }}>
          {isManager ? <Briefcase size={40} style={{ opacity: 0.2 }} /> : <User size={40} style={{ opacity: 0.2 }} />}
          <div>
            <p style={{ margin: 0, fontWeight: 600 }}>No brands assigned yet.</p>
            <p style={{ margin: '6px 0 0', fontSize: '12px' }}>Ask your admin to assign brands to your account.</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px', paddingBottom: '40px' }}>
          {visibleSpaces.map(space => (
            <BrandCard
              key={space.id}
              space={space}
              state={state}
              currentUser={currentUser}
              isManagerOrAdmin={isManagerOrAdmin}
            />
          ))}
        </div>
      )}
    </div>
  );
}
