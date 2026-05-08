import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Palette, Save, Briefcase, MapPin, Phone, Mail, Image as ImageIcon, Check } from 'lucide-react';
import { useUI } from '../../store/UIContext';
import { useStore } from '../../store/StoreContext';

const STATUS_OPTIONS = ['Available', 'Busy', 'Do Not Disturb', 'Away'];
const STATUS_COLOR = {
  Available:        '#2e7d32',
  Busy:             '#e65100',
  'Do Not Disturb': '#b71c1c',
  Away:             '#f9a825',
};

// ── Profile form (re-mounted via `key` when user identity changes) ──────────
function ProfileForm({ currentUser, setCurrentUser, dispatch }) {
  const [name,     setName]     = useState(currentUser.name     || '');
  const [phone,    setPhone]    = useState(currentUser.phone    || '');
  const [title,    setTitle]    = useState(currentUser.title    || '');
  const [location, setLocation] = useState(currentUser.location || '');
  const [bio,      setBio]      = useState(currentUser.bio      || '');
  const [avatar,   setAvatar]   = useState(currentUser.avatar   || '');
  const [status,   setStatus]   = useState(currentUser.status   || 'Available');
  const [saving,   setSaving]   = useState(false);
  const [savedTip, setSavedTip] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    const updates = {
      name:     name.trim(),
      phone:    phone.trim(),
      title:    title.trim(),
      location: location.trim(),
      bio:      bio.trim(),
      avatar:   avatar.trim(),
      status,
    };
    dispatch({ type: 'UPDATE_PROFILE', payload: { profileId: currentUser.id, updates } });
    setCurrentUser({ ...currentUser, ...updates });
    setTimeout(() => {
      setSaving(false);
      setSavedTip(true);
      setTimeout(() => setSavedTip(false), 2000);
    }, 300);
  };

  const initials = (currentUser.name || currentUser.email || '?')
    .split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const inp  = { width: '100%', padding: '10px 14px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'var(--color-text)', outline: 'none', fontSize: '14px', boxSizing: 'border-box' };
  const lbl  = { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' };
  const card = { backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '24px' };

  return (
    <form onSubmit={handleSave} style={card}>
      <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <User size={16} /> My Profile
      </h3>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          {avatar ? (
            <img src={avatar} alt={name} style={{ width: '84px', height: '84px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-border)' }} />
          ) : (
            <div style={{ width: '84px', height: '84px', borderRadius: '50%', background: '#111111', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 800 }}>
              {initials}
            </div>
          )}
          <span title={status} style={{ position: 'absolute', bottom: '4px', right: '4px', width: '14px', height: '14px', borderRadius: '50%', backgroundColor: STATUS_COLOR[status], border: '2px solid var(--color-surface)' }} />
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={lbl}><User size={11}/> Full Name</label>
            <input style={inp} value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required />
          </div>
          <div>
            <label style={lbl}><ImageIcon size={11}/> Avatar URL</label>
            <input style={inp} value={avatar} onChange={e => setAvatar(e.target.value)} placeholder="https://… (leave blank to use initials)" />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <div>
          <label style={lbl}><Briefcase size={11}/> Job Title</label>
          <input style={inp} value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Senior Designer" />
        </div>
        <div>
          <label style={lbl}><MapPin size={11}/> Location</label>
          <input style={inp} value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Mumbai, India" />
        </div>
        <div>
          <label style={lbl}><Phone size={11}/> Phone</label>
          <input style={inp} value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 …" />
        </div>
        <div>
          <label style={lbl}>Status</label>
          <select style={{ ...inp, cursor: 'pointer' }} value={status} onChange={e => setStatus(e.target.value)}>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={lbl}><Mail size={11}/> Email</label>
          <input style={{ ...inp, opacity: 0.6, cursor: 'not-allowed' }} value={currentUser.email} disabled />
          <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>Email is managed by an admin. Contact your workspace admin to change it.</p>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={lbl}>Bio / About</label>
          <textarea
            style={{ ...inp, fontFamily: 'inherit', resize: 'vertical', minHeight: '90px' }}
            value={bio}
            onChange={e => setBio(e.target.value)}
            placeholder="Short intro — your background, what you focus on, any other details your team should know."
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '14px', marginTop: '20px' }}>
        {savedTip && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#2e7d32', fontWeight: 600 }}>
            <Check size={13} /> Saved
          </span>
        )}
        <button type="submit" disabled={saving} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '10px 22px', background: '#111111', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '14px', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.5 : 1 }}>
          <Save size={14} />
          {saving ? 'Saving…' : 'Save Profile'}
        </button>
      </div>
    </form>
  );
}

export default function SettingsView() {
  const { currentUser, setCurrentUser } = useUI();
  const { dispatch } = useStore();

  if (!currentUser) return null;

  const card = { backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '24px' };

  return (
    <div style={{ padding: '32px 40px', maxWidth: '760px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>

      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Settings</h1>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '12px', marginTop: '2px' }}>
          Personalise your profile and notification preferences.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <ProfileForm
          key={currentUser.id}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          dispatch={dispatch}
        />

        <div style={card}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Palette size={16} /> Preferences
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>
            <div>
              <div style={{ fontWeight: 500 }}>Dark Mode</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Use dark theme across all workspaces</div>
            </div>
            <input type="checkbox" defaultChecked style={{ accentColor: 'var(--color-accent)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
            <div>
              <div style={{ fontWeight: 500 }}>Compact View</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Reduce padding in list and table views</div>
            </div>
            <input type="checkbox" style={{ accentColor: 'var(--color-accent)' }} />
          </div>
        </div>

        <div style={card}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={16} /> Notifications
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
            <div>
              <div style={{ fontWeight: 500 }}>Email Digests</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Receive daily summary of tasks due soon</div>
            </div>
            <input type="checkbox" defaultChecked style={{ accentColor: 'var(--color-accent)' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
