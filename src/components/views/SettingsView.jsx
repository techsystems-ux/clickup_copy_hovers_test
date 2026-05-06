import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Lock, Palette, CreditCard, Users, Plus } from 'lucide-react';
import { useUI } from '../../store/UIContext';
import { useStore } from '../../store/StoreContext';

export default function SettingsView() {
  const { currentUser } = useUI();
  const { dispatch, state } = useStore();

  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const newMember = {
      id: `u_${crypto.randomUUID()}`,
      name: newUserName,
      email: newUserEmail,
      role: 'Executive',
      avatar: `https://i.pravatar.cc/150?u=${newUserEmail}`,
      status: 'Available'
    };

    dispatch({ type: 'ADD_MEMBER', payload: newMember });
    setNewUserName('');
    setNewUserEmail('');
    alert(`Successfully added ${newUserName} to the team!`);
  };

  const isAdminOrOwner = currentUser?.role === 'Admin' || currentUser?.role === 'Manager';

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <h2 style={{ fontSize: '32px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <SettingsIcon size={28} /> Workspace Settings
      </h2>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px' }}>Manage your workspace preferences, members, and billing.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {isAdminOrOwner && (
          <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} /> Team Management
            </h3>
            
            <form onSubmit={handleAddMember} style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '16px', backgroundColor: 'var(--color-bg)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
              <input 
                type="text" 
                placeholder="Name" 
                value={newUserName}
                required
                onChange={e => setNewUserName(e.target.value)}
                style={{ flex: 1, padding: '10px 12px', backgroundColor: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text)', outline: 'none' }} 
              />
              <input 
                type="email" 
                placeholder="Email Address"
                value={newUserEmail}
                required 
                onChange={e => setNewUserEmail(e.target.value)}
                style={{ flex: 1, padding: '10px 12px', backgroundColor: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text)', outline: 'none' }} 
              />
              <button type="submit" style={{ padding: '10px 16px', backgroundColor: 'var(--color-accent)', borderRadius: '6px', border: 'none', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <Plus size={16}/> Add Member
              </button>
            </form>

            <div style={{ marginTop: '24px' }}>
              <h4 style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>CURRENT TEAM ({state.members.length})</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {state.members.map(m => (
                  <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={m.avatar} alt="Avatar" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '14px' }}>{m.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{m.email}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '99px', fontWeight: 700, backgroundColor: m.role === 'Admin' ? '#111111' : m.role === 'Manager' ? '#333333' : 'var(--color-surface-2)', color: m.role === 'Admin' || m.role === 'Manager' ? '#ffffff' : 'var(--color-text-muted)' }}>
                      {m.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* Profile Settings */}
        <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={18} /> My Profile
          </h3>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--color-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' }}>
              AS
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="text" defaultValue={currentUser?.name} style={{ padding: '8px 12px', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text)' }} />
              <input type="email" defaultValue={currentUser?.email} style={{ padding: '8px 12px', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text)' }} />
              <button style={{ alignSelf: 'flex-start', padding: '8px 16px', backgroundColor: 'var(--color-surface-2)', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold' }}>Update Avatar</button>
            </div>
          </div>
        </div>

        {/* Global Preferences */}
        <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Palette size={18} /> Preferences
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

        {/* Notifications */}
        <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={18} /> Notifications
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>
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
