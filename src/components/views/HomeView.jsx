import React, { useMemo } from 'react';
import { useStore } from '../../store/StoreContext';
import { useUI } from '../../store/UIContext';
import { AlertTriangle, ArrowUpRight, CheckSquare, Activity, Link2 } from 'lucide-react';

const PRIORITY_BAR = {
  Urgent: 'var(--accent)',
  High:   'var(--text-primary)',
  Normal: 'var(--text-faint)',
  Low:    'var(--mid-grey)',
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function fmtDate(d) {
  const dt = new Date(d);
  const now = new Date();
  const diff = Math.floor((dt - now) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  return dt.toLocaleDateString([], { day: 'numeric', month: 'short' });
}

function fmtRelative(d) {
  if (!d) return '';
  const dt = new Date(d);
  const now = new Date();
  const diff = Math.floor((now - dt) / 86400000);
  if (diff <= 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return `${diff}d ago`;
  if (diff < 30) return `${Math.floor(diff / 7)}w ago`;
  return dt.toLocaleDateString([], { day: 'numeric', month: 'short' });
}

// ─── Live Activity feed (shared) ─────────────────────────────────────────────
function LiveActivity({ tasks, members, spaces, lists, scope }) {
  const accountById = useMemo(() => Object.fromEntries(spaces.map(s => [s.id, s])), [spaces]);
  const personById = useMemo(() => Object.fromEntries(members.map(m => [m.id, m])), [members]);
  const listById = useMemo(() => Object.fromEntries(lists.map(l => [l.id, l])), [lists]);

  const events = useMemo(() => {
    const out = [];
    const today = new Date();
    for (const t of tasks) {
      const list = t.listId ? listById[t.listId] : null;
      const acc = list?.spaceId ? accountById[list.spaceId] : null;
      const assn = (t.assignees || [])[0] ? personById[(t.assignees || [])[0]] : null;
      const ts = t.updatedAt || t.dueDate || null;
      if (t.status === 'Done') {
        out.push({
          when: ts, kind: 'done',
          text: <><b>{assn?.name?.split(' ')[0] || 'Someone'}</b> closed <i>{t.title}</i>{acc ? <> for <b>{acc.name}</b></> : null}</>,
        });
      } else if (t.dueDate && new Date(t.dueDate) < today && t.status !== 'Done') {
        out.push({
          when: t.dueDate, kind: 'overdue',
          text: <><i>{t.title}</i> is overdue{acc ? <> · <b>{acc.name}</b></> : null}{assn ? <> · {assn.name.split(' ')[0]}</> : null}</>,
        });
      } else if (t.status === 'In Progress') {
        out.push({
          when: ts, kind: 'progress',
          text: <><b>{assn?.name?.split(' ')[0] || 'Someone'}</b> working on <i>{t.title}</i>{acc ? <> · <b>{acc.name}</b></> : null}</>,
        });
      } else {
        out.push({
          when: ts, kind: 'new',
          text: <>New task <i>{t.title}</i>{acc ? <> on <b>{acc.name}</b></> : null}</>,
        });
      }
    }
    return out
      .filter(e => e.when)
      .sort((a, b) => new Date(b.when).getTime() - new Date(a.when).getTime())
      .slice(0, 8);
  }, [tasks, accountById, personById, listById]);

  const dotColor = (kind) =>
    kind === 'done' ? 'var(--status-done)' :
    kind === 'overdue' ? 'var(--accent)' :
    kind === 'progress' ? 'var(--text-primary)' :
    'var(--text-faint)';

  if (events.length === 0) {
    return <EmptyRow icon={<Activity size={16} />} text={scope === 'team' ? 'Nothing yet today' : 'No recent activity'} />;
  }

  return events.map((e, i) => (
    <div key={i} style={{ padding: '8px 16px', display: 'flex', alignItems: 'flex-start', gap: '10px', borderBottom: '1px solid var(--light-grey)' }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: dotColor(e.kind), flexShrink: 0, marginTop: '6px' }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '11px', color: 'var(--text-primary)', lineHeight: 1.5 }}>{e.text}</p>
        <p style={{ fontSize: '9px', color: 'var(--text-faint)', marginTop: '1px' }}>{fmtRelative(e.when)}</p>
      </div>
    </div>
  ));
}

// ─── shared building blocks ────────────────────────────────────────────────
const cardStyle = {
  background: 'var(--white)',
  border: '1px solid var(--mid-grey)',
  borderRadius: '12px',
  overflow: 'hidden',
};

function Panel({ title, badge, link, onLinkClick, children }) {
  return (
    <div style={cardStyle}>
      <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--mid-grey)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h3 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{title}</h3>
          {badge != null && <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-tertiary)', background: 'var(--light-grey)', borderRadius: '4px', padding: '2px 6px' }}>{badge}</span>}
        </div>
        {link && (
          <button onClick={onLinkClick} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px', fontSize: '10px', fontWeight: 600, color: 'var(--text-tertiary)' }}>
            {link} <ArrowUpRight size={9} />
          </button>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}

function Stat({ label, value, highlight, onClick }) {
  return (
    <button onClick={onClick} style={{
      ...cardStyle,
      textAlign: 'left',
      padding: '14px 16px',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'border-color 0.15s ease',
      borderColor: highlight && value > 0 ? 'rgba(178,15,0,0.2)' : 'var(--mid-grey)',
    }}>
      <div style={{ fontSize: '20px', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.01em', color: highlight && value > 0 ? 'var(--accent)' : 'var(--text-primary)' }}>{value}</div>
      <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '4px' }}>{label}</div>
    </button>
  );
}

function TaskRow({ task, brand, onClick }) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Done';
  return (
    <div onClick={onClick} style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', cursor: onClick ? 'pointer' : 'default', borderBottom: '1px solid var(--light-grey)' }}>
      <div style={{ width: '3px', height: '20px', borderRadius: '99px', background: PRIORITY_BAR[task.priority] || PRIORITY_BAR.Normal, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.title}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
          {brand && <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{brand.name}</span>}
          {task.dueDate && (
            <>
              <span style={{ fontSize: '10px', color: 'var(--border)' }}>·</span>
              <span style={{ fontSize: '10px', color: isOverdue ? 'var(--accent)' : 'var(--text-faint)', fontWeight: isOverdue ? 600 : 400 }}>
                {fmtDate(task.dueDate)}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyRow({ icon, text }) {
  return (
    <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-faint)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
      <span style={{ opacity: 0.4 }}>{icon}</span>
      <span style={{ fontSize: '12px' }}>{text}</span>
    </div>
  );
}

// ─── Designer / Executor Home ───────────────────────────────────────────────
function DesignerHome({ currentUser, state, setSelectedTaskId, setActivePage }) {
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

  const total   = myTasks.length;
  const done    = myTasks.filter(t => t.status === 'Done').length;
  const overdue = myTasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Done').length;
  const urgent  = myTasks.filter(t => t.priority === 'Urgent' && t.status !== 'Done').length;
  const inProgress = myTasks.filter(t => t.status === 'In Progress').length;

  const todayStr = new Date().toISOString().split('T')[0];
  const dueToday = myTasks.filter(t => t.dueDate && t.dueDate.startsWith(todayStr));

  const open = sorted.filter(t => t.status !== 'Done');

  const greeting = getGreeting();
  const dateLine = new Date().toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const assignerIds = [...new Set(myTasks.map(t => t.assignedBy).filter(Boolean))];
  const assigners = assignerIds.map(id => state.members.find(m => m.id === id)).filter(Boolean);

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Greeting header */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          {greeting}, {currentUser.name?.split(' ')[0]}<span style={{ color: 'var(--accent)' }}>.</span>
        </h2>
        <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px' }}>{dateLine}</p>
      </div>

      {/* Attention strip */}
      {overdue > 0 && (
        <div style={{ padding: '12px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--accent-5)', border: '1px solid var(--accent-15)' }}>
          <AlertTriangle size={14} color="var(--accent)" />
          <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
            <span style={{ color: 'var(--accent)' }}>{overdue} overdue task{overdue > 1 ? 's' : ''}</span>
          </p>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        <Stat label="My Tasks"    value={total}      onClick={() => setActivePage('Tasks')} />
        <Stat label="Due Today"   value={dueToday.length} highlight onClick={() => setActivePage('Tasks')} />
        <Stat label="In Progress" value={inProgress} onClick={() => setActivePage('Tasks')} />
        <Stat label="Completed"   value={done}       onClick={() => setActivePage('Tasks')} />
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '5fr 4fr', gap: '16px', alignItems: 'start' }}>
        {/* Left col: My Focus + Live Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Panel title="My Focus" badge={open.length || undefined} link="All" onLinkClick={() => setActivePage('Tasks')}>
            {open.length === 0 ? (
              <EmptyRow icon={<CheckSquare size={16} />} text="All caught up" />
            ) : (
              <>
                {open.filter(t => t.dueDate && new Date(t.dueDate) < new Date()).length > 0 && (
                  <div style={{ padding: '6px 16px', background: 'var(--accent-5)' }}>
                    <p style={{ fontSize: '9px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.16em' }}>Overdue</p>
                  </div>
                )}
                {open
                  .filter(t => t.dueDate && new Date(t.dueDate) < new Date())
                  .map(task => <TaskRow key={task.id} task={task} brand={task.brand} onClick={() => setSelectedTaskId(task.id)} />)}

                {dueToday.length > 0 && (
                  <div style={{ padding: '6px 16px', background: 'var(--off-white)' }}>
                    <p style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.16em' }}>Today</p>
                  </div>
                )}

                {open
                  .filter(t => !(t.dueDate && new Date(t.dueDate) < new Date()))
                  .slice(0, 8)
                  .map(task => <TaskRow key={task.id} task={task} brand={task.brand} onClick={() => setSelectedTaskId(task.id)} />)}
              </>
            )}
          </Panel>

          {/* Live Activity — only my tasks for designer */}
          <Panel title="Live Activity" badge={undefined}>
            <LiveActivity
              tasks={myTasks}
              members={state.members}
              spaces={state.spaces}
              lists={state.lists}
              scope="me"
            />
          </Panel>
        </div>

        {/* Right col: Snapshot + Assigners + My Accounts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Panel title="Snapshot">
            <div style={{ padding: '14px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { label: 'Urgent',    value: urgent,    color: 'var(--accent)' },
                { label: 'Overdue',   value: overdue,   color: 'var(--accent)' },
                { label: 'In Progress', value: inProgress, color: 'var(--text-primary)' },
                { label: 'Completed', value: done,      color: 'var(--status-done)' },
              ].map(s => (
                <div key={s.label} style={{ background: 'var(--off-white)', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ fontSize: '20px', fontWeight: 900, lineHeight: 1, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginTop: '4px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </Panel>

          {/* My Accounts — assigned brands with task counts */}
          {(() => {
            const assignedSpaceIds = new Set(
              state.brandAssignments.filter(b => b.profileId === currentUser.id).map(b => b.spaceId)
            );
            const taskBasedSpaceIds = new Set();
            state.tasks
              .filter(t => (t.assignees || []).includes(currentUser.id))
              .forEach(t => {
                const list = state.lists.find(l => l.id === t.listId);
                if (list) taskBasedSpaceIds.add(list.spaceId);
              });
            const myBrands = state.spaces.filter(sp => assignedSpaceIds.has(sp.id) || taskBasedSpaceIds.has(sp.id));
            if (myBrands.length === 0) return null;
            return (
              <Panel title="My Accounts" badge={myBrands.length} link="All" onLinkClick={() => setActivePage('Accounts')}>
                {myBrands.slice(0, 6).map(sp => {
                  const listIds = state.lists.filter(l => l.spaceId === sp.id).map(l => l.id);
                  const accTasks = state.tasks.filter(t => listIds.includes(t.listId) && (t.assignees || []).includes(currentUser.id) && t.status !== 'Done');
                  const accOverdue = accTasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date()).length;
                  return (
                    <button
                      key={sp.id}
                      onClick={() => setActivePage('Accounts')}
                      style={{ width: '100%', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', background: 'transparent', border: 'none', borderBottom: '1px solid var(--light-grey)', cursor: 'pointer', textAlign: 'left' }}
                    >
                      <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: sp.color || 'var(--text-primary)', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', flexShrink: 0 }}>
                        {sp.icon || sp.name.slice(0, 2).toUpperCase()}
                      </div>
                      <p style={{ flex: 1, fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sp.name}</p>
                      {accOverdue > 0 && <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--accent)' }}>{accOverdue} late</span>}
                      <span style={{ fontSize: '10px', color: 'var(--text-faint)', fontWeight: 600 }}>{accTasks.length}t</span>
                    </button>
                  );
                })}
              </Panel>
            );
          })()}

          {assigners.length > 0 && (
            <Panel title="Assigners" badge={assigners.length}>
              {assigners.map(a => {
                const count = myTasks.filter(t => t.assignedBy === a.id).length;
                return (
                  <div key={a.id} style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--light-grey)' }}>
                    <img src={a.avatar} alt={a.name} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.name}</p>
                      <p style={{ fontSize: '10px', color: 'var(--text-faint)', marginTop: '1px' }}>{a.role}</p>
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-tertiary)', background: 'var(--light-grey)', borderRadius: '4px', padding: '2px 6px' }}>
                      {count} task{count !== 1 ? 's' : ''}
                    </span>
                  </div>
                );
              })}
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Manager / Admin Home ────────────────────────────────────────────────────
function ManagerHome({ currentUser, state, setSelectedTaskId, setActivePage }) {
  const allTasks = state.tasks;
  const total   = allTasks.length;
  const done    = allTasks.filter(t => t.status === 'Done').length;
  const overdue = allTasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Done').length;
  const urgent  = allTasks.filter(t => t.priority === 'Urgent' && t.status !== 'Done').length;
  const inProgress = allTasks.filter(t => t.status === 'In Progress').length;

  const executors = state.members.filter(m => m.role === 'Executive' || m.role === 'Creative Associate');

  const greeting = getGreeting();
  const dateLine = new Date().toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  // Brands at risk
  const brandsAtRisk = state.spaces.map(sp => {
    const listIds = state.lists.filter(l => l.spaceId === sp.id).map(l => l.id);
    const tasksInBrand = allTasks.filter(t => listIds.includes(t.listId));
    const ovd = tasksInBrand.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Done').length;
    return { sp, ovd };
  }).filter(b => b.ovd > 0).sort((a, b) => b.ovd - a.ovd);

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Greeting */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          {greeting}, {currentUser.name?.split(' ')[0]}<span style={{ color: 'var(--accent)' }}>.</span>
        </h2>
        <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px' }}>{dateLine}</p>
      </div>

      {/* Attention strip */}
      {(overdue > 0 || brandsAtRisk.length > 0) && (
        <div style={{ padding: '12px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', background: overdue > 0 ? 'var(--accent-5)' : 'var(--light-grey)', border: overdue > 0 ? '1px solid var(--accent-15)' : '1px solid var(--mid-grey)' }}>
          <AlertTriangle size={14} color={overdue > 0 ? 'var(--accent)' : 'var(--text-tertiary)'} />
          <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
            {overdue > 0 && <span style={{ color: 'var(--accent)' }}>{overdue} overdue task{overdue > 1 ? 's' : ''}</span>}
            {overdue > 0 && brandsAtRisk.length > 0 && <span style={{ color: 'var(--text-faint)' }}> · </span>}
            {brandsAtRisk.length > 0 && <span>{brandsAtRisk.length} brand{brandsAtRisk.length > 1 ? 's' : ''} at risk</span>}
          </p>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        <Stat label="Total Tasks"  value={total}      onClick={() => setActivePage('Tasks')} />
        <Stat label="In Progress"  value={inProgress} onClick={() => setActivePage('Tasks')} />
        <Stat label="Urgent"       value={urgent}     highlight onClick={() => setActivePage('Tasks')} />
        <Stat label="Overdue"      value={overdue}    highlight onClick={() => setActivePage('Tasks')} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '5fr 4fr 3fr', gap: '16px', alignItems: 'start' }}>
        {/* Col 1: Team Bandwidth + Live Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Panel title="Team Bandwidth" badge={executors.length}>
            {executors.length === 0 ? (
              <EmptyRow icon={<Activity size={16} />} text="No team members yet" />
            ) : executors.map(member => {
              const mt = allTasks.filter(t => t.assignees?.includes(member.id));
              const md = mt.filter(t => t.status === 'Done').length;
              const ovd = mt.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Done').length;
              const open = mt.length - md;
              const pct = mt.length > 0 ? Math.min((open * 15), 100) : 0;
              return (
                <div key={member.id} style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--light-grey)' }}>
                  <img src={member.avatar} alt={member.name} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.name}</p>
                      <span style={{ fontSize: '10px', color: 'var(--text-faint)', flexShrink: 0 }}>{md}/{mt.length}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                      <div style={{ flex: 1, height: '4px', background: 'var(--light-grey)', borderRadius: '99px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: open > 5 ? 'var(--accent)' : 'var(--text-primary)', borderRadius: '99px' }} />
                      </div>
                      <span style={{ fontSize: '10px', color: 'var(--text-dim)', fontWeight: 600, width: '24px', textAlign: 'right' }}>{open}</span>
                    </div>
                  </div>
                  {ovd > 0 && <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--accent)', background: 'var(--accent-5)', padding: '2px 6px', borderRadius: '4px' }}>{ovd} late</span>}
                </div>
              );
            })}
          </Panel>

          <Panel title="Live Activity">
            <LiveActivity
              tasks={allTasks}
              members={state.members}
              spaces={state.spaces}
              lists={state.lists}
              scope="team"
            />
          </Panel>
        </div>

        {/* Col 2: Connection Matrix (Accounts × Team × Tasks) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Panel title="Accounts × Team × Tasks" link="All" onLinkClick={() => setActivePage('Accounts')}>
            {state.spaces.length === 0 ? (
              <EmptyRow icon={<Link2 size={16} />} text="No brands yet" />
            ) : state.spaces.slice(0, 8).map(sp => {
              const listIds = state.lists.filter(l => l.spaceId === sp.id).map(l => l.id);
              const accTasks = allTasks.filter(t => listIds.includes(t.listId) && t.status !== 'Done');
              const ovd = accTasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date()).length;
              const teamOnAcc = state.brandAssignments
                .filter(b => b.spaceId === sp.id)
                .map(b => state.members.find(m => m.id === b.profileId))
                .filter(Boolean);
              return (
                <button
                  key={sp.id}
                  onClick={() => setActivePage('Accounts')}
                  style={{ width: '100%', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', background: 'transparent', border: 'none', borderBottom: '1px solid var(--light-grey)', cursor: 'pointer', textAlign: 'left' }}
                >
                  <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: sp.color || 'var(--text-primary)', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', flexShrink: 0 }}>
                    {sp.icon || sp.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sp.name}</p>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {teamOnAcc.slice(0, 3).map(p => (
                          <img key={p.id} src={p.avatar} alt={p.name} title={p.name} style={{ width: '18px', height: '18px', borderRadius: '50%', border: '1.5px solid var(--white)', marginLeft: '-4px', objectFit: 'cover' }} />
                        ))}
                        {teamOnAcc.length > 3 && (
                          <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'var(--light-grey)', color: 'var(--text-tertiary)', fontSize: '8px', fontWeight: 700, border: '1.5px solid var(--white)', marginLeft: '-4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+{teamOnAcc.length - 3}</span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontWeight: 600 }}>{accTasks.length} open</span>
                      {ovd > 0 && <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--accent)' }}>· {ovd} late</span>}
                    </div>
                  </div>
                </button>
              );
            })}
          </Panel>
        </div>

        {/* Col 3: Brands at risk */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Panel title={brandsAtRisk.length > 0 ? 'At Risk' : 'All Brands'} badge={brandsAtRisk.length > 0 ? brandsAtRisk.length : state.spaces.length}>
            {(brandsAtRisk.length > 0 ? brandsAtRisk : state.spaces.map(sp => ({ sp, ovd: 0 }))).slice(0, 8).map(({ sp, ovd }) => {
              const listIds = state.lists.filter(l => l.spaceId === sp.id).map(l => l.id);
              const taskCount = allTasks.filter(t => listIds.includes(t.listId)).length;
              return (
                <button key={sp.id} onClick={() => setActivePage('Accounts')} style={{ width: '100%', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', borderBottom: '1px solid var(--light-grey)', cursor: 'pointer', textAlign: 'left' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: ovd > 0 ? 'var(--accent-10)' : 'var(--light-grey)', color: ovd > 0 ? 'var(--accent)' : 'var(--text-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: 700, flexShrink: 0 }}>
                    {sp.name.slice(0, 2).toUpperCase()}
                  </div>
                  <p style={{ flex: 1, fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sp.name}</p>
                  {ovd > 0
                    ? <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--accent)' }}>{ovd} late</span>
                    : <span style={{ fontSize: '9px', color: 'var(--text-faint)', fontWeight: 600 }}>{taskCount}t</span>}
                </button>
              );
            })}
          </Panel>
        </div>
      </div>
    </div>
  );
}

// ─── Root export ─────────────────────────────────────────────────────────────
export default function HomeView() {
  const { state } = useStore();
  const { currentUser, setSelectedTaskId, setActivePage } = useUI();

  if (!currentUser) return null;

  const isManager = currentUser.role === 'Admin' || currentUser.role === 'Team Lead';
  return isManager
    ? <ManagerHome currentUser={currentUser} state={state} setSelectedTaskId={setSelectedTaskId} setActivePage={setActivePage} />
    : <DesignerHome currentUser={currentUser} state={state} setSelectedTaskId={setSelectedTaskId} setActivePage={setActivePage} />;
}
