import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Users, Building2, BarChart2, Plus, Eye, EyeOff,
  Trash2, Edit3, Check, X, ShieldCheck,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useStore } from '../../store/StoreContext';
import { useUI } from '../../store/UIContext';

// Secondary client with no session persistence — signUp won't override the admin's session
const signupClient = createClient(
  import.meta.env.VITE_SUPABASE_URL     || 'https://pixgrkvanbxoceynyzoz.supabase.co',
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_s-yQCIKFbpjzdzBB38-2XA_FK9HJ12P',
  { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }
);

const ROLES = ['Manager', 'Executive', 'Graphic Designer'];

const ROLE_STYLE = {
  Admin:              { bg: '#111111',               color: '#ffffff' },
  Manager:            { bg: '#2c2c2c',               color: '#ffffff' },
  Executive:          { bg: 'rgba(33,150,243,0.15)', color: '#1565c0' },
  'Graphic Designer': { bg: 'rgba(156,39,176,0.12)', color: '#7b1fa2' },
};

const PRESET_COLORS = ['#111111','#e91e63','#ff6900','#2196f3','#4caf50','#ff9800','#9c27b0','#00bcd4','#f44336','#607d8b'];
const PRESET_ICONS  = ['🚀','🛍️','🌸','⚡','🎯','💎','🎨','📱','🏆','🌟','🎬','📦'];

function RoleBadge({ role }) {
  const s = ROLE_STYLE[role] || { bg: 'var(--color-surface-2)', color: 'var(--color-text-muted)' };
  return (
    <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '99px', backgroundColor: s.bg, color: s.color, whiteSpace: 'nowrap' }}>
      {role}
    </span>
  );
}

export default function AdminDashboard() {
  const { state, dispatch } = useStore();
  const { currentUser } = useUI();
  const [tab, setTab] = useState('team');

  // ── Create user ──────────────────────────────────────────────────────────
  const [uName,     setUName]     = useState('');
  const [uEmail,    setUEmail]    = useState('');
  const [uPass,     setUPass]     = useState('');
  const [uRole,     setURole]     = useState('Graphic Designer');
  const [showPass,  setShowPass]  = useState(false);
  const [creating,  setCreating]  = useState(false);
  const [createMsg, setCreateMsg] = useState(null);

  // ── Role editing ─────────────────────────────────────────────────────────
  const [editingRole, setEditingRole] = useState(null);

  // ── Create brand ─────────────────────────────────────────────────────────
  const [bName,  setBName]  = useState('');
  const [bColor, setBColor] = useState('#111111');
  const [bIcon,  setBIcon]  = useState('🚀');

  // ── Add list ─────────────────────────────────────────────────────────────
  const [addListTo,   setAddListTo]   = useState(null);
  const [newListName, setNewListName] = useState('');

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!uName || !uEmail || !uPass) return;
    setCreating(true);
    setCreateMsg(null);

    try {
      const { data, error } = await signupClient.auth.signUp({ email: uEmail, password: uPass });
      if (error) throw error;
      if (!data.user) {
        throw new Error(
          'Account queued for email confirmation. To allow instant login, disable "Confirm email" in Supabase → Authentication → Settings.'
        );
      }

      const { error: profErr } = await supabase.from('profiles').insert({
        id: data.user.id, name: uName, email: uEmail,
        role: uRole, avatar: '', status: 'Available',
      });
      if (profErr) throw profErr;

      dispatch({
        type: 'ADD_MEMBER_LOCAL',
        payload: {
          id: data.user.id, name: uName, email: uEmail, role: uRole,
          avatar: `https://i.pravatar.cc/150?u=${uEmail}`, status: 'Available',
        },
      });

      setUName(''); setUEmail(''); setUPass('');
      setCreateMsg({ ok: true, text: `${uName} created. They can log in now.` });
    } catch (err) {
      setCreateMsg({ ok: false, text: err.message });
    } finally {
      setCreating(false);
    }
  };

  const handleRoleChange = (memberId, role) => {
    dispatch({ type: 'UPDATE_MEMBER_ROLE', payload: { memberId, role } });
    setEditingRole(null);
  };

  const handleDeleteMember = (member) => {
    if (!window.confirm(`Remove ${member.name} from the team? This cannot be undone.`)) return;
    dispatch({ type: 'DELETE_MEMBER', payload: { memberId: member.id } });
  };

  const handleCreateBrand = (e) => {
    e.preventDefault();
    if (!bName.trim()) return;
    dispatch({ type: 'ADD_SPACE', payload: { id: `sp_${crypto.randomUUID()}`, name: bName.trim(), color: bColor, icon: bIcon } });
    setBName(''); setBColor('#111111'); setBIcon('🚀');
  };

  const handleAddList = (spaceId) => {
    if (!newListName.trim()) return;
    dispatch({ type: 'ADD_LIST', payload: { id: `l_${crypto.randomUUID()}`, spaceId, name: newListName.trim() } });
    setNewListName(''); setAddListTo(null);
  };

  const handleDeleteList = (listId) => {
    if (!window.confirm('Delete this list? All tasks inside will also be deleted.')) return;
    dispatch({ type: 'DELETE_LIST', payload: { listId } });
  };

  // ── Overview data ─────────────────────────────────────────────────────────
  const tasks = state.tasks;
  const statusCounts = {
    'To Do':       tasks.filter(t => t.status === 'To Do').length,
    'In Progress': tasks.filter(t => t.status === 'In Progress').length,
    'Done':        tasks.filter(t => t.status === 'Done').length,
  };
  const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Done').length;

  const brandStats = state.spaces.map(sp => {
    const listIds = state.lists.filter(l => l.spaceId === sp.id).map(l => l.id);
    return { ...sp, count: tasks.filter(t => listIds.includes(t.listId)).length };
  });
  const maxBrand = Math.max(...brandStats.map(b => b.count), 1);

  const workload = state.members
    .filter(m => m.role !== 'Admin' && m.role !== 'Manager')
    .map(m => ({ ...m, active: tasks.filter(t => (t.assignees || []).includes(m.id) && t.status !== 'Done').length }))
    .sort((a, b) => b.active - a.active);

  // ── Shared styles ─────────────────────────────────────────────────────────
  const inp  = { width: '100%', padding: '10px 14px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'var(--color-text)', outline: 'none', fontSize: '14px', boxSizing: 'border-box' };
  const lbl  = { display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' };
  const card = { backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '24px' };

  return (
    <div style={{ padding: '32px 40px', maxWidth: '960px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#111111', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ShieldCheck size={22} color="white" />
        </div>
        <div>
          <h1 style={{ fontSize: '26px', fontFamily: 'var(--font-display)', fontWeight: 700, lineHeight: 1.2 }}>Admin Panel</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginTop: '2px' }}>
            Manage team, brands, and workspace · {currentUser?.name}
          </p>
        </div>
      </div>

      {/* Tab navigation */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '28px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '10px', padding: '4px', width: 'fit-content' }}>
        {[{ id: 'team', label: 'Team', Icon: Users }, { id: 'brands', label: 'Brands', Icon: Building2 }, { id: 'overview', label: 'Overview', Icon: BarChart2 }].map(({ id, label, Icon }) => (
          <button key={id} onClick={() => setTab(id)} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 18px', borderRadius: '7px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, transition: 'all 0.15s', backgroundColor: tab === id ? '#111111' : 'transparent', color: tab === id ? '#ffffff' : 'var(--color-text-muted)' }}>
            <Icon size={14} />{label}
          </button>
        ))}
      </div>

      {/* ── TEAM TAB ──────────────────────────────────────────────────────── */}
      {tab === 'team' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          <div style={card}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={16} /> Create New Account
            </h3>

            <div style={{ marginBottom: '16px', padding: '12px 16px', backgroundColor: 'rgba(33,150,243,0.08)', border: '1px solid rgba(33,150,243,0.25)', borderRadius: '8px', fontSize: '13px', color: '#1565c0', lineHeight: '1.5' }}>
              ℹ Requires <strong>email confirmation disabled</strong> in your Supabase project:
              Authentication → Settings → toggle off "Enable email confirmations".
            </div>

            <form onSubmit={handleCreateUser} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={lbl}>Full Name</label>
                <input style={inp} value={uName} onChange={e => setUName(e.target.value)} placeholder="e.g. Sarah Connor" required />
              </div>
              <div>
                <label style={lbl}>Email Address</label>
                <input style={inp} type="email" value={uEmail} onChange={e => setUEmail(e.target.value)} placeholder="sarah@hoversagency.com" required />
              </div>
              <div style={{ position: 'relative' }}>
                <label style={lbl}>Password</label>
                <input style={inp} type={showPass ? 'text' : 'password'} value={uPass} onChange={e => setUPass(e.target.value)} placeholder="Min 6 characters" minLength={6} required />
                <button type="button" onClick={() => setShowPass(p => !p)} style={{ position: 'absolute', right: '12px', top: '31px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '4px' }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <div>
                <label style={lbl}>Role</label>
                <select style={{ ...inp, cursor: 'pointer' }} value={uRole} onChange={e => setURole(e.target.value)}>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              {createMsg && (
                <div style={{ gridColumn: '1 / -1', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', backgroundColor: createMsg.ok ? 'rgba(76,175,80,0.1)' : 'rgba(178,15,0,0.08)', border: `1px solid ${createMsg.ok ? 'rgba(76,175,80,0.3)' : 'rgba(178,15,0,0.25)'}`, color: createMsg.ok ? '#2e7d32' : '#b20f00' }}>
                  {createMsg.text}
                </div>
              )}

              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" disabled={creating} style={{ padding: '10px 24px', backgroundColor: '#111111', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '14px', cursor: creating ? 'not-allowed' : 'pointer', opacity: creating ? 0.5 : 1 }}>
                  {creating ? 'Creating…' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>

          <div style={card}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={16} /> Team Members ({state.members.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {state.members.length === 0 && (
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>No members loaded yet.</p>
              )}
              {state.members.map(m => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', border: '1px solid var(--color-border)', borderRadius: '10px', backgroundColor: 'var(--color-bg)' }}>
                  <img src={m.avatar || `https://i.pravatar.cc/40?u=${m.email}`} alt={m.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>
                      {m.name}
                      {m.id === currentUser?.id && <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginLeft: '8px', fontWeight: 400 }}>you</span>}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{m.email}</div>
                  </div>

                  {editingRole?.id === m.id ? (
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <select value={editingRole.role} onChange={e => setEditingRole({ ...editingRole, role: e.target.value })} style={{ padding: '5px 8px', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '12px', background: 'var(--color-surface)', color: 'var(--color-text)', outline: 'none' }}>
                        {['Admin', ...ROLES].map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <button onClick={() => handleRoleChange(m.id, editingRole.role)} style={{ background: '#4caf50', border: 'none', borderRadius: '6px', padding: '5px 8px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center' }}><Check size={13} /></button>
                      <button onClick={() => setEditingRole(null)} style={{ background: 'var(--color-surface-2)', border: 'none', borderRadius: '6px', padding: '5px 8px', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}><X size={13} /></button>
                    </div>
                  ) : (
                    <RoleBadge role={m.role} />
                  )}

                  {m.id !== currentUser?.id && !editingRole && (
                    <button onClick={() => setEditingRole({ id: m.id, role: m.role })} title="Change role" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '4px', display: 'flex', alignItems: 'center' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
                    >
                      <Edit3 size={14} />
                    </button>
                  )}

                  {m.id !== currentUser?.id && m.role !== 'Admin' && !editingRole && (
                    <button onClick={() => handleDeleteMember(m)} title="Remove member" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '4px', display: 'flex', alignItems: 'center' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#b20f00'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── BRANDS TAB ────────────────────────────────────────────────────── */}
      {tab === 'brands' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          <div style={card}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={16} /> Add New Brand
            </h3>
            <form onSubmit={handleCreateBrand} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={lbl}>Brand Name</label>
                <input style={inp} value={bName} onChange={e => setBName(e.target.value)} placeholder="e.g. Apex Sport" required />
              </div>
              <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                <div>
                  <label style={lbl}>Brand Color</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                    {PRESET_COLORS.map(c => (
                      <div key={c} onClick={() => setBColor(c)} style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: c, cursor: 'pointer', border: bColor === c ? '3px solid white' : '2px solid transparent', outline: bColor === c ? `2px solid ${c}` : 'none', transition: 'all 0.15s' }} />
                    ))}
                  </div>
                </div>
                <div>
                  <label style={lbl}>Icon</label>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                    {PRESET_ICONS.map(icon => (
                      <button key={icon} type="button" onClick={() => setBIcon(icon)} style={{ fontSize: '18px', background: bIcon === icon ? 'var(--color-surface-2)' : 'none', border: bIcon === icon ? '2px solid var(--color-border)' : '2px solid transparent', borderRadius: '7px', padding: '4px 6px', cursor: 'pointer', transition: 'all 0.15s' }}>
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
                <span style={{ fontSize: '20px' }}>{bIcon}</span>
                <span style={{ fontWeight: 700, color: bColor, fontSize: '15px' }}>{bName || 'Brand Name Preview'}</span>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: bColor, marginLeft: 'auto' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" style={{ padding: '10px 24px', backgroundColor: '#111111', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
                  Create Brand
                </button>
              </div>
            </form>
          </div>

          <div style={card}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={16} /> Brands ({state.spaces.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {state.spaces.length === 0 && <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>No brands yet.</p>}
              {state.spaces.map(sp => {
                const spLists = state.lists.filter(l => l.spaceId === sp.id);
                const spTaskCount = tasks.filter(t => spLists.map(l => l.id).includes(t.listId)).length;
                return (
                  <div key={sp.id} style={{ border: '1px solid var(--color-border)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', backgroundColor: 'var(--color-bg)' }}>
                      <span style={{ fontSize: '20px' }}>{sp.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: sp.color || 'var(--color-text)', fontSize: '15px' }}>{sp.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{spLists.length} list{spLists.length !== 1 ? 's' : ''} · {spTaskCount} task{spTaskCount !== 1 ? 's' : ''}</div>
                      </div>
                      <button onClick={() => setAddListTo(addListTo === sp.id ? null : sp.id)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '7px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                        <Plus size={13} /> Add List
                      </button>
                    </div>

                    {spLists.length > 0 && (
                      <div style={{ padding: '0 16px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {spLists.map(l => {
                          const lCount = tasks.filter(t => t.listId === l.id).length;
                          return (
                            <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', backgroundColor: 'var(--color-surface)', borderRadius: '7px', border: '1px solid var(--color-border)', fontSize: '13px' }}>
                              <span style={{ fontWeight: 500 }}>{l.name}</span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{lCount} task{lCount !== 1 ? 's' : ''}</span>
                                <button onClick={() => handleDeleteList(l.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '2px', display: 'flex', alignItems: 'center' }}
                                  onMouseEnter={e => e.currentTarget.style.color = '#b20f00'}
                                  onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {addListTo === sp.id && (
                      <div style={{ padding: '0 16px 14px', display: 'flex', gap: '8px' }}>
                        <input autoFocus value={newListName} onChange={e => setNewListName(e.target.value)} placeholder="List name (e.g. Q4 Campaigns)" style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: '7px', fontSize: '13px', background: 'var(--color-bg)', color: 'var(--color-text)', outline: 'none' }}
                          onKeyDown={e => { if (e.key === 'Enter') handleAddList(sp.id); if (e.key === 'Escape') setAddListTo(null); }}
                        />
                        <button onClick={() => handleAddList(sp.id)} style={{ padding: '8px 14px', background: '#111111', color: 'white', border: 'none', borderRadius: '7px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>Add</button>
                        <button onClick={() => { setAddListTo(null); setNewListName(''); }} style={{ padding: '8px 10px', background: 'var(--color-surface-2)', color: 'var(--color-text-muted)', border: 'none', borderRadius: '7px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><X size={14} /></button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── OVERVIEW TAB ──────────────────────────────────────────────────── */}
      {tab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {[
              { label: 'Total Tasks',  value: tasks.length,               color: 'var(--color-text)' },
              { label: 'In Progress',  value: statusCounts['In Progress'], color: '#2196f3' },
              { label: 'Completed',    value: statusCounts['Done'],         color: '#4caf50' },
              { label: 'Overdue',      value: overdue,                     color: '#b20f00' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ ...card, textAlign: 'center', padding: '20px' }}>
                <div style={{ fontSize: '40px', fontWeight: 800, fontFamily: 'var(--font-display)', color, lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '6px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={card}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={16} /> Tasks by Brand
            </h3>
            {brandStats.length === 0
              ? <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>No brands yet.</p>
              : brandStats.map(({ id, name, color, icon, count }) => (
                <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '18px', flexShrink: 0 }}>{icon}</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, width: '130px', flexShrink: 0, color: color || 'var(--color-text)' }}>{name}</span>
                  <div style={{ flex: 1, backgroundColor: 'var(--color-bg)', borderRadius: '99px', height: '8px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(count / maxBrand) * 100}%`, backgroundColor: color || '#111111', borderRadius: '99px', transition: 'width 0.4s ease', minWidth: count > 0 ? '4px' : '0' }} />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700, width: '28px', textAlign: 'right', flexShrink: 0 }}>{count}</span>
                </div>
              ))
            }
          </div>

          <div style={card}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={16} /> Team Workload
            </h3>
            {workload.length === 0
              ? <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>No executors or designers found.</p>
              : workload.map(m => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <img src={m.avatar || `https://i.pravatar.cc/40?u=${m.email}`} alt={m.name} style={{ width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0 }} />
                  <span style={{ fontSize: '13px', fontWeight: 600, width: '120px', flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</span>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', width: '110px', flexShrink: 0 }}>{m.role}</span>
                  <div style={{ flex: 1, backgroundColor: 'var(--color-bg)', borderRadius: '99px', height: '8px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min((m.active / 8) * 100, 100)}%`, backgroundColor: m.active > 5 ? '#e91e63' : '#2196f3', borderRadius: '99px', transition: 'width 0.4s ease', minWidth: m.active > 0 ? '4px' : '0' }} />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700, width: '64px', textAlign: 'right', flexShrink: 0, color: 'var(--color-text-muted)' }}>{m.active} active</span>
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
}
