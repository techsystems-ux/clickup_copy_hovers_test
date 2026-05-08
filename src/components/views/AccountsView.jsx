import React, { useState, useMemo } from 'react';
import { useStore } from '../../store/StoreContext';
import { useUI } from '../../store/UIContext';
import './AccountsView.css';
import {
  Plus, X, Globe, Briefcase, Search, Building2, Trash2, ArrowUpRight,
  Film, Image, PenLine, Target, FileText, HelpCircle,
} from 'lucide-react';

const TYPE_ICONS = {
  Static: Image, Video: Film, Design: PenLine,
  Copy: FileText, Strategy: Target, Other: HelpCircle,
};

const TASK_TYPES = ['Static', 'Video', 'Design', 'Copy', 'Strategy', 'Other'];

const PRESET_COLORS = ['#111111','#e91e63','#ff6900','#2196f3','#4caf50','#ff9800','#9c27b0','#00bcd4','#f44336','#607d8b'];
const PRESET_ICONS  = ['🚀','🛍️','🌸','⚡','🎯','💎','🎨','📱','🏆','🌟','🎬','📦'];

// ─── Inline brand creation form (Admin + Team Lead) ──────────────────────────
function NewBrandForm({ onClose, currentUser }) {
  const { dispatch } = useStore();
  const [name,        setName]        = useState('');
  const [color,       setColor]       = useState('#111111');
  const [icon,        setIcon]        = useState('🚀');
  const [description, setDescription] = useState('');
  const [website,     setWebsite]     = useState('');
  const [industry,    setIndustry]    = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const spaceId = `sp_${crypto.randomUUID()}`;
    dispatch({
      type: 'ADD_SPACE',
      payload: {
        id: spaceId, name: name.trim(), color, icon,
        description: description.trim(), website: website.trim(), industry: industry.trim(),
      },
    });
    dispatch({
      type: 'ASSIGN_BRAND',
      payload: { profileId: currentUser.id, spaceId, taskType: null, assignedBy: currentUser.id },
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="acc-new-brand-form">
      <div className="acc-new-brand-head">
        <h3><Plus size={14} /> New Brand</h3>
        <button type="button" onClick={onClose} className="acc-icon-btn"><X size={16} /></button>
      </div>

      <div className="acc-form-grid-2">
        <div>
          <label className="acc-label">Brand Name *</label>
          <input className="acc-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Apex Sport" required autoFocus />
        </div>
        <div>
          <label className="acc-label">Industry</label>
          <input className="acc-input" value={industry} onChange={e => setIndustry(e.target.value)} placeholder="Fashion, FMCG, SaaS" />
        </div>
      </div>

      <div>
        <label className="acc-label">Website</label>
        <input className="acc-input" type="url" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://…" />
      </div>

      <div>
        <label className="acc-label">Description</label>
        <textarea
          className="acc-input acc-textarea"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Short note about this brand…"
        />
      </div>

      <div className="acc-form-row-wrap">
        <div>
          <label className="acc-label">Color</label>
          <div className="acc-swatch-row">
            {PRESET_COLORS.map(c => (
              <div
                key={c}
                onClick={() => setColor(c)}
                className={`acc-swatch ${color === c ? 'selected' : ''}`}
                style={{ background: c, outlineColor: c }}
              />
            ))}
          </div>
        </div>
        <div>
          <label className="acc-label">Icon</label>
          <div className="acc-icon-row">
            {PRESET_ICONS.map(i => (
              <button
                key={i}
                type="button"
                onClick={() => setIcon(i)}
                className={`acc-icon-pick ${icon === i ? 'selected' : ''}`}
              >{i}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="acc-form-actions">
        <button type="button" onClick={onClose} className="acc-btn-secondary">Cancel</button>
        <button type="submit" disabled={!name.trim()} className="acc-btn-primary">Create Brand</button>
      </div>
    </form>
  );
}

// ─── Sub-assign team to a brand (Admin / Team Lead / Executive) ──────────────
function BrandTeamPanel({ space, teamOnBrand, state, currentUser }) {
  const { dispatch } = useStore();
  const [adding, setAdding] = useState(false);
  const [pickMember, setPickMember] = useState('');
  const [pickType, setPickType] = useState('');

  const candidateMembers = state.members.filter(m => {
    if (m.id === currentUser.id) return false;
    if (currentUser.role === 'Admin')      return m.role !== 'Admin';
    if (currentUser.role === 'Team Lead')  return m.role === 'Executive' || m.role === 'Creative Associate';
    if (currentUser.role === 'Executive')  return m.role === 'Creative Associate';
    return false;
  });

  const visibleTeam = teamOnBrand.filter(({ member }) => {
    if (currentUser.role === 'Admin' || currentUser.role === 'Team Lead') return true;
    if (currentUser.role === 'Executive') return member.role === 'Creative Associate';
    return false;
  });

  const handleAdd = () => {
    if (!pickMember) return;
    const exists = teamOnBrand.some(b => b.profileId === pickMember && (b.taskType || '') === (pickType || ''));
    if (exists) { setAdding(false); setPickMember(''); setPickType(''); return; }
    dispatch({
      type: 'ASSIGN_BRAND',
      payload: { profileId: pickMember, spaceId: space.id, taskType: pickType || null, assignedBy: currentUser.id },
    });
    setAdding(false); setPickMember(''); setPickType('');
  };

  return (
    <div>
      <div className="acc-detail-section-head">
        <h3>Team on This Brand</h3>
        {!adding && candidateMembers.length > 0 && (
          <button onClick={() => setAdding(true)} className="acc-add-chip">
            <Plus size={11} /> Assign
          </button>
        )}
      </div>

      {visibleTeam.length === 0 && !adding && (
        <p className="acc-detail-empty">
          {currentUser.role === 'Executive' ? 'No creative associates on this brand yet.' : 'No team members on this brand yet.'}
        </p>
      )}

      <div className="acc-team-list">
        {visibleTeam.map(({ id, member, taskType }) => (
          <div key={id} className="acc-team-row">
            <img src={member.avatar} alt={member.name} className="acc-team-avatar" />
            <div className="acc-team-info">
              <span className="acc-team-name">{member.name}</span>
              <span className="acc-team-role">{member.role}{taskType ? ` · ${taskType}` : ''}</span>
            </div>
            <button
              onClick={() => dispatch({ type: 'UNASSIGN_BRAND', payload: { id } })}
              title="Remove"
              className="acc-icon-btn danger"
            ><X size={12} /></button>
          </div>
        ))}
      </div>

      {adding && (
        <div className="acc-assign-row">
          <select value={pickMember} onChange={e => setPickMember(e.target.value)} className="acc-mini-select">
            <option value="">Pick member…</option>
            {candidateMembers.map(m => <option key={m.id} value={m.id}>{m.name} · {m.role}</option>)}
          </select>
          <select value={pickType} onChange={e => setPickType(e.target.value)} className="acc-mini-select acc-type-select">
            <option value="">All types</option>
            {TASK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <button onClick={handleAdd} disabled={!pickMember} className="acc-btn-primary acc-btn-small">Add</button>
          <button onClick={() => { setAdding(false); setPickMember(''); setPickType(''); }} className="acc-icon-btn"><X size={12} /></button>
        </div>
      )}
    </div>
  );
}

// ─── Brand detail slide-over ─────────────────────────────────────────────────
function BrandDetail({ space, state, currentUser, onClose, canSubAssign, canDelete }) {
  const { dispatch } = useStore();
  const { setSelectedTaskId } = useUI();

  const lists = state.lists.filter(l => l.spaceId === space.id);
  const listIds = lists.map(l => l.id);
  const allTasksInBrand = state.tasks.filter(t => listIds.includes(t.listId));
  const isManagerOrAdmin = currentUser.role === 'Admin' || currentUser.role === 'Team Lead';
  const myTasks = allTasksInBrand.filter(t => (t.assignees || []).includes(currentUser.id));
  const tasksToShow = isManagerOrAdmin ? allTasksInBrand : myTasks;

  const teamOnBrand = state.brandAssignments
    .filter(b => b.spaceId === space.id)
    .map(b => ({ ...b, member: state.members.find(m => m.id === b.profileId) }))
    .filter(x => x.member);

  const open = tasksToShow.filter(t => t.status !== 'Done');
  const done = tasksToShow.filter(t => t.status === 'Done').length;
  const overdue = tasksToShow.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Done').length;

  const handleDelete = () => {
    const tasksInBrand = allTasksInBrand.length;
    if (!window.confirm(`Delete brand "${space.name}"?\n\nThis will permanently delete:\n- ${lists.length} list(s)\n- ${tasksInBrand} task(s)\n- All brand assignments\n\nThis cannot be undone.`)) return;
    dispatch({ type: 'DELETE_SPACE', payload: { spaceId: space.id } });
    onClose();
  };

  return (
    <div className="acc-detail-scrim" onClick={onClose}>
      <div className="acc-detail-panel" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="acc-detail-header">
          <div className="acc-detail-id">
            <div className="acc-detail-icon" style={{ background: space.color || 'var(--text-primary)' }}>{space.icon || '🏷️'}</div>
            <div>
              <h2>{space.name}</h2>
              {space.industry && <p className="acc-detail-industry">{space.industry}</p>}
            </div>
          </div>
          <div className="acc-detail-actions">
            {canDelete && (
              <button onClick={handleDelete} title="Delete brand" className="acc-icon-btn danger">
                <Trash2 size={16} />
              </button>
            )}
            <button onClick={onClose} className="acc-icon-btn"><X size={18} /></button>
          </div>
        </div>

        <div className="acc-detail-body">
          {/* Quick stats */}
          <div className="acc-detail-stats">
            <div className="acc-detail-stat">
              <p className="acc-stat-val">{open.length}</p>
              <p className="acc-stat-lbl">Open Tasks</p>
            </div>
            <div className={`acc-detail-stat ${overdue > 0 ? 'danger' : ''}`}>
              <p className="acc-stat-val">{overdue}</p>
              <p className="acc-stat-lbl">Overdue</p>
            </div>
            <div className="acc-detail-stat">
              <p className="acc-stat-val">{done}</p>
              <p className="acc-stat-lbl">Done</p>
            </div>
          </div>

          {/* Details */}
          {(space.description || space.website) && (
            <div>
              <h3 className="acc-detail-section-title">Details</h3>
              {space.description && <p className="acc-detail-desc">{space.description}</p>}
              {space.website && (
                <a href={space.website} target="_blank" rel="noreferrer" className="acc-detail-link">
                  <Globe size={12} /> {space.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                </a>
              )}
            </div>
          )}

          {/* Team panel — Admin/Team Lead/Executive can sub-assign */}
          {canSubAssign && (
            <BrandTeamPanel
              space={space}
              teamOnBrand={teamOnBrand}
              state={state}
              currentUser={currentUser}
            />
          )}

          {/* Open tasks */}
          <div>
            <div className="acc-detail-section-head">
              <h3>Open Tasks ({open.length})</h3>
            </div>
            {open.length === 0 ? (
              <p className="acc-detail-empty">No open tasks.</p>
            ) : (
              <div className="acc-detail-tasks">
                {open.slice(0, 8).map(task => {
                  const assignee = state.members.find(m => m.id === (task.assignees || [])[0]);
                  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
                  return (
                    <button
                      key={task.id}
                      onClick={() => { setSelectedTaskId(task.id); onClose(); }}
                      className="acc-detail-task"
                    >
                      <div className={`acc-task-pri pri-${(task.priority || 'Normal').toLowerCase()}`} />
                      <div className="acc-detail-task-info">
                        <p className="acc-detail-task-title">{task.title}</p>
                      </div>
                      {assignee && (
                        <img src={assignee.avatar} alt={assignee.name} title={assignee.name} className="acc-detail-task-avatar" />
                      )}
                      {task.dueDate && (
                        <span className={`acc-detail-task-due ${isOverdue ? 'overdue' : ''}`}>
                          {new Date(task.dueDate).toLocaleDateString([], { day: 'numeric', month: 'short' })}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Root export ─────────────────────────────────────────────────────────────
export default function AccountsView() {
  const { state } = useStore();
  const { currentUser } = useUI();
  const [showNewBrand, setShowNewBrand] = useState(false);
  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [selectedSpaceId, setSelectedSpaceId] = useState(null);

  if (!currentUser) return null;

  const isAdmin     = currentUser.role === 'Admin';
  const isTeamLead  = currentUser.role === 'Team Lead';
  const isExecutive = currentUser.role === 'Executive';

  const canCreateBrands = isAdmin || isTeamLead;
  const canSubAssign    = isAdmin || isTeamLead || isExecutive;

  // Brand visibility (preserved exactly from previous implementation)
  const myAssignedSpaceIds = new Set(
    state.brandAssignments.filter(b => b.profileId === currentUser.id).map(b => b.spaceId)
  );
  const taskBasedSpaceIds = new Set();
  state.tasks
    .filter(t => (t.assignees || []).includes(currentUser.id) || t.assignedBy === currentUser.id)
    .forEach(t => {
      const list = state.lists.find(l => l.id === t.listId);
      if (list) taskBasedSpaceIds.add(list.spaceId);
    });

  const baseBrands = (isAdmin || isTeamLead)
    ? state.spaces
    : state.spaces.filter(sp => myAssignedSpaceIds.has(sp.id) || taskBasedSpaceIds.has(sp.id));

  // Filters
  const industries = useMemo(() => {
    const set = new Set(baseBrands.map(b => b.industry).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [baseBrands]);

  const visibleBrands = baseBrands
    .filter(sp => industryFilter === 'all' || sp.industry === industryFilter)
    .filter(sp =>
      search === '' ||
      sp.name.toLowerCase().includes(search.toLowerCase()) ||
      (sp.industry || '').toLowerCase().includes(search.toLowerCase())
    );

  // Per-brand metrics
  const getBrandMetrics = (sp) => {
    const listIds = state.lists.filter(l => l.spaceId === sp.id).map(l => l.id);
    const allTasksInBrand = state.tasks.filter(t => listIds.includes(t.listId));
    const myTasks = allTasksInBrand.filter(t => (t.assignees || []).includes(currentUser.id));
    const tasksToCount = (isAdmin || isTeamLead) ? allTasksInBrand : myTasks;
    const open = tasksToCount.filter(t => t.status !== 'Done').length;
    const done = tasksToCount.filter(t => t.status === 'Done').length;
    const overdue = tasksToCount.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Done').length;
    const total = tasksToCount.length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    const teamOnBrand = state.brandAssignments
      .filter(b => b.spaceId === sp.id)
      .map(b => state.members.find(m => m.id === b.profileId))
      .filter(Boolean);
    return { open, done, overdue, total, pct, teamOnBrand };
  };

  const selectedSpace = selectedSpaceId ? state.spaces.find(s => s.id === selectedSpaceId) : null;

  return (
    <div className="accounts-view">
      <div className="accounts-header">
        <div>
          <h2 className="accounts-title">{(isAdmin || isTeamLead) ? 'All Brands' : 'My Brands'}</h2>
          <p className="accounts-sub">
            {baseBrands.length} brand{baseBrands.length !== 1 ? 's' : ''}
            {!isAdmin && !isTeamLead && ' assigned to you'}
            {canSubAssign && ' · click a row to assign team members'}
          </p>
        </div>

        {canCreateBrands && !showNewBrand && (
          <button
            onClick={() => setShowNewBrand(true)}
            className="acc-btn-primary"
          >
            <Plus size={14} /> New Brand
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="accounts-filters">
        <div className="acc-search-wrap">
          <Search size={14} className="acc-search-icon" />
          <input
            type="text"
            placeholder="Search brands…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="acc-search-input"
          />
        </div>
        {industries.length > 2 && (
          <select
            value={industryFilter}
            onChange={e => setIndustryFilter(e.target.value)}
            className="acc-industry-select"
          >
            {industries.map(i => <option key={i} value={i}>{i === 'all' ? 'All Industries' : i}</option>)}
          </select>
        )}
      </div>

      {showNewBrand && (
        <NewBrandForm onClose={() => setShowNewBrand(false)} currentUser={currentUser} />
      )}

      {/* Table */}
      {visibleBrands.length === 0 ? (
        <div className="acc-empty">
          {(isAdmin || isTeamLead) ? <Briefcase size={32} /> : <Building2 size={32} />}
          <p className="acc-empty-title">No brands {canCreateBrands ? 'yet' : 'assigned yet'}.</p>
          <p className="acc-empty-sub">
            {canCreateBrands ? 'Click "New Brand" to add one.' : 'Ask your admin or team lead to assign brands to your account.'}
          </p>
        </div>
      ) : (
        <div className="acc-table-wrap">
          <table className="acc-table">
            <thead>
              <tr>
                <th>Brand</th>
                <th>Industry</th>
                <th>Open</th>
                <th>Team</th>
                <th>Progress</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {visibleBrands.map(sp => {
                const m = getBrandMetrics(sp);
                return (
                  <tr key={sp.id} onClick={() => setSelectedSpaceId(sp.id)} className="acc-row">
                    <td>
                      <div className="acc-brand-cell">
                        <div className="acc-brand-icon" style={{ background: sp.color || 'var(--text-primary)' }}>
                          {sp.icon || sp.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="acc-brand-meta">
                          <p className="acc-brand-name">{sp.name}</p>
                          {sp.website && <p className="acc-brand-website">{sp.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="acc-cell-muted">{sp.industry || '—'}</td>
                    <td>
                      <div className="acc-open-count">
                        <span className="acc-open-num">{m.open}</span>
                        {m.overdue > 0 && <span className="acc-overdue-pill">{m.overdue} late</span>}
                      </div>
                    </td>
                    <td>
                      <div className="acc-team-stack">
                        {m.teamOnBrand.slice(0, 4).map(p => (
                          <img key={p.id} src={p.avatar} alt={p.name} title={p.name} className="acc-team-mini" />
                        ))}
                        {m.teamOnBrand.length > 4 && (
                          <div className="acc-team-mini acc-team-overflow">+{m.teamOnBrand.length - 4}</div>
                        )}
                        {m.teamOnBrand.length === 0 && <span className="acc-cell-faint">—</span>}
                      </div>
                    </td>
                    <td>
                      <div className="acc-progress-cell">
                        <div className="acc-progress-bar">
                          <div className="acc-progress-fill" style={{ width: `${m.pct}%`, background: m.pct === 100 ? 'var(--status-done)' : 'var(--text-primary)' }} />
                        </div>
                        <span className="acc-progress-pct">{m.pct}%</span>
                      </div>
                    </td>
                    <td className="acc-row-arrow-cell"><ArrowUpRight size={12} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Slide-over detail */}
      {selectedSpace && (
        <BrandDetail
          space={selectedSpace}
          state={state}
          currentUser={currentUser}
          onClose={() => setSelectedSpaceId(null)}
          canSubAssign={canSubAssign}
          canDelete={isAdmin}
        />
      )}
    </div>
  );
}
